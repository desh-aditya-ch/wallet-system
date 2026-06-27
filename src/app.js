const express=require("express");
const authRoutes=require("./routes/auth.routes");
const userRoutes=require("./routes/user.routes");
const walletRoutes=require("./routes/wallet.routes")

const app=express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/wallet",walletRoutes);


app.get("/",(req,res)=>{
    res.json({
        status:true,
        message:"wallet api running"
    });
});

module.exports=app;