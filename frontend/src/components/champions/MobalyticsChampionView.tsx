'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Swords,
  Shield,
  Zap,
  Target,
  Sparkles,
  TrendingUp,
  Wind,
  Eye,
  ChevronRight,
  ArrowRight,
  Medal,
  Flame,
  LayoutGrid,
} from 'lucide-react';
import { getChampionMetaBuild, MetaBuild, RankTier } from '@/lib/lolMetaHelper';
import SkinGallery from './SkinGallery';
import SkillCappedRuneGrid from './SkillCappedRuneGrid';

interface ChampionDetail {
  id: string;
  key: string;
  name: string;
  title: string;
  lore: string;
  tags: string[];
  partype: string;
  info: { attack: number; defense: number; magic: number; difficulty: number };
  stats: Record<string, number>;
  image: { icon: string; splash: string; loading: string };
  skins: { id: string; num: number; name: string; splash: string; loading: string }[];
  spells: {
    id: string;
    name: string;
    description: string;
    cooldown: string;
    cost: string;
    range: string;
    image: string;
  }[];
  passive: { name: string; description: string; image: string } | null;
  allytips: string[];
  enemytips: string[];
}

interface MobalyticsChampionViewProps {
  champion: ChampionDetail;
  version: string;
  itemsMap?: Record<string, any>;
}

