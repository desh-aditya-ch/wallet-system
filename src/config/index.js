require("dotenv").config();

const config = {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
};

module.exports = config;