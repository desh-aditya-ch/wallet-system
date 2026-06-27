const prisma=require("../config/prisma");

class WalletRepository{
    async create(userId){
        return prisma.wallet.create({
            data:{
                userId,
            }
        });
    }

    async findByUserId(userId){
        return prisma.wallet.findUnique({
            where:{
                userId
            }
        });
            
    }
}



module.exports=new WalletRepository();