const SPELL_KEYS = ['Q', 'W', 'E', 'R'];

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export default function MobalyticsChampionView({
  champion,
  version,
  itemsMap = {},
}: MobalyticsChampionViewProps) {
  const [activeTab, setActiveTab] = useState<'builds' | 'spells' | 'lore' | 'skins'>('builds');
  const [selectedRank, setSelectedRank] = useState<RankTier>('all');
  const [useSkillCappedGrid, setUseSkillCappedGrid] = useState<boolean>(true);

  // Dynamic Meta Data based on selected Rank filter (Low Elo, Emerald+, High Elo)
  const meta: MetaBuild = getChampionMetaBuild(champion.id, champion.tags, selectedRank);

  return (
    <div className="w-full space-y-6 font-sans">
      {/* 1. Top Breadcrumb & Quick Nav */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <Link href="/wiki/lien-minh-huyen-thoai" className="hover:text-cyan-400 transition-colors">
            LMHT
          </Link>
          <ChevronRight size={12} className="text-zinc-600" />
          <Link href="/wiki/lien-minh-huyen-thoai/champions" className="hover:text-cyan-400 transition-colors">
            Tướng
          </Link>
          <ChevronRight size={12} className="text-zinc-600" />
          <span className="text-cyan-400 font-bold">{champion.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={12} /> CommunityDragon & Riot Patch {version}
          </span>
        </div>
      </div>

      {/* 2. Rank Division Selector Bar (Mobalytics Tier Filter) */}
      <div className="glass-card rounded-2xl border border-zinc-800/80 p-3.5 flex flex-wrap items-center justify-between gap-3 bg-zinc-950/90 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
          <Medal size={16} className="text-amber-400" />
          <span>Phân Cấp Mức Rank Meta:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedRank('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              selectedRank === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20 scale-105'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            🔰 Tất Cả Rank
          </button>

          <button
            onClick={() => setSelectedRank('low')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              selectedRank === 'low'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 scale-105'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-400'
            }`}
          >
            🟢 Low Elo (Sắt - Vàng)
          </button>

          <button
            onClick={() => setSelectedRank('emerald')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              selectedRank === 'emerald'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 scale-105'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-400'
            }`}
          >
            🔷 Emerald+ (Lục Bảo+)
          </button>

          <button
            onClick={() => setSelectedRank('high')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              selectedRank === 'high'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/20 scale-105'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-purple-400'
            }`}
          >
            💎 High Elo (Cao Thủ+)
          </button>
        </div>
      </div>

      {/* 3. Hero Header Banner (Mobalytics Layout) */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl">
        <div className="relative h-72 md:h-80 w-full">
          <img
            src={champion.image.splash}
            alt={champion.name}
            className="h-full w-full object-cover object-top opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Left Avatar & Name */}
          <div className="flex items-center gap-5">
            <img
              src={champion.image.icon}
              alt={champion.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-cyan-500/60 shadow-2xl object-cover shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">
                  {meta.role}
                </span>
                <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-400">
                  TIER {meta.tier}
                </span>
                <span className="rounded-md bg-indigo-500/20 border border-indigo-500/40 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
                  Độ Khó: {meta.difficulty}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-lg">
                {champion.name}
              </h1>

              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <span className="capitalize">{champion.title}</span>
                <span className="text-zinc-600">&bull;</span>
                <span className="text-amber-300 flex items-center gap-1">
                  <Flame size={12} /> {meta.recommendedEloText}
                </span>
              </div>
            </div>
          </div>

          {/* Right Meta Analytics Cards (Mobalytics Dashboard Stats) */}
          <div className="grid grid-cols-3 gap-3 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 p-3.5 rounded-2xl shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Tỷ Lệ Thắng</span>
              <span className="text-base font-black text-emerald-400 font-mono">{meta.winRate}</span>
            </div>
            <div className="text-center px-2 border-x border-zinc-800">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Tỷ Lệ Chọn</span>
              <span className="text-base font-black text-cyan-400 font-mono">{meta.pickRate}</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Tỷ Lệ Cấm</span>
              <span className="text-base font-black text-rose-400 font-mono">{meta.banRate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Navigation Tabs */}
      <div className="flex border-b border-zinc-800/80 overflow-x-auto gap-2 pb-1">
        <button
          onClick={() => setActiveTab('builds')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'builds'
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Swords size={15} />
          Trang Bị & Ngọc Meta
        </button>

        <button
          onClick={() => setActiveTab('spells')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'spells'
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Zap size={15} />
          Chi Tiết Kỹ Năng
        </button>

        <button
          onClick={() => setActiveTab('lore')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'lore'
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Eye size={15} />
          Tiểu Sử & Cốt Truyện
        </button>

        <button
          onClick={() => setActiveTab('skins')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'skins'
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Wind size={15} />
          Trang Phục ({champion.skins.length})
        </button>
      </div>

      {/* 5. TAB 1: BUILD & RUNES (FULL-WIDTH EXPANDED LAYOUT) */}
      {activeTab === 'builds' && (
        <div className="space-y-8">
          {/* SECTION A: Item Builds & Skill Priority */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Recommended Item Builds */}
            <div className="lg:col-span-2 space-y-6">
              {/* Item Progression Card */}
              <div className="glass-card rounded-2xl border border-zinc-800/80 p-6 space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                  <Swords size={16} className="text-cyan-400" />
                  Lối Lên Trang Bị Khuyên Dùng ({selectedRank === 'all' ? 'Tất Cả Rank' : selectedRank === 'low' ? 'Low Elo Sắt - Vàng' : selectedRank === 'emerald' ? 'Emerald+' : 'High Elo'})
                </h3>

                {/* Starter Items */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    1. Trang Bị Khởi Đầu
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    {meta.starterItems.map((itemId) => (
                      <ItemDisplayCard key={itemId} itemId={itemId} version={version} itemsMap={itemsMap} />
                    ))}
                    <div className="ml-auto flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-zinc-800">
                      <span className="text-[11px] text-zinc-400 font-bold uppercase">Phép Bổ Trợ:</span>
                      {meta.summonerSpells.map((spell, idx) => (
                        <img key={idx} src={spell.icon} alt={spell.name} title={spell.name} className="w-6 h-6 rounded-md border border-cyan-500/40" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Core Items */}
                <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                    2. Bộ Trang Bị Cốt Lõi (Core Builds)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    {meta.coreItems.map((itemId, i) => (
                      <React.Fragment key={itemId}>
                        <ItemDisplayCard itemId={itemId} version={version} itemsMap={itemsMap} isCore />
                        {i < meta.coreItems.length - 1 && (
                          <ArrowRight size={14} className="text-zinc-600 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Boots & Situational */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/60">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      3. Giày Chọn Lựa
                    </span>
                    <div className="flex gap-2">
                      {meta.boots.map((itemId) => (
                        <ItemDisplayCard key={itemId} itemId={itemId} version={version} itemsMap={itemsMap} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      4. Trang Bị Tình Huống Cuối Trận
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {meta.situationalItems.map((itemId) => (
                        <ItemDisplayCard key={itemId} itemId={itemId} version={version} itemsMap={itemsMap} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Order Progression Bar */}
              <div className="glass-card rounded-2xl border border-zinc-800/80 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" />
                    Thứ Tự Nâng Kỹ Năng (Skill Priority)
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase">
                    <span>Thứ tự ưu tiên Max:</span>
                    <span className="bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-md font-mono">
                      {meta.skillMaxPriority.join(' > ')}
                    </span>
                  </div>
                </div>

                {/* Skill Order Grid */}
                <div className="space-y-2 pt-1">
                  {SPELL_KEYS.map((spellKey, i) => {
                    const spellObj = champion.spells[i];
                    return (
                      <div key={spellKey} className="flex items-center gap-3">
                        <div className="w-24 flex items-center gap-2 shrink-0">
                          {spellObj ? (
                            <img src={spellObj.image} alt={spellObj.name} className="w-7 h-7 rounded-lg border border-zinc-700 object-cover" />
                          ) : (
                            <div className="w-7 h-7 bg-zinc-800 rounded-lg" />
                          )}
                          <span className="text-xs font-bold text-white font-mono">[{spellKey}]</span>
                        </div>

                        {/* 18 Level Cells */}
                        <div className="grid grid-cols-18 gap-1 flex-1">
                          {Array.from({ length: 18 }).map((_, levelIndex) => {
                            const levelNum = levelIndex + 1;
                            const isSelected =
                              (meta.skillMaxPriority[0] === spellKey && [1, 4, 5, 7, 9].includes(levelNum)) ||
                              (meta.skillMaxPriority[1] === spellKey && [2, 8, 10, 12, 13].includes(levelNum)) ||
                              (meta.skillMaxPriority[2] === spellKey && [3, 14, 15, 17, 18].includes(levelNum)) ||
                              (spellKey === 'R' && [6, 11, 16].includes(levelNum));

                            return (
                              <div
                                key={levelIndex}
                                title={`Cấp ${levelNum}`}
                                className={`h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                                  isSelected
                                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-950 shadow-md font-extrabold scale-105'
                                    : 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-600'
                                }`}
                              >
                                {isSelected ? levelNum : ''}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Matchups & Counters Card */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl border border-zinc-800/80 p-5 space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-800 pb-2.5">
                  <TrendingUp size={14} /> Khắc Chế Tốt (Win Rate Cao)
                </h4>
                <div className="space-y-2.5">
                  {meta.counters.strongAgainst.map((c) => (
                    <div key={c.name} className="flex items-center justify-between bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <img src={c.icon} alt={c.name} className="w-8 h-8 rounded-lg border border-emerald-500/40 object-cover" />
                        <span className="text-xs font-bold text-white">{c.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400 font-mono">{c.winRate}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-zinc-800/80 p-5 space-y-4">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-800 pb-2.5">
                  <Shield size={14} /> Bị Khắc Chế Bởi (Kèo Khó)
                </h4>
                <div className="space-y-2.5">
                  {meta.counters.weakAgainst.map((c) => (
                    <div key={c.name} className="flex items-center justify-between bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <img src={c.icon} alt={c.name} className="w-8 h-8 rounded-lg border border-rose-500/40 object-cover" />
                        <span className="text-xs font-bold text-white">{c.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-rose-400 font-mono">{c.winRate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: FULL-WIDTH WIDE RUNES SETUP & SKILL-CAPPED MATRIX */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <LayoutGrid size={18} className="text-amber-400" /> BẢNG NGỌC BỔ TRỢ & CHIẾN THUẬT LỐI CHƠI (FULL-WIDTH EXPANDED MATRIX)
              </span>
              <div className="flex items-center gap-1 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setUseSkillCappedGrid(true)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    useSkillCappedGrid
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-950 shadow-md font-extrabold scale-105'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Skill-Capped Matrix (Rộng)
                </button>
                <button
                  onClick={() => setUseSkillCappedGrid(false)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !useSkillCappedGrid
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md font-extrabold scale-105'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Dạng Thẻ Rút Gọn
                </button>
              </div>
            </div>

            {/* Expanded Full-Width Skill-Capped Rune Matrix */}
            {useSkillCappedGrid ? (
              <SkillCappedRuneGrid runes={meta.runes} summonerSpells={meta.summonerSpells} />
            ) : (
              <div className="glass-card rounded-2xl border border-zinc-800/80 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={16} className="text-cyan-400" />
                    Bảng Ngọc Rút Gọn
                  </h3>
                  <div className="flex items-center gap-2">
                    <img src={meta.runes.icon} alt={meta.runes.name} className="w-5 h-5 object-contain" />
                    <span className="text-[11px] font-bold text-cyan-400 uppercase">{meta.runes.name}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Keystone Node */}
                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                    <img
                      src={meta.runes.keystone.icon}
                      alt={meta.runes.keystone.name}
                      className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 p-1 object-contain shrink-0 shadow-lg shadow-cyan-500/20"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Ngọc Siêu Cấp</span>
                      <h4 className="text-xs font-bold text-white uppercase">{meta.runes.keystone.name}</h4>
                      <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">{meta.runes.keystone.description}</p>
                    </div>
                  </div>

                  {/* Stat Shards */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Mảnh Chỉ Số (Stat Shards)</span>
                    <div className="flex flex-wrap gap-2">
                      {meta.runes.statShards.map((shard, idx) => (
                        <span key={idx} className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs font-bold text-cyan-300">
                          {shard}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. TAB 2: SPELLS & ABILITIES */}
      {activeTab === 'spells' && (
        <div className="glass-card rounded-2xl border border-zinc-800/80 p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800/80 pb-3">
            <Zap size={16} className="text-cyan-400" />
            Chi Tiết Bộ Kỹ Năng Đấu Trường
          </h3>

          {/* Passive */}
          {champion.passive && (
            <div className="flex gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <img src={champion.passive.image} alt={champion.passive.name} className="w-14 h-14 rounded-xl border border-cyan-500/40 shrink-0 object-cover" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-md">
                    Nội Tại
                  </span>
                  <h4 className="text-sm font-bold text-white uppercase">{champion.passive.name}</h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans pt-1">
                  {stripHtml(champion.passive.description)}
                </p>
              </div>
            </div>
          )}

          {/* Q W E R Spells */}
          <div className="space-y-4">
            {champion.spells.map((spell, i) => (
              <div key={spell.id} className="flex gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/40 transition-colors">
                <img src={spell.image} alt={spell.name} className="w-14 h-14 rounded-xl border border-indigo-500/40 shrink-0 object-cover" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-md uppercase">
                      Chiêu {SPELL_KEYS[i] || `S${i + 1}`}
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase">{spell.name}</h4>
                    <span className="text-xs text-zinc-400 font-sans ml-auto">
                      Hồi chiêu: {spell.cooldown}s &bull; Tiêu hao: {spell.cost} &bull; Tầm chiêu: {spell.range}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans pt-1">
                    {stripHtml(spell.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB 3: LORE & STORY */}
      {activeTab === 'lore' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl border border-zinc-800/80 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800/80 pb-3">
              <Eye size={16} className="text-cyan-400" />
              Tiểu Sử & Huyền Thoại Nhân Vật
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
              {champion.lore || 'Không có thông tin tiểu sử chi tiết.'}
            </p>
          </div>

          {(champion.allytips?.length > 0 || champion.enemytips?.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6">
              {champion.allytips?.length > 0 && (
                <div className="glass-card rounded-2xl border border-zinc-800/80 p-6 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} /> Mẹo Chiến Thuật Khi Sử Dụng
                  </h4>
                  <ul className="space-y-2">
                    {champion.allytips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 leading-relaxed flex gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {champion.enemytips?.length > 0 && (
                <div className="glass-card rounded-2xl border border-zinc-800/80 p-6 space-y-3">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={14} /> Mẹo Đối Đầu & Khắc Chế
                  </h4>
                  <ul className="space-y-2">
                    {champion.enemytips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 leading-relaxed flex gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 8. TAB 4: SKINS GALLERY */}
      {activeTab === 'skins' && (
        <SkinGallery skins={champion.skins} championName={champion.name} />
      )}
    </div>
  );
}

// Sub-component to render Item cards with fallback details
function ItemDisplayCard({
  itemId,
  version,
  itemsMap,
  isCore = false,
}: {
  itemId: string;
  version: string;
  itemsMap: Record<string, any>;
  isCore?: boolean;
}) {
  const itemData = itemsMap[itemId];
  const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
  const name = itemData?.name || `Trang bị #${itemId}`;

  return (
    <div
      title={name}
      className={`group relative flex items-center gap-2 bg-zinc-900/80 p-2 rounded-xl border transition-all ${
        isCore ? 'border-cyan-500/50 shadow-md shadow-cyan-500/10' : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <img src={iconUrl} alt={name} className="w-9 h-9 rounded-lg border border-zinc-700 shrink-0 object-cover" />
      <div className="hidden sm:block">
        <h5 className="text-[11px] font-bold text-zinc-200 line-clamp-1 uppercase max-w-[100px]">{name}</h5>
        {itemData?.gold?.total && (
          <span className="text-[10px] text-amber-400 font-extrabold block">{itemData.gold.total}G</span>
        )}
      </div>
    </div>
  );
}
