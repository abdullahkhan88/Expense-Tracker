import {Router} from "express";
import { createTransaction, updateTransaction, deleteTransaction,  getTransaction} from "./transaction.controller.js";
import {AdminUserGuard} from "../middleware/guard.middleware.js"
const TransactionRouter = Router();

TransactionRouter.post("/create",AdminUserGuard,createTransaction);
TransactionRouter.put("/update/:id",AdminUserGuard,updateTransaction);
TransactionRouter.delete("/delete/:id",AdminUserGuard,deleteTransaction);
TransactionRouter.get("/fetch",getTransaction);

export default  TransactionRouter;