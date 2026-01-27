import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getTaskStatus } from "@/lib/queue";
import GeneratorClient from "./components/GenerateClient/Index";
import Generate from "./components/Generate/Index";
import Sidebar from "./components/Sidebar/Index";
import { PropsWithChildren } from "react";

// 将 BigInt 转换为字符串
function serializeUsage(usage: { id: bigint; [key: string]: unknown }) {
  return {
    ...usage,
    id: usage.id.toString(),
  };
}

async function getUsages() {
  const user = await currentUser();
  if (!user) {
    return [];
  }

  // 从数据库获取用户的所有使用记录
  const usages = await prisma.usage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // 为每条记录附加队列状态
  const usagesWithStatus = await Promise.all(
    usages.map(async (usage) => {
      const serialized = serializeUsage(usage);

      // 如果任务还没完成，查询队列状态
      if (!usage.completeAt) {
        const queueStatus = await getTaskStatus(usage.taskId);
        return {
          ...serialized,
          queueState: queueStatus?.state || "unknown",
          progress: queueStatus?.progress || 0,
        };
      }

      // 已完成的任务
      return {
        ...serialized,
        queueState: "completed",
        progress: 100,
      };
    }),
  );

  return usagesWithStatus;
}

export default async function Layout(props: PropsWithChildren) {
  const initialUsages = await getUsages();
  const { children } = props;

  return (
    <>
      <Sidebar />
      <div className="w-full md:px-5 px-4 md:pl-24">
        {children}
        <GeneratorClient initialUsages={initialUsages} />
        <Generate />
      </div>
    </>
  );
}
