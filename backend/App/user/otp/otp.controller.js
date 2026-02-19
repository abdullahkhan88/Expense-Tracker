import Otp from "./otp.Model.js";
import UserModel from "../user.model.js";
import bcrypt from "bcrypt";
import { generateOTP } from "../../utils/generate.otp.js";
import sendMail from "../../utils/mail.js";
import otpTemplate from "../../utils/otp.template.js";
import { createUser } from "../user.controller.js";

// send email with sendmailer

export const sendEmail = async (req, res) =>{
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).send({
                message:"Email fields are required"
            });
        };
        const userExist = await UserModel.findOne({email});
        if(userExist){
            return res.status(400).send({
                message:"User already exists",
                success:false
            });
        };
        const OTP = generateOTP();
        const hashOtp = await bcrypt.hash(OTP.toString(),10);
        const expiresAt = new Date(Date.now() + 5*60*1000);
        await Otp.deleteMany({email}); // agar resend otp delete kar do
        await Otp.create({
            email,
            otp:hashOtp,
            expiresAt
        });
        sendMail(email,"OTP for Signup",otpTemplate(OTP))
        res.status(200).send({
            message:"OTP sent Successfully",
        })
    } catch (err) {
        res.status(500).send({
            error:err.message,
            message:"Internal server Error"
        });
    }
};

// verify email controllers
export const verifyEmail = async (req,res) =>{
    try {
        const {email,otp} = req.body;
        console.log(req.body)
        if(!email || !otp){
            return res.status(400).send({
                message:"Email or OTP required",
            });
        };

        // get otp from mongodb database
        const OtpRecord = await Otp.findOne({email});
        if(!OtpRecord){
            return res.status(400).send({
                message:"OTP not found",
                success:false
            });
        }
        if(OtpRecord.expiresAt < Date.now()){
            return res.status(400).send({
                message:"OTP is Expire",
                success:false
            });
        };
        // Match Otp 
        const OtpMatched = await bcrypt.compare(otp.toString(),OtpRecord.otp);
        if(!OtpMatched){
            return res.status(400).send({
                message:"Invalid OTP or expire",
                success:false
            })
        };
        await Otp.deleteOne({email});
        createUser(req,res);
      
        
    } catch (err) {
        res.status(500).send({
            error:err.message,
            message:"Some Internal Problems"
        });
    };
};