'use client';

import React, { useState, useEffect } from 'react';
import { EldenRingEntity, FextralifeCategory } from '@/lib/dataService';

export interface FextralifeWikiData {
  weapons: EldenRingEntity[];
  armors: EldenRingEntity[];
  shields: EldenRingEntity[];
  talismans: EldenRingEntity[];
  sorceries: EldenRingEntity[];
  incantations: EldenRingEntity[];
  ashes: EldenRingEntity[];
  items: EldenRingEntity[];
  bosses: EldenRingEntity[];
  npcs: EldenRingEntity[];
  locations: EldenRingEntity[];
}

interface EldenRingWikiViewProps {
  initialData: FextralifeWikiData;
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2371717a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';

type SectionGroup = 'all' | 'equipment' | 'magic' | 'lore';

const CATEGORY_META: Record<FextralifeCategory, { label: string; group: SectionGroup; color: string }> = {
  weapons: { label: 'Vũ Khí', group: 'equipment', color: 'border-amber-500/30 text-amber-400 bg-amber-950/40' },
  armors: { label: 'Áo Giáp', group: 'equipment', color: 'border-zinc-500/30 text-zinc-300 bg-zinc-900/60' },
  shields: { label: 'Khiên Bảo Vệ', group: 'equipment', color: 'border-blue-500/30 text-blue-400 bg-blue-950/40' },
  talismans: { label: 'Bùa Hộ Mệnh', group: 'equipment', color: 'border-yellow-500/30 text-yellow-300 bg-yellow-950/40' },
  sorceries: { label: 'Ma Thuật', group: 'magic', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/40' },
  incantations: { label: 'Phép Thuật', group: 'magic', color: 'border-orange-500/30 text-orange-400 bg-orange-950/40' },
  ashes: { label: 'Tro Tàn Chiến Tranh', group: 'magic', color: 'border-purple-500/30 text-purple-400 bg-purple-950/40' },
  items: { label: 'Vật Phẩm & Chế Tạo', group: 'magic', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/40' },
  bosses: { label: 'Trùm & Bosses', group: 'lore', color: 'border-red-500/30 text-red-400 bg-red-950/40' },
  npcs: { label: 'Nhân Vật & NV', group: 'lore', color: 'border-pink-500/30 text-pink-400 bg-pink-950/40' },
  locations: { label: 'Địa Danh & Vùng Đất', group: 'lore', color: 'border-teal-500/30 text-teal-400 bg-teal-950/40' },
};

export function EldenRingWikiView({ initialData }: EldenRingWikiViewProps) {
  const [activeGroup, setActiveGroup] = useState<SectionGroup>('all');
  const [activeCategory, setActiveCategory] = useState<FextralifeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(48);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setVisibleCount(48);
  }, [activeGroup, activeCategory, searchQuery]);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const getAllEntities = (): EldenRingEntity[] => {
    return Object.values(initialData).flat();
  };

  const totalAllItems = getAllEntities().length;

  const getCategoryCount = (cat: FextralifeCategory): number => {
    return initialData[cat]?.length || 0;
  };

  const getGroupCount = (group: SectionGroup): number => {
    if (group === 'all') return totalAllItems;
    return (Object.keys(CATEGORY_META) as FextralifeCategory[]).reduce((acc, cat) => {
      if (CATEGORY_META[cat].group === group) {
        return acc + getCategoryCount(cat);
      }
      return acc;
    }, 0);
  };

  const filteredEntities = getAllEntities().filter((entity) => {
    const matchesSearch =
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entity.locationHint && entity.locationHint.toLowerCase().includes(searchQuery.toLowerCase()));

    const meta = CATEGORY_META[entity.category];
    const matchesGroup = activeGroup === 'all' || meta.group === activeGroup;
    const matchesCategory = activeCategory === 'all' || entity.category === activeCategory;

    return matchesSearch && matchesGroup && matchesCategory;
  });

  const visibleEntities = filteredEntities.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8">
      {/* Header Fextralife Banner */}
      <div className="max-w-7xl mx-auto mb-8 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-950/30 p-6 sm:p-10 border border-amber-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/30">
            <span>⚔️ FEXTRALIFE STYLE FULL DATABASE</span>
            <span className="bg-amber-500/20 px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-300">
              {totalAllItems.toLocaleString()} Dữ Liệu
            </span>
          </div>
          <a
            href="https://mapgenie.io/elden-ring/maps/the-lands-between"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-all"
          >
            🗺️ Mở Bản Đồ Tương Tác MapGenie ↗
          </a>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 mb-3">
          Bách Khoa Toàn Thư Elden Ring
        </h1>
        <p className="text-zinc-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          Tra cứu đầy đủ {totalAllItems.toLocaleString()} vật phẩm, vũ khí, bộ áo giáp, khiên, bùa hộ mệnh, ma thuật, chiêu thức, bosses, nhân vật và địa danh trên toàn bộ bản đồ Lands Between.
        </p>

