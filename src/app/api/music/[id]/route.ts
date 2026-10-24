import { NextRequest, NextResponse } from "next/server";
import { deleteMusic } from "@/lib/music";

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const ok = await deleteMusic(id);
  if (!ok) {
    return NextResponse.json({ error: "존재하지 않는 기록이에요." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
