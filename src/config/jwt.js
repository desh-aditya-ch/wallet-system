const {JWT_EXPIRES_IN,JWT_SECRET}=require('../config');
console.log(JWT_SECRET);

module.exports = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
};