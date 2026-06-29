const walletService=require("../services/wallet.service");

class walletController{
    async getBalance(req,res){
        try{
            const result=await walletService.getBalance(req.user.userId);

            return res.status(200).json({
                success:true,
                data:result,
            });
        }
        catch(error){
            return res.status(400).json({
                success:false,
                message:error.message,
            });
        }
    }

    async deposit(req,res){
        try{
            const {amount}=req.body;

            const result=await walletService.deposit(
                req.user.userId,
                amount
            );

            return res.status(201).json({
                success:true,
                data:result,
            });
        }
        catch(error){
            return res.status(400).json({
                success:false,
                message:error.message,
            });
        }

    }

    async withdraw(req,res){
        try{
            const {amount}=req.body;

            const result=await walletService.withdraw(
                req.user.userId,
                amount,
            );

            res.status(201).json({
                success:true,
                data:result,
            });
        }
        catch(error){
            res.status(400).json({
                success:false,
                message:error.message,
            });
        }
    }

    async transfer(req,res){
        try{
            const senderUserId=req.user.userId;
            const{receiverEmail,amount}=req.body;
            
            const result=await walletService.transfer(senderUserId,receiverEmail,amount);

            return res.status(200).json({
                success:true,
                data:result,
            })
        }
        catch(error){
            return res.status(400).json({
                success:false,
                message:error.message,
            })
        }
        
    }

    async getWalletHistory(req,res){
        try{
            const {userId}=req.user;

            const history=await walletService.getWalletHistory(userId);

            return res.status(200).json({
                success:true,
                history
            });
        }
        catch(error){
            return res.status(400).json({
                success:false,
                message:error.message,
            });
        }
    }
}

module.exports = new walletController();