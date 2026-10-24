import Link from "next/link";
import Image from "next/image";
import { Film } from "lucide-react";
import { StarRating } from "./StarRating";
import type { Movie } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function MovieTicket({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="foil-border ticket-row group h-32 overflow-hidden rounded-2xl shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:shadow-black/50"
    >
      <div className="relative h-full w-28 flex-shrink-0 bg-surface-2 sm:w-36">
        {movie.thumbnail ? (
          <Image
            src={movie.thumbnail}
            alt={movie.title}
            fill
            sizes="144px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <Film size={32} />
          </div>
        )}
      </div>

      <div className="ticket-seam" />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 px-5 py-4">
        <h3 className="truncate font-display text-xl tracking-wide transition group-hover:text-gold">
          {movie.title}
        </h3>
        <StarRating value={movie.rating} readOnly size={15} />
        {movie.review ? (
          <p className="line-clamp-1 text-sm text-muted">{movie.review}</p>
        ) : (
          <p className="text-sm text-muted/50">아직 후기가 없어요</p>
        )}
      </div>

      <div className="hidden flex-col items-center justify-center gap-3 px-4 text-muted sm:flex">
        <span className="font-marquee [writing-mode:vertical-rl] text-[10px] tracking-widest text-gold/80">
          ADMIT ONE
        </span>
        <span className="ticket-barcode h-16 w-2.5 text-muted/70" />
        <span className="text-[10px] tracking-widest [writing-mode:vertical-rl]">
          {formatDate(movie.createdAt)}
        </span>
      </div>
    </Link>
  );
}
