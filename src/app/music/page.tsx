import { getMusicList } from "@/lib/music";
import { MusicPageClient } from "@/components/MusicPageClient";

// Reads data/music.json on every request; must not be statically cached.
export const dynamic = "force-dynamic";

export default async function MusicPage() {
  const items = await getMusicList();
  return <MusicPageClient initialItems={items} />;
}
