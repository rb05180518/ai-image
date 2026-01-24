import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getTaskStatus } from "@/lib/queue";
import ImageGeneratorClient from "./components/ImageGeneratorClient";
import Generate from "./components/Generate/Index";

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

export default async function ImageGeneratorPage() {
  const initialUsages = await getUsages();

  return (
    <div className="w-full md:px-5 px-4">
      <ImageGeneratorClient initialUsages={initialUsages} />
      <Generate />
    </div>
  );
}
