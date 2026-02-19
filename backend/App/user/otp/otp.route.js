import { Router } from "express";
import { sendEmail,verifyEmail } from "./otp.controller.js";

const otpRouter = Router();

otpRouter.post("/send-mail",sendEmail);
otpRouter.post("/verify-email",verifyEmail);

export default otpRouter;

// http://localhost:8080/api/otp/send-mail
// http://localhost:8080/api/otp/verify-email
