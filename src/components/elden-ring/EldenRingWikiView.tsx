'use client';

import React, { useState, useEffect } from 'react';
import { EldenRingEntity, FextralifeCategory } from '@/lib/dataService';
import { Sparkles, X, ChevronRight } from 'lucide-react';

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

type SectionGroup = 'all' | 'equipment' | 'magic' | 'lore';
type ExpansionFilter = 'all' | 'Base Game' | 'Shadow of the Erdtree';

const CATEGORY_META: Record<FextralifeCategory, { label: string; group: SectionGroup; color: string; icon: string; totalEst: number }> = {
  weapons: { label: 'Vũ Khí', group: 'equipment', color: 'border-amber-500/30 text-amber-400 bg-amber-950/40', icon: '⚔️', totalEst: 409 },
  armors: { label: 'Áo Giáp', group: 'equipment', color: 'border-zinc-500/30 text-zinc-300 bg-zinc-900/60', icon: '🛡️', totalEst: 704 },
  shields: { label: 'Khiên Bảo Vệ', group: 'equipment', color: 'border-blue-500/30 text-blue-400 bg-blue-950/40', icon: '🛡️', totalEst: 79 },
  talismans: { label: 'Bùa Hộ Mệnh', group: 'equipment', color: 'border-yellow-500/30 text-yellow-300 bg-yellow-950/40', icon: '💍', totalEst: 130 },
  sorceries: { label: 'Ma Thuật', group: 'magic', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/40', icon: '🔮', totalEst: 84 },
  incantations: { label: 'Phép Thuật', group: 'magic', color: 'border-orange-500/30 text-orange-400 bg-orange-950/40', icon: '✨', totalEst: 129 },
  ashes: { label: 'Tro Tàn Chiến Tranh', group: 'magic', color: 'border-purple-500/30 text-purple-400 bg-purple-950/40', icon: '📜', totalEst: 116 },
  items: { label: 'Vật Phẩm & Chế Tạo', group: 'magic', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/40', icon: '🧪', totalEst: 350 },
  bosses: { label: 'Trùm & Bosses', group: 'lore', color: 'border-red-500/30 text-red-400 bg-red-950/40', icon: '💀', totalEst: 318 },
  npcs: { label: 'Nhân Vật & NV', group: 'lore', color: 'border-pink-500/30 text-pink-400 bg-pink-950/40', icon: '👤', totalEst: 85 },
  locations: { label: 'Địa Danh & Vùng Đất', group: 'lore', color: 'border-teal-500/30 text-teal-400 bg-teal-950/40', icon: '🗺️', totalEst: 150 },
};

export function EldenRingWikiView({ initialData }: EldenRingWikiViewProps) {
  const [activeGroup, setActiveGroup] = useState<SectionGroup>('all');
  const [activeCategory, setActiveCategory] = useState<FextralifeCategory | 'all'>('all');
  const [activeExpansion, setActiveExpansion] = useState<ExpansionFilter>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(48);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedEntity, setSelectedEntity] = useState<EldenRingEntity | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);

  useEffect(() => {
    setVisibleCount(48);
  }, [activeGroup, activeCategory, activeExpansion, activeSubCategory, searchQuery]);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const getAllEntities = (): EldenRingEntity[] => {
    return Object.values(initialData).flat();
  };

  const allEntities = getAllEntities();
  const totalAllItems = allEntities.length;

  const baseGameCount = allEntities.filter((e) => e.expansion === 'Base Game' || !e.expansion).length;
  const dlcCount = allEntities.filter((e) => e.expansion === 'Shadow of the Erdtree').length;

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

  const availableSubCategories = Array.from(
    new Set(
      allEntities
        .filter((e) => {
          const meta = CATEGORY_META[e.category];
          const matchesGroup = activeGroup === 'all' || meta.group === activeGroup;
          const matchesCategory = activeCategory === 'all' || e.category === activeCategory;
          const matchesExpansion = activeExpansion === 'all' || e.expansion === activeExpansion;
          return matchesGroup && matchesCategory && matchesExpansion && e.subCategory;
        })
        .map((e) => e.subCategory!)
    )
  ).sort();

  const filteredEntities = allEntities.filter((entity) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      entity.name.toLowerCase().includes(query) ||
      (entity.nameVi && entity.nameVi.toLowerCase().includes(query)) ||
      entity.description.toLowerCase().includes(query) ||
      (entity.subCategory && entity.subCategory.toLowerCase().includes(query)) ||
      (entity.locationHint && entity.locationHint.toLowerCase().includes(query));

    const meta = CATEGORY_META[entity.category];
    const matchesGroup = activeGroup === 'all' || meta.group === activeGroup;
    const matchesCategory = activeCategory === 'all' || entity.category === activeCategory;
    const matchesExpansion = activeExpansion === 'all' || entity.expansion === activeExpansion;
    const matchesSubCategory = activeSubCategory === 'all' || entity.subCategory === activeSubCategory;

    return matchesSearch && matchesGroup && matchesCategory && matchesExpansion && matchesSubCategory;
  });

  const visibleEntities = filteredEntities.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 sm:p-8 font-sans">
      {/* Header Fextralife Banner */}
      <div className="max-w-7xl mx-auto mb-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-950/30 p-6 sm:p-10 border border-amber-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-amber-400 bg-amber-950/70 border border-amber-500/40 uppercase">
              <Sparkles size={13} /> FEXTRALIFE ENCYCLOPEDIA
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 uppercase">
              🏰 Base Game: {baseGameCount}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-300 bg-amber-900/60 border border-amber-400/40 uppercase">
              ⚡ SOTE DLC: {dlcCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAuditModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-amber-300 hover:text-amber-100 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 px-3.5 py-2 rounded-xl transition duration-200 shadow-md cursor-pointer"
            >
              📊 Báo Cáo Kiểm Tra Số Lượng
            </button>
            <a
              href="https://mapgenie.io/elden-ring/maps/the-lands-between"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-3.5 py-2 rounded-xl transition duration-200 cursor-pointer"
            >
              🗺️ Bản Đồ MapGenie ↗
            </a>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 uppercase leading-tight">
          ⚔️ Bách Khoa Toàn Thư Elden Ring
        </h1>
        <p className="text-zinc-300 max-w-4xl text-xs sm:text-sm leading-relaxed font-sans">
          Tra cứu đầy đủ thông tin trang bị, vũ khí, bùa hộ mệnh, phép thuật và trùm trận đấu. Tự động tương thích hình ảnh và phòng chống chặn kết nối ảnh Fextralife.
        </p>

        {/* Search Input Bar */}
        <div className="mt-6 max-w-3xl relative">
          <input
            type="text"
            placeholder="Tìm kiếm bùa hộ mệnh, vũ khí, phép thuật (Two-Handed, Turtle, Milady, Rellana, Impenetrable Thorns...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Expansion Filter Bar (Base Game vs DLC vs All) */}
      <div className="max-w-7xl mx-auto mb-6 bg-zinc-900/80 p-2.5 rounded-2xl border border-zinc-800 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-zinc-400 uppercase px-3">Phiên bản Game:</span>
        <button
          onClick={() => setActiveExpansion('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
            activeExpansion === 'all'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          🌐 Tất Cả ({totalAllItems})
        </button>
        <button
          onClick={() => setActiveExpansion('Base Game')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
            activeExpansion === 'Base Game'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          🏰 Game Gốc ({baseGameCount})
        </button>
        <button
          onClick={() => setActiveExpansion('Shadow of the Erdtree')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
            activeExpansion === 'Shadow of the Erdtree'
              ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          ⚡ Shadow of the Erdtree DLC ({dlcCount})
        </button>
      </div>

      {/* Fextralife Main Groups */}
      <div className="max-w-7xl mx-auto mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveGroup('all'); setActiveCategory('all'); setActiveSubCategory('all'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeGroup === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          🌐 Tất Cả ({getGroupCount('all')})
        </button>
        <button
          onClick={() => { setActiveGroup('equipment'); setActiveCategory('all'); setActiveSubCategory('all'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeGroup === 'equipment'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          ⚔️ Trang Bị & Bùa Hộ Mệnh ({getGroupCount('equipment')})
        </button>
        <button
          onClick={() => { setActiveGroup('magic'); setActiveCategory('all'); setActiveSubCategory('all'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeGroup === 'magic'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          🔮 Phép Thuật & Tro Tàn ({getGroupCount('magic')})
        </button>
        <button
          onClick={() => { setActiveGroup('lore'); setActiveCategory('all'); setActiveSubCategory('all'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeGroup === 'lore'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          💀 Trùm & Địa Danh ({getGroupCount('lore')})
        </button>
      </div>

      {/* Sub Category Badges Filter */}
      <div className="max-w-7xl mx-auto mb-4 flex overflow-x-auto gap-2 pb-2 scrollbar-thin">
        <button
          onClick={() => { setActiveCategory('all'); setActiveSubCategory('all'); }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-zinc-800 text-amber-400 border border-amber-500/40'
              : 'text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-zinc-200'
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
              onClick={() => { setActiveCategory(cat); setActiveSubCategory('all'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'border-amber-500/60 bg-amber-950/70 text-amber-300 shadow-sm'
                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {meta.icon} {meta.label} <span className="opacity-75 text-[11px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* SubCategory Fine-Tuning Chips */}
      {availableSubCategories.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6 flex overflow-x-auto gap-1.5 pb-2">
          <span className="text-[11px] font-bold text-zinc-500 uppercase self-center shrink-0 mr-1">Phân loại chi tiết:</span>
          <button
            onClick={() => setActiveSubCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
              activeSubCategory === 'all'
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                : 'bg-zinc-950 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tất cả dạng
          </button>
          {availableSubCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubCategory(sub)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                activeSubCategory === sub
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                  : 'bg-zinc-950 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Results Status Bar */}
      <div className="max-w-7xl mx-auto mb-4 flex items-center justify-between text-xs text-zinc-400 font-medium">
        <div>
          Hiển thị <span className="text-amber-400 font-bold">{Math.min(visibleCount, filteredEntities.length)}</span> / <span className="text-zinc-200 font-bold">{filteredEntities.length}</span> kết quả
          {searchQuery && <span> cho từ khóa "<span className="text-amber-300">{searchQuery}</span>"</span>}
        </div>
        {(searchQuery || activeCategory !== 'all' || activeGroup !== 'all' || activeExpansion !== 'all' || activeSubCategory !== 'all') && (
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); setActiveGroup('all'); setActiveExpansion('all'); setActiveSubCategory('all'); }}
            className="text-xs text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
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
          const isDlc = entity.expansion === 'Shadow of the Erdtree';

          return (
            <div
              key={entity.id}
              onClick={() => setSelectedEntity(entity)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-4 backdrop-blur-md transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-900/90 hover:shadow-xl hover:shadow-amber-950/20 cursor-pointer"
            >
              <div>
                {/* Image Showcase with Hotlink Bypass */}
                <div className="relative mb-3 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-900/90 p-3 border border-zinc-800/80">
                  {hasError || !entity.image ? (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      <span className="text-3xl mb-1">{meta.icon}</span>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{meta.label}</span>
                    </div>
                  ) : (
                    <img
                      src={entity.image}
                      alt={entity.name}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(entity.id)}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  {isDlc && (
                    <span className="absolute top-2 right-2 rounded-md bg-amber-500/90 text-zinc-950 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow">
                      ⚡ DLC
                    </span>
                  )}
                </div>

                {/* Badges */}
                <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold border ${meta.color}`}>
                    {meta.icon} {meta.label}
                  </span>
                  {entity.subCategory && (
                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 truncate max-w-[140px]">
                      {entity.subCategory}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="line-clamp-1 text-base font-extrabold text-white group-hover:text-amber-300 transition-colors uppercase tracking-wide">
                  {entity.name}
                </h3>
                {entity.nameVi && (
                  <p className="line-clamp-1 text-xs font-semibold text-amber-400/90 mb-1">
                    {entity.nameVi}
                  </p>
                )}

                {/* Location Hint */}
                {entity.locationHint && (
                  <p className="mt-1 line-clamp-1 text-[11px] font-medium text-amber-400/90 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/10">
                    📍 {entity.locationHint}
                  </p>
                )}

                {/* Description */}
                <p className="mt-2 line-clamp-2 text-xs text-zinc-400 leading-relaxed font-sans">
                  {entity.description || 'Chưa có thông tin mô tả chi tiết.'}
                </p>
              </div>

              {/* View Detail Action Footer */}
              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span>Xem Thông Tin Chi Tiết</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 text-zinc-950 font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            Tải Thêm +48 Vật Phẩm ({filteredEntities.length - visibleCount} còn lại)
          </button>
          <button
            onClick={() => setVisibleCount(filteredEntities.length)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all cursor-pointer"
          >
            Hiển Thị Tất Cả ({filteredEntities.length})
          </button>
        </div>
      )}

      {filteredEntities.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-16 text-zinc-500 font-sans">
          Không tìm thấy vật phẩm hoặc thông tin phù hợp với bộ lọc hiện tại.
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-amber-500/40 p-6 sm:p-8 shadow-2xl text-zinc-100">
            <button
              onClick={() => setSelectedEntity(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Image Box */}
              <div className="w-full sm:w-48 h-48 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-4 shrink-0 overflow-hidden">
                {failedImages[selectedEntity.id] || !selectedEntity.image ? (
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-4xl mb-2">{CATEGORY_META[selectedEntity.category].icon}</span>
                    <span className="text-xs font-bold text-amber-400 uppercase">{CATEGORY_META[selectedEntity.category].label}</span>
                  </div>
                ) : (
                  <img
                    src={selectedEntity.image}
                    alt={selectedEntity.name}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(selectedEntity.id)}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>

              {/* Information */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${CATEGORY_META[selectedEntity.category].color}`}>
                    {CATEGORY_META[selectedEntity.category].icon} {CATEGORY_META[selectedEntity.category].label}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${selectedEntity.expansion === 'Shadow of the Erdtree' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'}`}>
                    {selectedEntity.expansion === 'Shadow of the Erdtree' ? '⚡ Shadow of the Erdtree DLC' : '🏰 Game Gốc (Base Game)'}
                  </span>
                </div>

                <h2 className="text-2xl font-black uppercase text-white tracking-wide">
                  {selectedEntity.name}
                </h2>
                {selectedEntity.nameVi && (
                  <p className="text-sm font-bold text-amber-400">
                    {selectedEntity.nameVi}
                  </p>
                )}

                {selectedEntity.subCategory && (
                  <p className="text-xs text-zinc-400 font-mono">
                    Loại vật phẩm: <strong className="text-zinc-200">{selectedEntity.subCategory}</strong>
                  </p>
                )}

                {selectedEntity.quote && (
                  <blockquote className="border-l-2 border-amber-500 pl-3 py-1 italic text-xs text-amber-200/90 bg-amber-950/20 rounded-r-lg font-serif">
                    "{selectedEntity.quote}"
                  </blockquote>
                )}

                <div className="text-xs text-zinc-300 leading-relaxed font-sans space-y-2 pt-2 border-t border-zinc-800/80">
                  <strong className="text-white uppercase font-extrabold block">Mô Tả Vật Phẩm:</strong>
                  <p className="text-zinc-400 whitespace-pre-line">{selectedEntity.description || 'Chưa cập nhật nội dung mô tả đầy đủ.'}</p>
                </div>

                {selectedEntity.locationHint && (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs font-sans">
                    <span className="font-bold text-amber-400 block mb-0.5">📍 Vị Trí & Cách Sở Hữu:</span>
                    <span className="text-zinc-300">{selectedEntity.locationHint}</span>
                  </div>
                )}

                {selectedEntity.stats && (
                  <div className="pt-2">
                    <strong className="text-xs text-white uppercase font-extrabold block mb-1">Chỉ Số Tấn Công / Yêu Cầu:</strong>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      {Object.entries(selectedEntity.stats).map(([k, v]) => (
                        <div key={k} className="bg-zinc-900 p-2 rounded-lg border border-zinc-800 flex justify-between">
                          <span className="text-zinc-400">{k}:</span>
                          <span className="text-amber-400 font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <a
                    href={selectedEntity.mapLocationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold uppercase text-zinc-950 bg-amber-500 hover:bg-amber-400 py-3 rounded-xl transition duration-200 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    🗺️ Định Vị Trên Bản Đồ MapGenie ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-amber-500/40 p-6 sm:p-8 shadow-2xl text-zinc-100">
            <button
              onClick={() => setShowAuditModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-black uppercase text-white tracking-wide mb-2 flex items-center gap-2">
              📊 Báo Cáo Kiểm Tra Số Lượng Vật Phẩm Elden Ring
            </h2>
            <p className="text-xs text-zinc-400 mb-6 font-sans">
              Đánh giá chi tiết số lượng vật phẩm đã tích hợp trong hệ thống so với toàn bộ vũ trụ Elden Ring.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-2xl font-black text-amber-400">{totalAllItems.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-zinc-400 uppercase block mt-1">Đã Tích Hợp Vào Wiki</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-2xl font-black text-cyan-400">{baseGameCount.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-zinc-400 uppercase block mt-1">Vật Phẩm Base Game</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-2xl font-black text-amber-300">{dlcCount.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-zinc-400 uppercase block mt-1">Vật Phẩm DLC SOTE</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-zinc-900 text-zinc-300 uppercase font-bold border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Danh Mục (Category)</th>
                    <th className="p-3 text-center">Đã Thêm (Loaded)</th>
                    <th className="p-3 text-center">Ước Tính Vũ Trụ (Universe Total)</th>
                    <th className="p-3 text-center">Số Lượng Còn Thiếu (Missing)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/80">
                  {(Object.keys(CATEGORY_META) as FextralifeCategory[]).map((cat) => {
                    const meta = CATEGORY_META[cat];
                    const loadedCount = getCategoryCount(cat);
                    const estTotal = meta.totalEst;
                    const missing = Math.max(0, estTotal - loadedCount);

                    return (
                      <tr key={cat} className="hover:bg-zinc-900/50">
                        <td className="p-3 font-bold text-zinc-200">
                          {meta.icon} {meta.label} <span className="text-zinc-500 font-mono text-[10px]">({cat})</span>
                        </td>
                        <td className="p-3 text-center font-bold text-amber-400">{loadedCount}</td>
                        <td className="p-3 text-center text-zinc-400 font-mono">{estTotal}</td>
                        <td className="p-3 text-center font-bold text-rose-400">{missing > 0 ? `~${missing}` : '0 (100%)'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
