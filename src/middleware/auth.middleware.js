const jwt = require("jsonwebtoken");

const jwtConfig=require("../config/jwt");

async function authMiddleware(req,res,next){
    try{
        const authHeader=req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                success:false,
                message:"token not found",
            });
        }

        const parts=authHeader.split(" ");

        if(parts.length!==2){
            return res.status(401).json({
                success:false,
                message:"Invalid token",
            });
        }

        const [ ,token]=parts;

        const decoded=jwt.verify(
            token,
            jwtConfig.secret,
        );

        req.user={
            userId:decoded.userId,
        };
        next();
    }
    catch(error){
        res.status(401).json({
            success:false,
            message:"Invalid token",
        });
    }
}

module.exports=authMiddleware;