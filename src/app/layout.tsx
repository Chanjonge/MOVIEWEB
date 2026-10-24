import type { Metadata } from "next";
import { Noto_Sans_KR, Black_Han_Sans, Bungee } from "next/font/google";
import Link from "next/link";
import { Clapperboard, Disc3 } from "lucide-react";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const blackHanSans = Black_Han_Sans({
  variable: "--font-black-han",
  subsets: ["latin"],
  weight: "400",
});

const bungee = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "필름 앤 그루브",
  description: "영화는 티켓으로, 음악은 CD로 기록하는 나만의 아카이브",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${blackHanSans.variable} ${bungee.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="grain-overlay" aria-hidden />
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-xl tracking-wide text-gold"
            >
              <span>🎞</span>
              <span>필름 앤 그루브</span>
            </Link>
            <nav className="flex items-center gap-1.5 text-sm font-medium">
              <Link
                href="/movies"
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-muted transition hover:bg-surface hover:text-gold"
              >
                <Clapperboard size={16} />
                영화
              </Link>
              <Link
                href="/music"
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-muted transition hover:bg-surface hover:text-violet"
              >
                <Disc3 size={16} />
                음악
              </Link>
            </nav>
          </div>
          <div className="marquee-lights is-animated opacity-70" />
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
