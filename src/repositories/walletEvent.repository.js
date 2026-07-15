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

    async findByWalletIdBeforeTime(walletId,requestedTime,db=prisma){
        return db.walletEvent.findMany({
            where:{
                walletId,
                createdAt:{
                    lte:requestedTime,
                },
            },
            orderBy:{
                createdAt:"asc",
            },
        });
    }

    async findEventsAfterSnapshot(walletId, snapshotTime, db = prisma) {
    return await db.walletEvent.findMany({
        where: {
            walletId,
            createdAt: {
                gt: snapshotTime,
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}

    async countByWalletId(walletId){
        return await prisma.walletEvent.count({
            where:{
                walletId,
            }
        })
    }

    async findEventsAfter(walletId,lastEventId){
        return await prisma.walletEvent.findMany({
            where:{
                walletId,
                id:{
                    gt:lastEventId,
                },
            },
            orderBy:{
                id:"asc",
            },
        });
    }

}

module.exports=new walletEventRepository();