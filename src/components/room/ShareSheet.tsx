"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { brand } from "@/data/brand";
import { isYouTubeId } from "@/lib/youtube";
import type { Track } from "@/lib/types";

interface ShareSheetProps {
  track: Track;
  roomName: string;
  roomSlug: string;
  onClose: () => void;
}

export function ShareSheet({ track, roomName, roomSlug, onClose }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);
  const [copiedLive, setCopiedLive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const origin = typeof window !== "undefined" ? window.location.origin : `https://${brand.domain}`;
  const shareUrl = `${origin}/r/${encodeURIComponent(roomSlug)}`;
  const liveInviteUrl = `${shareUrl}?join=live`;
  const shareText = `Listening to ${track.title} in ${roomName}`;

  useEffect(() => {
    setMounted(true);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const copyLiveInvite = async () => {
    try {
      await navigator.clipboard.writeText(liveInviteUrl);
      setCopiedLive(true);
      setTimeout(() => setCopiedLive(false), 2000);
    } catch {
      // ignore
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({
        title: track.title,
        text: shareText,
        url: shareUrl,
      });
    } catch {
      // cancelled
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-labelledby="share-title"
        className="w-full max-w-sm rounded-2xl p-5"
        style={{ backgroundColor: "#161210" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 id="share-title" className="font-display text-xl text-[#f3e6d8]">
            Share
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#c9b8a8] hover:bg-[#1f1a17] hover:text-[#f3e6d8]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          {isYouTubeId(track.youtubeId) ? (
            <img
              src={`https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg`}
              alt=""
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="h-14 w-14 shrink-0 rounded-lg bg-[#1f1a17]" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#f3e6d8]">{track.title}</p>
            <p className="truncate text-xs text-[#c9b8a8]">{track.artist}</p>
            <p className="mt-1 truncate text-xs text-[#c47a52]">/r/{roomSlug}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={copyLink}
          className="mt-5 w-full rounded-xl py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: "#c47a52" }}
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={copyLiveInvite}
          className="mt-2 w-full rounded-xl py-3 text-sm font-semibold text-[#f3e6d8]"
          style={{ border: "1px solid #c47a52", backgroundColor: "transparent" }}
        >
          {copiedLive ? "Copied" : "Copy Live invite"}
        </button>
        <p className="mt-1.5 text-center text-[11px] text-[#c9b8a8]">
          A Live invite drops them straight onto the song you’re hearing.
        </p>
        {canNativeShare && (
          <button
            type="button"
            onClick={nativeShare}
            className="mt-2 w-full rounded-xl py-3 text-sm text-[#c9b8a8] hover:text-[#f3e6d8]"
          >
            More ways to share
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
