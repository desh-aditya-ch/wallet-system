const Redis = require("ioredis");
const config = require("./index");

const redis = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    maxRetriesPerRequest: null,
});

redis.on("connect", () => {
    console.log("Redis connected successfully");
});

redis.on("error", (err) => {
    console.log("Redis Error: ", err.message);
});

module.exports = redis;