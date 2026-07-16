'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Champion } from '@/lib/riotService';
import { Search, Tag, Sparkles } from 'lucide-react';

interface ChampionGridProps {
  champions: Champion[];
  version: string;
}

export default function ChampionGrid({ champions, version }: ChampionGridProps) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    champions.forEach((c) => c.tags.forEach((t) => tagsSet.add(t)));
    return ['ALL', ...Array.from(tagsSet)];
  }, [champions]);

  const filteredChampions = useMemo(() => {
    return champions.filter((champion) => {
      const matchesSearch =
        champion.name.toLowerCase().includes(search.toLowerCase()) ||
        champion.title.toLowerCase().includes(search.toLowerCase());

      const matchesTag = selectedTag === 'ALL' || champion.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [champions, search, selectedTag]);

  return (
    <div className="w-full space-y-6 font-sans">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between glass-card p-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tướng..."
            className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800/80 py-2.5 pl-4 pr-10 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
          />
          <Search size={16} className="absolute right-3 top-3 text-zinc-500" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {allTags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:border-cyan-500/30 hover:text-zinc-200'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>
          Hiển thị <strong className="text-cyan-400 font-semibold">{filteredChampions.length}</strong> / {champions.length} tướng
        </span>
        <span className="text-[11px] text-zinc-500 font-mono">Phiên bản: Patch {version}</span>
      </div>

      {filteredChampions.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-zinc-400">
          <Sparkles className="mx-auto text-zinc-600 mb-3 stroke-1" size={40} />
          <p className="text-sm font-medium">Không tìm thấy tướng phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filteredChampions.map((champion) => {
            const imageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.id}.png`;

            return (
              <div
                key={champion.key}
                className="glass-card glass-card-hover group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md transition-all duration-300"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={imageUrl}
                    alt={champion.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {champion.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-zinc-950/80 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wide text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {champion.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 capitalize line-clamp-1 mt-0.5 font-normal">
                      {champion.title}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
