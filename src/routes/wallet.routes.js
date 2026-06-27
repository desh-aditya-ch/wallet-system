const express=require("express");
const authMiddleware=require("../middleware/auth.middleware");
const walletController=require("../controllers/wallet.controller");
const { deposit } = require("../services/wallet.service");
const router=express.Router();

router.get("/balance",
    authMiddleware,
    walletController.getBalance
);

router.post("/deposit",
    authMiddleware,
    walletController.deposit
);

router.post("/withdraw",
    authMiddleware,
    walletController.withdraw
)
module.exports=router;
