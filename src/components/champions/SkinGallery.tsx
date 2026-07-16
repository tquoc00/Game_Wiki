'use client';

import React, { useState, useMemo } from 'react';
import { Wind, Palette, Sparkles } from 'lucide-react';

interface Skin {
  id: string;
  num: number;
  name: string;
  splash: string;
  loading: string;
}

interface SkinGalleryProps {
  skins: Skin[];
  championName: string;
}

export default function SkinGallery({ skins, championName }: SkinGalleryProps) {
  const [showChromas, setShowChromas] = useState(false);

  // Helper to detect if a skin entry is a Chroma variant (has parenthetical color name in Vietnamese/English)
  const isChroma = (name: string) => {
    return name.includes('(') && name.includes(')');
  };

  // Filter skins: main unique skins vs all skins including chromas
  const displaySkins = useMemo(() => {
    if (showChromas) return skins;
    return skins.filter((skin) => !isChroma(skin.name));
  }, [skins, showChromas]);

  const defaultSplash = skins[0]?.splash || '';
  const mainSkinsCount = skins.filter((s) => !isChroma(s.name)).length;

  return (
    <div className="glass-card rounded-2xl border border-zinc-800/80 p-6 mb-8 font-sans">
      {/* Gallery Header with Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-zinc-800/80 pb-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Wind size={16} className="text-cyan-400" />
          Bộ Sưu Tập Trang Phục ({displaySkins.length})
        </h2>

        {/* Toggle between Main Skins and Chromas */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setShowChromas(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              !showChromas
                ? 'bg-cyan-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles size={13} />
            Trang Phục Chính ({mainSkinsCount})
          </button>
          <button
            onClick={() => setShowChromas(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              showChromas
                ? 'bg-cyan-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Palette size={13} />
            Tất Cả Đa Sắc ({skins.length})
          </button>
        </div>
      </div>

      {/* Skin Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {displaySkins.map((skin) => (
          <SkinCard
            key={skin.id}
            skin={skin}
            championName={championName}
            defaultSplash={defaultSplash}
          />
        ))}
      </div>
    </div>
  );
}

function SkinCard({
  skin,
  championName,
  defaultSplash,
}: {
  skin: Skin;
  championName: string;
  defaultSplash: string;
}) {
  const [imgSrc, setImgSrc] = useState(skin.splash);
  const [hasError, setHasError] = useState(false);

  const displayName = skin.name === 'default' ? championName : skin.name;

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 hover:border-cyan-500/50 transition-all duration-300 shadow-lg">
      <div className="h-36 w-full overflow-hidden bg-zinc-900 relative">
        <img
          src={hasError ? defaultSplash : imgSrc}
          alt={displayName}
          onError={() => {
            if (!hasError) {
              setHasError(true);
              setImgSrc(defaultSplash);
            }
          }}
          className="h-full w-full object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90" />
      </div>

      <div className="absolute bottom-0 inset-x-0 p-3">
        <p className="text-xs font-bold text-white truncate uppercase tracking-wider group-hover:text-cyan-400 transition-colors drop-shadow-md">
          {displayName}
        </p>
      </div>
    </div>
  );
}
