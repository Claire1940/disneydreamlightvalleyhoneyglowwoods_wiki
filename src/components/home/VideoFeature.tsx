"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * VideoFeature
 *
 * 懒加载 + 自动播放的 YouTube 视频区域：
 * - 使用 IntersectionObserver 监测视频区域进入视口时自动加载并播放
 *   （autoplay=1&mute=1&loop=1，静音以满足浏览器自动播放策略）
 * - 同时保留点击播放按钮作为后备（用户主动点击也可启动）
 * - 未激活时仅渲染缩略图 + 播放按钮，避免一次性加载多个 iframe
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  );

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  // loop=1 需要配合 playlist=<videoId> 才能对单个视频循环
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;

  // 进入视口自动播放（仅触发一次）
  useEffect(() => {
    if (active) return;
    const node = containerRef.current;
    if (!node) return;

    // 不支持 IntersectionObserver 时直接激活（回退）
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [active, videoId]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {active ? (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute top-0 left-0 h-full w-full"
          >
            {/* 缩略图：maxresdefault 失败时回退到 hqdefault */}
            <img
              src={thumbSrc}
              alt={title}
              loading="lazy"
              onError={() =>
                setThumbSrc(
                  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                )
              }
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] shadow-lg transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20">
                <Play className="ml-1 h-7 w-7 text-white md:h-9 md:w-9" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
