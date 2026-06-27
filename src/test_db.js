const prisma=require("./config/prisma");

async function testDB(){
    try{
        await prisma.$connect();

        console.log("DB connected successfully");
    }
    catch(error){
        console.error(error);
    }
    finally{
        await prisma.$disconnect();
    }
}

testDB();