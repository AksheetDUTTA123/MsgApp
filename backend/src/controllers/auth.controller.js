import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { encrypt } from "../models/user.model.js";
import { generateToken } from "../controllers/utils.js";


export const signup =  async (req, res) =>{
    const { email , password} = req.body;
    try {
        if(password.length < 8){
            return res.status(400).json({message : " ERROR WITH PASSWORD LENGTH"});
        }
        const user = await User.findOne({ email: encrypt(email) }); //this checks if user already exists or not, if it does mark error

        if (user) return res.status(400).json({message : " USER ALREADY HAS AN ACCOUNT "});

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User ({
            email,
            password : hashedPassword
        })

        if (newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email
            });

        } else {
            res.status(400).json({message: "Invalid Data"});
        }

    }
    catch (error){
        console.log(error.message);
        res.status(500).json({message: "INTERNAL ERROR"});
    }
};

export const login =  (req, res) =>{
    res.send("login route")
};


export const logout =  (req, res) =>{
    res.send("logout route")
};