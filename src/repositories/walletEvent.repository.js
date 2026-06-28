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
}

module.exports=new walletEventRepository();