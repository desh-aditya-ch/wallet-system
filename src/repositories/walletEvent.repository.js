const prisma=require("../config/prisma");

class walletEventRepository{
    async findByWalletId(walletId,db=prisma){
        return db.walletEvent.findMany({
            where:{
                walletId
            },
            orderBy:{
            createdAt:"asc"
            }
        });
    }
    async create(data,db=prisma){
        return db.walletEvent.create({
            data,
        });
    }

    async getWalletHistory(walletId,tx=prisma){
        return tx.walletEvent.findMany({
            where:{
                walletId
                :walletId,
        },
        orderBy:{
            createdAt:"desc",
        },
        
        });
    }
}

module.exports=new walletEventRepository();