import { NextRequest, NextResponse } from "next/server";
import { createMusic, getMusicList } from "@/lib/music";
import { extractYoutubeId, fetchYoutubeTitle, youtubeThumbnail } from "@/lib/youtube";

export async function GET() {
  return NextResponse.json(await getMusicList());
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const url = String(body?.url ?? "").trim();

  if (!url) {
    return NextResponse.json({ error: "유튜브 링크를 입력해주세요." }, { status: 400 });
  }

  const videoId = extractYoutubeId(url);
  if (!videoId) {
    return NextResponse.json({ error: "올바른 유튜브 링크가 아니에요." }, { status: 400 });
  }

  const title = (await fetchYoutubeTitle(url)) ?? "제목 없음";
  const music = await createMusic({
    url,
    videoId,
    title,
    thumbnail: youtubeThumbnail(videoId),
  });

  return NextResponse.json(music, { status: 201 });
}
