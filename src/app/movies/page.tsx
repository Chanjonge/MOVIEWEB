import Link from "next/link";
import { Plus, Ticket } from "lucide-react";
import { getMovies } from "@/lib/movies";
import { MovieTicket } from "@/components/MovieTicket";

// Reads data/movies.json on every request; must not be statically cached.
export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <div className="relative">
      <div className="spotlight" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-5 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-marquee flex items-center gap-2 text-[10px] tracking-[0.25em] text-gold uppercase">
              <span className="h-1 w-1 rounded-full bg-gold shadow-[0_0_5px_2px_rgba(255,201,77,0.7)]" />
              Now Showing
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-wide text-gold sm:text-4xl">
              영화 기록
            </h1>
            <p className="mt-1 text-sm text-muted">
              총 {movies.length}편의 영화를 기록했어요
            </p>
          </div>
          <Link
            href="/movies/new"
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-background shadow-[0_0_20px_rgba(255,201,77,0.35)] transition hover:bg-gold-dark"
          >
            <Plus size={16} />새 기록
          </Link>
        </div>

        <div className="marquee-lights mb-8 opacity-80" />

        {movies.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border py-20 text-center text-muted">
            <Ticket size={36} />
            <p className="font-medium">아직 기록한 영화가 없어요.</p>
            <Link
              href="/movies/new"
              className="mt-2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-background transition hover:bg-gold-dark"
            >
              첫 영화 기록하기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {movies.map((movie) => (
              <MovieTicket key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
