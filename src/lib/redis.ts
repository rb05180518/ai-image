// Redis 连接配置
import IORedis from "ioredis";

// 创建 Redis 连接实例
// 默认连接本地 Redis，可通过环境变量配置
export const redis = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // BullMQ 要求设置为 null
});

// 导出连接配置，供 BullMQ 使用
export const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};
