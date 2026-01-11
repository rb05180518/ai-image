// 加载环境变量配置
import "dotenv/config";
// MariaDB 数据库适配器
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// Prisma 客户端（由 prisma generate 生成）
import { PrismaClient } from "@/generated/prisma/client";

/**
 * 创建 MariaDB 数据库适配器
 * 用于连接 MariaDB/MySQL 数据库
 */
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST, // 数据库主机地址
  user: process.env.DATABASE_USER, // 数据库用户名
  password: process.env.DATABASE_PASSWORD, // 数据库密码
  database: process.env.DATABASE_NAME, // 数据库名称
  connectionLimit: 5, // 最大连接数
});

/**
 * 全局 Prisma 实例存储
 * 使用 globalThis 确保在开发环境下热重载时不会创建多个实例
 * 避免连接池耗尽的问题
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 导出 Prisma 客户端实例
 * 优先使用全局缓存的实例，否则创建新实例
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

/**
 * 在非生产环境下，将 Prisma 实例缓存到全局对象
 * 这样在开发环境的热重载时可以复用同一个实例
 * 生产环境不需要缓存，因为不会有热重载
 */
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
