const express=require("express");

const authMiddleware=require("../middleware/auth.middleware");

const userController=require("../controllers/user.controller");

const router=express.Router();

router.get("/profile",
    authMiddleware,
    userController.profile
);

module.exports=router;


