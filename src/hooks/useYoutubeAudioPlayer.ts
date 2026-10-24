"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(videoId: string): void;
  destroy(): void;
}

interface YTPlayerStateChangeEvent {
  data: number;
}

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: () => void;
        onStateChange?: (event: YTPlayerStateChangeEvent) => void;
      };
    }
  ) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const IFRAME_API_SRC = "https://www.youtube.com/iframe_api";
let apiPromise: Promise<YTNamespace> | null = null;

function loadYoutubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT!);
    };
    if (!document.querySelector(`script[src="${IFRAME_API_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = IFRAME_API_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });
  return apiPromise;
}

/**
 * Plays YouTube audio through a visually hidden IFrame player.
 * The target element is created imperatively (not via JSX) so that
 * React StrictMode's mount->unmount->mount dev cycle can't leave the
 * player pointed at a DOM node the YouTube API already replaced.
 */
export function useYoutubeAudioPlayer(onEnded: () => void) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const pendingVideoId = useRef<string | null>(null);
  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    onEndedRef.current = onEnded;
  });

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const target = document.createElement("div");
    wrapperRef.current?.appendChild(target);

    loadYoutubeApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(target, {
        width: 1,
        height: 1,
        playerVars: { playsinline: 1 },
        events: {
          onReady: () => {
            readyRef.current = true;
            if (pendingVideoId.current) {
              playerRef.current?.loadVideoById(pendingVideoId.current);
              pendingVideoId.current = null;
            }
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) setIsPlaying(true);
            else if (event.data === YT.PlayerState.PAUSED) setIsPlaying(false);
            else if (event.data === YT.PlayerState.ENDED) {
              setIsPlaying(false);
              onEndedRef.current();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      readyRef.current = false;
      playerRef.current?.destroy();
      playerRef.current = null;
      target.remove();
    };
  }, []);

  const play = useCallback((videoId: string) => {
    if (!readyRef.current || !playerRef.current) {
      pendingVideoId.current = videoId;
      return;
    }
    playerRef.current.loadVideoById(videoId);
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const resume = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  return { wrapperRef, isPlaying, play, pause, resume };
}
