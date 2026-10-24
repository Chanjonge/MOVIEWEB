import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getMovie } from "@/lib/movies";
import { MovieForm } from "@/components/MovieForm";

type Params = Promise<{ id: string }> | { id: string };

export default async function MovieDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) notFound();

  return (
    <div className="relative">
      <div className="spotlight" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-5 pt-8">
        <Link
          href="/movies"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-gold"
        >
          <ArrowLeft size={15} />
          목록으로
        </Link>
      </div>
      <div className="relative">
        <MovieForm mode="edit" initial={movie} />
      </div>
    </div>
  );
}
