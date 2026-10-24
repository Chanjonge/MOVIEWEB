export function extractYoutubeId(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  const isValidId = (id: string | null | undefined): id is string =>
    !!id && /^[a-zA-Z0-9_-]{11}$/.test(id);

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return isValidId(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return isValidId(id) ? id : null;
    }
    const segments = url.pathname.split("/").filter(Boolean);
    if ((segments[0] === "shorts" || segments[0] === "embed" || segments[0] === "live") && segments[1]) {
      return isValidId(segments[1]) ? segments[1] : null;
    }
  }

  return null;
}

export async function fetchYoutubeTitle(url: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string };
    return data.title?.trim() || null;
  } catch {
    return null;
  }
}

export function youtubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
