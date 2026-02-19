import UserModel from './user.model.js';
import sendMail from "../utils/mail.js";
import {forgotPasswordTemplate }from "../utils/forgot.tamplate.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




export const createUser = async (req, res) => {
    try {
        const { fullname, email, password, mobile, status, role } = req.body;

        if (!fullname || !email || !password || !mobile) {
            return res.status(400).send({
                message: "All required fields must be provided"
            });
        }

        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            return res.status(409).send({
                message: "User Already exist with this Email"
            });
        }

        const user = new UserModel({
            fullname,
            email,
            password,
            mobile,
            status,
            role
        });
        await user.save();
        const userRes = user.toObject();
        delete userRes.password; // password ko delete kiya gya hai respose mein show
        res.status(201).send({
            message: "User Created Successfully",
            data: userRes
        })

    } catch (err) {
        res.status(500).send({
            error: err.message,
            message: "Internal Server Error"
        });
    }
};


/* create Token */
const createToken = (user) => {
    const token = jwt.sign({
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
    },
        process.env.AUTH_SECRET,
        { expiresIn: "1d" }
    );
    return token
};


// create Login Controller with jwt
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: "Fields are required !" });
        };
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User Not Found" });
        };
        const existUser = await bcrypt.compare(password, user.password);
        if (!existUser) {
            return res.status(401).send({ message: "Invalid Credentials" })
        };
        user.status = true;
        await user.save();
        const token = createToken(user); // pass function to generate token
        const userRes = user.toObject();
        delete userRes.password;
        const DayMs = 24 * 60 * 60 * 1000; // convert 1 day into milliseconds
        res.cookie("AuthToken", token, {
            httpOnly:true,
            secure: process.env.ENVIRONMENT !== "DEV",
            sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
            path : "/",
            domain : undefined,
            maxAge: DayMs,
        });
        res.status(200).send({
            data: userRes,
            role:user.role,
            message: "login Successfull"
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

// create Forgot Password
export const ForgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        if (!email) {
            return res.status(400).send({ message: "Fields are required !" });
        };
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).send({message:"User doesn't exists" });
        };
        
        const token = jwt.sign({id:user._id},process.env.FORGOT_TOKEN_SECRET,{expiresIn:"15m"});
        const link = `${process.env.DOMAIN}/forgot-password?token=${token}`;
        const sent = await sendMail(email,"Expense - Forgot Password ?",forgotPasswordTemplate(user.fullname,link));
        if(!sent){
            return res.status(404).send({message:"Email sent Failed !"})
        };
        // email sent hoga to inbox check
        res.status(200).send(
            {message:"If this email is registered, you will receive a password reset link"}
        );
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

// verify token 
export const verifyToken = async (req, res) => {
    try {
        
        res.status(200).send(
            {message:"Verification success"}
        );
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

// changePassword
export const changePassword = async (req, res) => {
    try {
        const {password} = req.body;
        const encrypted = await bcrypt.hash(password.toString(),12);
        await UserModel.findByIdAndUpdate(req.user.id,{password:encrypted});
        res.status(200).send(
            {message:"Password Updated successfully"}
        );
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};