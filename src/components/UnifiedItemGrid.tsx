'use client';

import React, { useState } from 'react';
import { GameItem } from '@/lib/dataService';

interface UnifiedItemGridProps {
  items: GameItem[];
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2371717a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';

export function UnifiedItemGrid({ items }: UnifiedItemGridProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => {
          const hasError = failedImages[item.id];
          const imgSrc = hasError || !item.image ? FALLBACK_IMAGE : item.image;

          return (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 backdrop-blur-md transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-zinc-950/50"
            >
              <div className="relative mb-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-zinc-950/60 p-2">
                <img
                  src={imgSrc}
                  alt={item.name}
                  onError={() => handleImageError(item.id)}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="line-clamp-1 font-semibold text-zinc-100 group-hover:text-white">
                      {item.name}
                    </h3>
                    <span
                      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide ${
                        item.gameSource === 'League of Legends'
                          ? 'border border-cyan-500/30 bg-cyan-950/40 text-cyan-400'
                          : 'border border-amber-500/30 bg-amber-950/40 text-amber-400'
                      }`}
                    >
                      {item.gameSource}
                    </span>
                  </div>
                  <p className="line-clamp-3 text-xs text-zinc-400">
                    {item.description || 'No description available.'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
