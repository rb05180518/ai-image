// 提交生图任务 API
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addImageTask } from "@/lib/queue";
import { prisma } from "@/lib/prisma";
import type { IParams } from "@/store/useTaskStore";
import { executeProvider } from "../../services/tools/providerModel";
import { allModels } from "@/config/model";

// 积分扣除
const decreaseCredits = async (userId: string, body: IParams) => {
  const modelConfig = Object.values(allModels)
    .flat()
    .find((item) => item.value === body.model);
  const cost = modelConfig!.credits;

  // 从 User 表读取剩余积分
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { totalCredits: true, usedCredits: true },
  });

  const remainingCredits = (user?.totalCredits ?? 0) - (user?.usedCredits ?? 0);

  if (remainingCredits < cost) {
    throw new Error("积分不足");
  }

  // 更新已用积分
  await prisma.user.update({
    where: { clerkId: userId },
    data: { usedCredits: { increment: cost } },
  });

  return cost;
};

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = (await req.json()) as IParams;

    // 先扣积分后提交
    await decreaseCredits(user.id, body);

    const { submitTaskId, params } = await executeProvider(body.provider, body);

    // 添加任务到队列
    await addImageTask({
      taskId: submitTaskId,
      userId: user.id,
    });

    // 任务添加到数据库
    await prisma.usage.create({
      data: {
        userId: user.id,
        taskType: "image-generate",
        taskUsed: 100,
        taskId: submitTaskId,
        inputMeta: {
          model: params.model,
          params: params.input,
        },
      },
    });

    // 立即返回任务 ID，不等待处理完成
    return NextResponse.json({
      success: true,
      taskId: submitTaskId,
      message: "任务已提交，正在排队中",
    });
  } catch (error) {
    console.error("提交任务失败:", error);
    return NextResponse.json({ error: "提交任务失败" }, { status: 500 });
  }
}
