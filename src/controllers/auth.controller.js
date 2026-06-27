const authService=require("../services/auth.services");

class AuthController{
    async register(req, res) {
    try {
      const user = await authService.register(req.body);
      delete user.password;

      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

    async login(req, res) {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}
}

module.exports=new AuthController();