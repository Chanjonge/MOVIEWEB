import { NextRequest, NextResponse } from "next/server";
import { createMovie, getMovies } from "@/lib/movies";
import { saveUploadedImage } from "@/lib/upload";

export async function GET() {
  return NextResponse.json(await getMovies());
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const title = String(form.get("title") ?? "").trim();
  const rating = Number(form.get("rating") ?? 0);
  const review = String(form.get("review") ?? "");
  const file = form.get("thumbnail");

  if (!title) {
    return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
  }

  let thumbnail: string | null = null;
  if (file instanceof File && file.size > 0) {
    const result = await saveUploadedImage(file);
    if ("error" in result) {
      return NextResponse.json(result, { status: 400 });
    }
    thumbnail = result.url;
  }

  const movie = await createMovie({
    title,
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 0,
    review,
    thumbnail,
  });

  return NextResponse.json(movie, { status: 201 });
}
