import TransactionModel from "../transaction/transaction.modal.js"

export const getReports = async (req, res) =>{
    
    try {
        const {id}= req.user;
        const transactions = await TransactionModel.find({userId:id}).lean();
        
        let totalCredit = 0;
        let totalDebit = 0;

        transactions.forEach((txn)=>{
            if(txn.transactionType == "cr"){
                totalCredit += txn.amount;
            }
            else if(txn.transactionType == "dr"){
                totalDebit += txn.amount
            }
        });

        res.status(200).send({
            message:"Dashboard Reports"
        });

        
    } catch (err) {
        res.status(500).send({
            message: err.message || "Internal Server Error"
        });
    };
};