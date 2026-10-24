import { randomUUID } from "node:crypto";
import { readJson, writeJson } from "./blob-store";
import type { Music } from "./types";

const PATHNAME = "data/music.json";

export async function getMusicList(): Promise<Music[]> {
  return readJson<Music[]>(PATHNAME, []);
}

export async function createMusic(
  data: Omit<Music, "id" | "createdAt">
): Promise<Music> {
  const list = await getMusicList();
  const music: Music = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  };
  list.push(music);
  await writeJson(PATHNAME, list);
  return music;
}

export async function deleteMusic(id: string): Promise<boolean> {
  const list = await getMusicList();
  const next = list.filter((m) => m.id !== id);
  await writeJson(PATHNAME, next);
  return next.length !== list.length;
}
