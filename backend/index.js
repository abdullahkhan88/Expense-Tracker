import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import connectdb from './App/config/db.js';
import cookieParser from 'cookie-parser';

/* api Router Importing */
import userRouter from './App/user/user.routes.js';
import otpRouter from './App/user/otp/otp.route.js';
import TransactionRouter from './App/transaction/transaction.route.js';


dotenv.config();

// use middleware
const app = express();
app.use(cors({
    origin : process.env.DOMAIN,
    credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// connectdb
connectdb();

app.use(cookieParser())
app.use('/api/user',userRouter);
app.use('/api/otp',otpRouter);
app.use('/api/transaction',TransactionRouter);


const PORT = process.env.PORT || 8000
app.listen(PORT ,() =>{
    console.log(`Server running on the ${PORT}`)
})

