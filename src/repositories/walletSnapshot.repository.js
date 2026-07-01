const prisma=require("../config/prisma");

class walletSnapshotRepository{
    async findLatestByWallet(walletId,db=prisma){
        return await db.walletSnapshot.findFirst({
            where:{
                walletId,
            },
            orderBy:{
                createdAt:"desc",
            },
        });
    }

    async create(data,db=prisma){
        return await db.walletSnapshot.create({
            data,
        });
    }
}


module.exports=new walletSnapshotRepository();