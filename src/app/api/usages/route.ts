import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTaskStatus } from "@/lib/queue";

// 将 BigInt 转换为字符串
function serializeUsage(usage: { id: bigint; [key: string]: unknown }) {
  return {
    ...usage,
    id: usage.id.toString(),
  };
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 从数据库获取用户的所有使用记录
    const usages = await prisma.usage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }, // 降序，先拿最新提交的
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
      })
    );

    return NextResponse.json({ success: true, usages: usagesWithStatus });
  } catch (error) {
    console.error("获取使用记录失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}
