1、.env 是所有环境的默认配置
2、npm run db:generate - 生成 Prisma Client（没有这个数据库跑不起来）
3、npm run db:studio:dev - 打开数据库可视化面板
4、prisma相关命令 node 必须 >= 22.16.0
5、新项目想要同步数据库表，执行：pnpm db:migrate:dev
