import { randomUUID } from "node:crypto";
import { readJson, writeJson } from "./blob-store";
import type { Movie } from "./types";

const PATHNAME = "data/movies.json";

export async function getMovies(): Promise<Movie[]> {
  return readJson<Movie[]>(PATHNAME, []);
}

export async function getMovie(id: string): Promise<Movie | undefined> {
  const movies = await getMovies();
  return movies.find((m) => m.id === id);
}

export async function createMovie(
  data: Omit<Movie, "id" | "createdAt" | "updatedAt">
): Promise<Movie> {
  const movies = await getMovies();
  const now = new Date().toISOString();
  const movie: Movie = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  movies.unshift(movie);
  await writeJson(PATHNAME, movies);
  return movie;
}

export async function updateMovie(
  id: string,
  patch: Partial<Omit<Movie, "id" | "createdAt">>
): Promise<Movie | undefined> {
  const movies = await getMovies();
  const idx = movies.findIndex((m) => m.id === id);
  if (idx === -1) return undefined;
  movies[idx] = {
    ...movies[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeJson(PATHNAME, movies);
  return movies[idx];
}

export async function deleteMovie(id: string): Promise<boolean> {
  const movies = await getMovies();
  const next = movies.filter((m) => m.id !== id);
  await writeJson(PATHNAME, next);
  return next.length !== movies.length;
}
