import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // 获取当前登录用户
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (existingUser) {
      // 更新用户信息
      const updatedUser = await prisma.user.update({
        where: { clerkId: user.id },
        data: {
          email: user.emailAddresses[0]?.emailAddress,
          username: user.username || null,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          imageUrl: user.imageUrl || null,
        },
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: "用户信息已更新",
      });
    } else {
      // 创建新用户
      const newUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          username: user.username || null,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          imageUrl: user.imageUrl || null,
        },
      });

      return NextResponse.json({
        success: true,
        user: newUser,
        message: "用户已创建",
      });
    }
  } catch (error) {
    console.error("同步用户失败:", error);
    return NextResponse.json(
      { error: "同步用户失败", details: error },
      { status: 500 }
    );
  }
}
