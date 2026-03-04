import { Router } from "express";
import  { AdminUserGuard,AdminGuard,verifyTokenGuard } from "../middleware/guard.middleware.js";
import { 
    createUser,
    login, 
    ForgotPassword,
    verifyToken,
    changePassword,
    logout,
    getAllUsers,
    updateStatus
} from "./user.controller.js";
/* import sendMail from "../utils/mail.js"; */

const userRouter = Router();

// @post /api/user/signup
userRouter.post('/signup',createUser);


// @post /api/user/login
userRouter.post('/login',login);

// @get /api/user/logout
userRouter.get('/logout',logout);

// @get /api/user/getAll User
userRouter.get('/get',AdminGuard,getAllUsers);

// @get /api/user/getAll User
userRouter.put('/status/:id',AdminGuard,updateStatus);

// @post /api/user/forgot-password
userRouter.post('/forgot-password',ForgotPassword);

// @get /api/user/forgot-password
userRouter.get('/session',AdminUserGuard, (req,res)=>{
    return res.json(req.user)
});

//@post /api/user/verify-token
userRouter.post('/verify-token',verifyTokenGuard,verifyToken);

//@put /api/user/change-password
userRouter.put('/change-password',verifyTokenGuard,changePassword);



export default userRouter;

