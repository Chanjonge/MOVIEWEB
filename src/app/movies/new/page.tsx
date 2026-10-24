import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MovieForm } from "@/components/MovieForm";

export default function NewMoviePage() {
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
        <MovieForm mode="create" />
      </div>
    </div>
  );
}
