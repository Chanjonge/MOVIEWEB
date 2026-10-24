import { get, put } from "@vercel/blob";

// Dedicated private Blob store for the app's JSON "database" files
// (movies.json / music.json), separate from the public store used for
// uploaded images. Two stores need two distinct tokens.
const token = process.env.DATA_BLOB_READ_WRITE_TOKEN;

export async function readJson<T>(pathname: string, fallback: T): Promise<T> {
  const result = await get(pathname, {
    access: "private",
    useCache: false, // must see the latest write immediately, not a stale CDN copy
    token,
  });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return fallback;
  }

  try {
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(pathname: string, data: T): Promise<void> {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
    token,
  });
}
