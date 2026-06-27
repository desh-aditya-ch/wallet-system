const prisma=require("../config/prisma");

class walletEventRepository{
    async findByWalletId(walletId){
        return prisma.walletEvent.findMany({
            where:{
                walletId
            },
            orderBy:{
            createdAt:"asc"
            }
        });
    }
    async create(data){
        return prisma.walletEvent.create({
            data,
        });
    }
}

module.exports=new walletEventRepository();