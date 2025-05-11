import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const ENCRYPTION_KEY = Buffer.from("f5e08e3a270ee191c56352091bff994a33b6fc938b7dd29f94af9cba4b4d9395", "hex"); 
const IV = Buffer.from("dd586085f002ef69b90881694dd37700", "hex");              

function encrypt(text) {
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  }

  const userSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 8,
      },
    },
    { timestamps: true }
  );

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    if (this.isModified("email")) {
      this.email = encrypt(this.email);
    }
  
    next();
  });
  userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
  userSchema.methods.getDecryptedEmail = function () {
    return decrypt(this.email);
  };
const User = mongoose.model("User", userSchema);
export { encrypt, decrypt };
export default User;