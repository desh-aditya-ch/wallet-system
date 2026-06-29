const prisma=require("../config/prisma");

class WalletRepository{
    async create(userId){
        return prisma.wallet.create({
            data:{
                userId,
            }
        });
    }

    async findByUserId(userId,db=prisma){
        return db.wallet.findUnique({
            where:{
                userId
            }
        });
            
    }

   
}



module.exports=new WalletRepository();