        {/* Search Input */}
        <div className="mt-6 max-w-2xl relative">
          <input
            type="text"
            placeholder="Tìm kiếm vật phẩm, vũ khí, boss hoặc khu vực nhặt đồ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 shadow-inner"
          />
        </div>
      </div>

      {/* Main Groups (Fextralife High Level Sections) */}
      <div className="max-w-7xl mx-auto mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveGroup('all'); setActiveCategory('all'); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGroup === 'all'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          🌐 Tất Cả Mục ({getGroupCount('all')})
        </button>
        <button
          onClick={() => { setActiveGroup('equipment'); setActiveCategory('all'); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGroup === 'equipment'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          ⚔️ Trang Bị & Chiến Đấu ({getGroupCount('equipment')})
        </button>
        <button
          onClick={() => { setActiveGroup('magic'); setActiveCategory('all'); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGroup === 'magic'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          🔮 Ma Thuật & Vật Phẩm ({getGroupCount('magic')})
        </button>
        <button
          onClick={() => { setActiveGroup('lore'); setActiveCategory('all'); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeGroup === 'lore'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          💀 Bosses & Vị Trí Cốt Truyện ({getGroupCount('lore')})
        </button>
      </div>

      {/* Sub Category Badges Filter */}
      <div className="max-w-7xl mx-auto mb-6 flex overflow-x-auto gap-2 pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          Tất Cả Loại
        </button>
        {(Object.keys(CATEGORY_META) as FextralifeCategory[]).map((cat) => {
          const meta = CATEGORY_META[cat];
          if (activeGroup !== 'all' && meta.group !== activeGroup) return null;
          const count = getCategoryCount(cat);

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
                activeCategory === cat
                  ? 'border-amber-500/60 bg-amber-950/60 text-amber-300 shadow-sm'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {meta.label} <span className="opacity-70 text-[11px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Results Status Bar */}
      <div className="max-w-7xl mx-auto mb-4 flex items-center justify-between text-xs text-zinc-400 font-medium">
        <div>
          Hiển thị <span className="text-amber-400 font-bold">{Math.min(visibleCount, filteredEntities.length)}</span> / <span className="text-zinc-200 font-bold">{filteredEntities.length}</span> kết quả
          {searchQuery && <span> cho từ khóa "<span className="text-amber-300">{searchQuery}</span>"</span>}
        </div>
        {(searchQuery || activeCategory !== 'all' || activeGroup !== 'all') && (
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); setActiveGroup('all'); }}
            className="text-xs text-amber-400 hover:underline"
          >
            🔄 Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Item Display Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {visibleEntities.map((entity) => {
          const meta = CATEGORY_META[entity.category];
          const hasError = failedImages[entity.id];
          const imgSrc = hasError || !entity.image ? FALLBACK_IMAGE : entity.image;

          return (
            <div
              key={entity.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-amber-950/20"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative mb-3 flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-zinc-950/80 p-2">
                  <img
                    src={imgSrc}
                    alt={entity.name}
                    onError={() => handleImageError(entity.id)}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Category Badge & Location Hint */}
                <div className="mb-2 flex items-center justify-between gap-1">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold border ${meta.color}`}>
                    {meta.label}
                  </span>
                  {entity.locationHint && (
                    <span className="line-clamp-1 text-[10px] font-medium text-amber-400/90 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/10">
                      📍 {entity.locationHint}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="line-clamp-1 text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  {entity.name}
                </h3>

                {/* Quote */}
                {entity.quote && (
                  <p className="mt-1 text-xs italic text-amber-200/70 line-clamp-2">
                    "{entity.quote}"
                  </p>
                )}

                {/* Description */}
                <p className="mt-2 line-clamp-3 text-xs text-zinc-400 leading-relaxed">
                  {entity.description || 'Chưa có thông tin mô tả đầy đủ.'}
                </p>
              </div>

              {/* Action Button: Interactive Location Map Link */}
              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                <a
                  href={entity.mapLocationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-950/50 hover:bg-amber-900/70 border border-amber-500/30 py-2 rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-amber-950/40"
                >
                  🗺️ Định Vị Vị Trí Trên Bản Đồ ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Pagination Controls */}
      {visibleCount < filteredEntities.length && (
        <div className="max-w-7xl mx-auto mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setVisibleCount((prev) => prev + 48)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
          >
            Tải Thêm +48 Vật Phẩm ({filteredEntities.length - visibleCount} còn lại)
          </button>
          <button
            onClick={() => setVisibleCount(filteredEntities.length)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all"
          >
            Hiển Thị Tất Cả ({filteredEntities.length})
          </button>
        </div>
      )}

      {filteredEntities.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-16 text-zinc-500">
          Không tìm thấy vật phẩm hoặc thông tin phù hợp với bộ lọc hiện tại.
        </div>
      )}
    </div>
  );
}

