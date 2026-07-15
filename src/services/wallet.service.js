const walletRepository=require("../repositories/wallet.repository");
const walletEventRepository=require("../repositories/walletEvent.repository");
const prisma=require("../config/prisma");
const userRepository = require("../repositories/user.repository");
const walletsnapshotRepository = require("../repositories/walletsnapshot.repository");
const snapshotQueue = require("../queues/snapshot.queue");
class WalletService{
    async getBalance(userId){
        const wallet=await walletRepository.findByUserId(userId);

        if(!wallet){
            throw new Error("Wallet Not Found");
        }

        const snapshot=await walletsnapshotRepository.findLatestByWallet(wallet.id);

        let balance=0;
        let events=[];

        if(snapshot){
            balance=snapshot.balance;

            events=await walletEventRepository.findEventsAfterSnapshot(
                wallet.id,
                snapshot.createdAt
            );
        }
        else{
            events=await walletEventRepository.findByWalletId(wallet.id);
        }

        balance+= this.calculateBalance(events);

        return balance;
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
        await this.queueSnapshotIfRequired(wallet.id);

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

        await this.queueSnapshotIfRequired(wallet.id);

        return {
            message:"Amount withdrawn Successfully",
            event
        };
    }
async transfer(senderUserId, receiverEmail, amount) {

    const result = await prisma.$transaction(async (tx) => {

        const senderWallet =
            await walletRepository.findByUserId(senderUserId, tx);

        if (!senderWallet) {
            throw new Error("Sender Wallet not found");
        }

        const receiverUser =
            await userRepository.findByEmail(receiverEmail, tx);

        if (!receiverUser) {
            throw new Error("Receiver Not Found");
        }

        if (receiverUser.id === senderUserId) {
            throw new Error("Cannot transfer to your own wallet");
        }

        const receiverWallet =
            await walletRepository.findByUserId(receiverUser.id, tx);

        if (!receiverWallet) {
            throw new Error("Receiver wallet not found");
        }

        if (amount <= 0) {
            throw new Error("Amount must be positive");
        }

        const senderEvents =
            await walletEventRepository.findByWalletId(senderWallet.id, tx);

        const balance = this.calculateBalance(senderEvents);

        if (balance < amount) {
            throw new Error("Insufficient funds");
        }

        await walletEventRepository.create(
            {
                walletId: senderWallet.id,
                type: "DEBIT",
                amount,
            },
            tx
        );

        await walletEventRepository.create(
            {
                walletId: receiverWallet.id,
                type: "CREDIT",
                amount,
            },
            tx
        );

        return {
            senderWalletId: senderWallet.id,
            receiverWalletId: receiverWallet.id,
            message: "Transfer Completed Successfully",
        };

    });

    await this.queueSnapshotIfRequired(result.senderWalletId);
    await this.queueSnapshotIfRequired(result.receiverWalletId);

    return {
        message: result.message,
    };
}
    async getWalletHistory(userId){
        const wallet= await walletRepository.findByUserId(userId);

        if(!wallet){
            throw new Error("Wallet Not Found");
        }

        const history= await walletEventRepository.getWalletHistory(wallet.id);

        return history;
    }
    async getHistoricalBalance(userId,at){
        if(!at){
            throw new Error("at parameter is required");
        }

        const requestedTime=new Date(at);

        if(isNaN(requestedTime.getTime())){
            throw new Error("Invalid Date Format");
        }
        if(requestedTime>new Date()){
            throw new Error("Cannot query future balance");
        }

        const wallet=await walletRepository.findByUserId(userId);

        if(!wallet){
            throw new Error("Wallet Not Found");
        }

        const events=await walletEventRepository.findByWalletIdBeforeTime(
            wallet.id,
            requestedTime
        );
        
        const balance=this.calculateBalance(events);

        return balance;
    }


    calculateBalance(events, startingBalance = 0) {

    let balance = startingBalance;

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
    async shouldCreateSnapshot(walletId){
        const eventCount=await walletEventRepository.countByWalletId(walletId);

        return eventCount%100===0;
    }

    async queueSnapshotIfRequired(walletId) {
    const shouldCreate = await this.shouldCreateSnapshot(walletId);

    if (!shouldCreate) {
        return;
    }

    await snapshotQueue.addSnapshotJob({
        walletId,
    });
}


    async createSnapshot(walletId){
        const latestSnapshot=await walletsnapshotRepository.findLatestByWallet(walletId);

        const lastEventId=
            latestSnapshot?.lastEventId ??0;

        const events=
            await walletEventRepository.findEventsAfter(walletId,lastEventId);

        const startingBalance =
            Number(latestSnapshot?.balance ?? 0);

        const balance =
            this.calculateBalance(
                events,
                startingBalance
            );
    }
}


module.exports=new WalletService();