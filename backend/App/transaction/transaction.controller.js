import TransactionModel from "./transaction.modal.js";

export const createTransaction = async (req, res) =>{
    try {
        const data = req.body;
        const {id} = req.user;
        data.userId = id;
        const transaction = await new TransactionModel(data).save();
        res.status(200).send({
            message:"Craeted Request",
            data:transaction
        });
    } catch (err) {
        res.status(500).send({
            message: "Some Internal Problems",
            error: err.message
        });
    }
};

export const updateTransaction = async (req, res) =>{
    try {
        const data = req.body;
        const {id} = req.params;
        const transaction = await TransactionModel.findOneAndUpdate({
            _id:id,
            userId:req.user.id
        },data,{new:true});
        if(!transaction){
            return res.status(404).send({
                message:"Data not found that you want to Update"
            });
        }
        res.status(200).send({
            message:"Data Updated succesfully",
            data:transaction
        });
    } catch (err) {
        res.status(500).send({
            message: "Some Internal Problems",
            error: err.message
        });
    }
};

export const deleteTransaction = async (req, res) =>{
    try {
        const {id} = req.params;
        const DeleteTransaction = await TransactionModel.findOneAndDelete({
            _id:id,
            userId: req.user.id });
        if(!DeleteTransaction){
            return res.status(404).send({
                message:"Data not found that you want to deleted"
            });
        }
        res.status(200).send({
            message:"Data deleted succesfully",
        });

    } catch (err) {
        res.status(500).send({
            message: "Some Internal Problems",
            error: err.message
        });
    }
};

export const getTransaction = async (req, res) =>{
    try {
        const transaction = await TransactionModel.find();
        if(!transaction){
            res.status(404).send({
                message:"Not found Data"
            });
        };
        res.status(200).send({
            message:"Data Fetch Successfully",
            data:transaction
        });
    } catch (err) {
        res.status(500).send({
            message: "Some Internal Problems",
            error: err.message
        });
    }
};

