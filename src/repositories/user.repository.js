const prisma=require("../config/prisma");

class UserRepository{
    async findByEmail(email, db = prisma) {
    return db.user.findUnique({
        where: {
            email,
        },
    });
}

    async create(data){
        return prisma.user.create({
            data,
        });
    }
}

module.exports=new UserRepository();