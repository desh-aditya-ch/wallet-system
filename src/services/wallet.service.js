const walletRepository=require("../repositories/wallet.repository");
const walletEventRepository=require("../repositories/walletEvent.repository");
const prisma=require("../config/prisma");
const userRepository = require("../repositories/user.repository");

class WalletService{
    async getBalance(userId){
        const wallet=await walletRepository.findByUserId(userId);

        if(!wallet){
            throw new Error("Wallet Not Found");
        }

        const events=await walletEventRepository.findByWalletId(wallet.id);

        const balance = this.calculateBalance(events);

        return {
            walletId: wallet.id,
            balance
        };
    }
    async deposit(userId,amount){
        const wallet=await walletRepository.findByUserId(userId);

        if(!wallet){
            throw new Error("wallet not found");
        }

        if(amount<=0){
            throw new Error("Amoynt must be greater than Zero");
        }

        const event=await walletEventRepository.create({
            walletId:wallet.id,
            type:"CREDIT",
            amount
        });

        return{
            message:"Amount deposited Succesfully",
            event
        }
    }
    async withdraw(userId,amount){
        const wallet=await walletRepository.findByUserId(userId);

        if(!wallet){
            throw new Error("Wallet not found");
        }

        if(amount<=0){
            throw new Error("Amount must be greater than zero");
        }

        const events=await walletEventRepository.findByWalletId(wallet.id);

        const balance=this.calculateBalance(events);

        if(balance<amount){
            throw new Error("Insufficient funds");
        }

        const event=await walletEventRepository.create({
            walletId:wallet.id,
            type:"DEBIT",
            amount:amount,
        });

        return {
            message:"Amount withdrawn Successfully",
            event
        };
    }
    async transfer(senderUserId,receiverEmail,amount){
        return prisma.$transaction(async(tx)=>{
            const senderWallet=await walletRepository.findByUserId(senderUserId,tx);

            if(!senderWallet){
                throw new Error("Sender Wallet not found")
            }

            const receiverUser=await userRepository.findByEmail(receiverEmail,tx);

            if(!receiverUser){
                throw new Error("Receiver Not Found");
            }

            if(receiverUser.id===senderUserId){
                throw new Error("Cannot transfer to your own wallet");
            }

            const receiverWallet=await walletRepository.findByUserId(receiverUser.id,tx);
            
            if(!receiverWallet){
                throw new Error("Receiver wallet not found");
            }

            if(amount<=0){
                throw new Error("Amount must be positive");
            }

            const senderEvents=await walletEventRepository.findByWalletId(senderWallet.id,tx);

            const balance=this.calculateBalance(senderEvents);

            if(balance<amount){
                throw new Error("Insufficient funds");
            }

            await walletEventRepository.create({
                walletId:senderWallet.id,
                type:"DEBIT",
                amount,
            },
            tx
        );

            await walletEventRepository.create({
                walletId:receiverWallet.id,
                type:"CREDIT",
                amount,
            },
            tx
        );

        return {
            message:"Transfer Completed Successfully",
        };


        });
    }
    calculateBalance(events) {

        let balance = 0;

        for (const event of events) {

            const amount = Number(event.amount);

            if (event.type === "CREDIT") {
                balance += amount;
            }

            if (event.type === "DEBIT") {
                balance -= amount;
            }

        }

        return balance;
    }
}


module.exports=new WalletService();