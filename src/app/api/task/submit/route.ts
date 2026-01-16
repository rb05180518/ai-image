// 提交生图任务 API
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addImageTask } from "@/lib/queue";
import { prisma } from "@/lib/prisma";
import type { IParams } from "@/store/useTaskStore";
import { executeProvider } from "../../services/tools/providerModel";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = (await req.json()) as IParams;

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
