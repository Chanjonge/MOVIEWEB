export interface Movie {
  id: string;
  title: string;
  rating: number; // 0-5
  thumbnail: string | null; // Vercel Blob public URL
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface Music {
  id: string;
  url: string;
  videoId: string;
  title: string;
  thumbnail: string;
  createdAt: string;
}
