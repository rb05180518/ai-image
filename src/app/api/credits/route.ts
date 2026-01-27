import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { totalCredits: true, usedCredits: true, hasPurchased: true },
  });

  const totalCredits = user?.totalCredits ?? 0;
  const usedCredits = user?.usedCredits ?? 0;

  return NextResponse.json({
    totalCredits,
    usedCredits,
    credits: totalCredits - usedCredits,
    hasPurchased: user?.hasPurchased ?? false,
  });
}
