const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const jwtConfig=require("../config/jwt");
const userRepository=require("../repositories/user.repository");
const walletRepository=require("../repositories/wallet.repository");


class AuthService{
    async register({name,email,password}){
        const existingUser=await userRepository.findByEmail(email);

        if(existingUser){
            throw new Error("Email already exist!");
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await userRepository.create({
            name,
            email,
            password:hashedPassword
        });

        await walletRepository.create(user.id);

        return user;

    }

    async login({email,password}){
        const user=await userRepository.findByEmail(email);

        if(!user){
            throw new Error("Inavlid Credentials");
        }

        const isPasswordValid= await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            throw new Error("Invalid Password");
        }

        const token= jwt.sign(
            {
                userId:user.id,
            },
            jwtConfig.secret,
            {
                expiresIn:jwtConfig.expiresIn,
            }
        );

        return {
            token,
        };
    }
}

module.exports =new AuthService();