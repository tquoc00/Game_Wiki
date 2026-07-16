'use client';

import React from 'react';
import { Sparkles, Zap, Shield, Flame, BookOpen, AlertCircle } from 'lucide-react';
import { RuneTree } from '@/lib/lolMetaHelper';

interface SkillCappedRuneGridProps {
  runes: RuneTree;
  summonerSpells?: { name: string; icon: string }[];
  playstyleTips?: {
    title: string;
    description: string;
    bullets: string[];
  }[];
}

// Clean, reliable DDragon CDN URLs for full 4x3 Rune Grid
const DDRAGON_PERK_BASE = 'https://ddragon.leagueoflegends.com/cdn/img/perk-images';

const RUNE_TREE_SCHEMAS: Record<string, {
  name: string;
  keystones: { name: string; icon: string }[];
  row1: { name: string; icon: string }[];
  row2: { name: string; icon: string }[];
  row3: { name: string; icon: string }[];
}> = {
  'Chuẩn Xác (Precision)': {
    name: 'Precision',
    keystones: [
      { name: 'Sẵn Sàng Tấn Công', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/PressTheAttack/PressTheAttack.png` },
      { name: 'Nhịp Độ Chết Chóc', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LethalTempo/LethalTempoTemp.png` },
      { name: 'Bước Chân Thần Tốc', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/FleetFootwork/FleetFootwork.png` },
      { name: 'Chinh Phục', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Conqueror/Conqueror.png` },
    ],
    row1: [
      { name: 'Tối Cao', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Overheal.png` },
      { name: 'Đắc Thắng', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Triumph.png` },
      { name: 'Hiện Diện Trí Tuệ', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/PresenceOfMind.png` },
    ],
    row2: [
      { name: 'Tốc Độ Đánh', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendAlacrity/LegendAlacrity.png` },
      { name: 'Gia Tốc', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendHaste/LegendHaste.png` },
      { name: 'Hút Máu', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendBloodline/LegendBloodline.png` },
    ],
    row3: [
      { name: 'Nhát Chém Ân Huệ', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/CoupDeGrace/CoupDeGrace.png` },
      { name: 'Chốt Chặn Cuối Cùng', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/LastStand/LastStand.png` },
      { name: 'Đốn Hạ', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/CutDown/CutDown.png` },
    ],
  },
  'Áp Đảo (Domination)': {
    name: 'Domination',
    keystones: [
      { name: 'Sốc Điện', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/Electrocute/Electrocute.png` },
      { name: 'Thú Săn Mồi', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/Predator/Predator.png` },
      { name: 'Thu Thập Hắc Am', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/DarkHarvest/DarkHarvest.png` },
      { name: 'Mưa Kiếm', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/HailOfBlades/HailOfBlades.png` },
    ],
    row1: [
      { name: 'Phát Bắn Đơn Điệu', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/CheapShot/CheapShot.png` },
      { name: 'Tác Động Bất Ngờ', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/SuddenImpact/SuddenImpact.png` },
      { name: 'Vị Máu', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png` },
    ],
    row2: [
      { name: 'Mắt Thây Ma', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/ZombieWard/ZombieWard.png` },
      { name: 'Poro Cảnh Giới', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/GhostPoro/GhostPoro.png` },
      { name: 'Thu Thập Nhãn Cầu', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/EyeballCollection/EyeballCollection.png` },
    ],
    row3: [
      { name: 'Thợ Săn Kho Báu', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/TreasureHunter/TreasureHunter.png` },
      { name: 'Thợ Săn Tàn Nhẫn', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/RelentlessHunter/RelentlessHunter.png` },
      { name: 'Thợ Săn Thấu Suốt', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/IngeniousHunter/IngeniousHunter.png` },
    ],
  },
  'Pháp Thuật (Sorcery)': {
    name: 'Sorcery',
    keystones: [
      { name: 'Triệu Hồi Aery', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/SummonAery/SummonAery.png` },
      { name: 'Thiên Thạch Kỳ Bí', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/ArcaneComet/ArcaneComet.png` },
      { name: 'Tăng Tốc Pha', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/PhaseRush/PhaseRush.png` },
    ],
    row1: [
      { name: 'Quả Cầu Hủy Diệt', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/NullifyingOrb/PetherrosShield.png` },
      { name: 'Dải Băng Năng Lượng', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/ManaflowBand/ManaflowBand.png` },
      { name: 'Áo Phong Choàng', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/NimbusCloak/6361.png` },
    ],
    row2: [
      { name: 'Thăng Tiến Sức Mạnh', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/Transcendence/Transcendence.png` },
      { name: 'Mau Lẹ', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/Celerity/CelerityTemp.png` },
      { name: 'Tập Trung', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png` },
    ],
    row3: [
      { name: 'Thiêu Rụi', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/Scorch/Scorch.png` },
      { name: 'Thủy Thần', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/Waterwalking/Waterwalking.png` },
      { name: 'Cuồng Phong Tích Tụ', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/GatheringStorm/GatheringStorm.png` },
    ],
  },
  'Kiên Định (Resolve)': {
    name: 'Resolve',
    keystones: [
      { name: 'Quyền Năng Bất Diệt', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png` },
      { name: 'Dư Địa Chấn', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/VeteranAftershock/VeteranAftershock.png` },
      { name: 'Hộ Vệ', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/Guardian/Guardian.png` },
    ],
    row1: [
      { name: 'Tàn Phá Hủy Diệt', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/Demolish/Demolish.png` },
      { name: 'Suối Nguồn Sinh Mệnh', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/FontOfLife/FontOfLife.png` },
      { name: 'Nén Đau', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/Conditioning/Conditioning.png` },
    ],
    row2: [
      { name: 'Ngọn Gió Thứ Hai', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/SecondWind/SecondWind.png` },
      { name: 'Giáp Cốt', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/BonePlating/BonePlating.png` },
      { name: 'Kiên Cường', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/Unflinching/Unflinching.png` },
    ],
    row3: [
      { name: 'Lan Truyền', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/Overgrowth/Overgrowth.png` },
      { name: 'Vĩnh Cửu', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/Revitalize/Revitalize.png` },
      { name: 'Tiếp Sức', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/Conditioning/Conditioning.png` },
    ],
  },
  'Cảm Hứng (Inspiration)': {
    name: 'Inspiration',
    keystones: [
      { name: 'Đòn Phủ Đầu', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/FirstStrike/FirstStrike.png` },
      { name: 'Nâng Bước Thần Tốc', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/GlacialAugment/GlacialAugment.png` },
      { name: 'Sách Phép Vạn Năng', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png` },
    ],
    row1: [
      { name: 'Tốc Độ Di Chuyển', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/HextechFlashtraption/HextechFlashtraption.png` },
      { name: 'Bước Chân Kỳ Diệu', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png` },
      { name: 'Dụng Cụ Thị Giác', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CashBack/CashBack.png` },
    ],
    row2: [
      { name: 'Giao Hàng Bánh Quy', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png` },
      { name: 'Thị Giác Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/TimeWarpTonic/TimeWarpTonic.png` },
      { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png` },
    ],
    row3: [
      { name: 'Vận Tốc Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/ApproachVelocity/ApproachVelocity.png` },
      { name: 'Thu Thập Vô Tận', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/JackOfAllTrades/JackOfAllTrades.png` },
    ],
  },
};

export default function SkillCappedRuneGrid({
  runes,
  summonerSpells = [],
}: SkillCappedRuneGridProps) {
  const primarySchema = RUNE_TREE_SCHEMAS[runes.name] || RUNE_TREE_SCHEMAS['Chuẩn Xác (Precision)'];
  const secondarySchema = RUNE_TREE_SCHEMAS[runes.secondaryTreeName] || RUNE_TREE_SCHEMAS['Cảm Hứng (Inspiration)'];

  // Helper check if rune is active in build
  const isPrimaryKeystoneSelected = (name: string) =>
    runes.keystone.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(runes.keystone.name.toLowerCase());

  const isPrimarySlotSelected = (name: string) =>
    runes.primarySlots.some((s) => s.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(s.name.toLowerCase()));

  const isSecondarySlotSelected = (name: string) =>
    runes.secondarySlots.some((s) => s.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(s.name.toLowerCase()));

  // Image fallback handler
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="space-y-6">
      {/* 1. Skill-Capped Interactive Full Matrix Container */}
      <div className="glass-card rounded-2xl border border-zinc-800/80 p-5 bg-zinc-950/95 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400 shrink-0" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              BẢNG NGỌC INTERACTIVE (SKILL-CAPPED FULL MATRIX)
            </h3>
          </div>

          {summonerSpells.length > 0 && (
            <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl shrink-0">
              <AlertCircle size={14} className="text-cyan-400 shrink-0" />
              <span className="text-[11px] font-bold text-zinc-300">
                Gợi ý Đổi <span className="text-amber-400">{summonerSpells[1]?.name || 'Phép bổ trợ'}</span> sang <span className="text-emerald-400">Tẩy Uế</span> vs Đội hình nhiều CC
              </span>
            </div>
          )}
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-1">
          {/* LEFT: PRIMARY TREE */}
          <div className="space-y-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <img src={runes.icon} alt={runes.name} className="w-5 h-5 object-contain shrink-0" onError={handleImgError} />
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider truncate">
                  {runes.name}
                </span>
              </div>
              <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md shrink-0">
                NHÁNH CHÍNH
              </span>
            </div>

            {/* Keystones Row */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block">Ngọc Siêu Cấp</span>
              <div className="grid grid-cols-4 gap-1.5 bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80">
                {primarySchema.keystones.map((item) => {
                  const active = isPrimaryKeystoneSelected(item.name);
                  return (
                    <div key={item.name} className="relative flex flex-col items-center justify-center text-center">
                      <div
                        className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all p-1 ${
                          active
                            ? 'bg-amber-400/20 border-2 border-amber-400 shadow-lg shadow-amber-500/30 scale-105'
                            : 'opacity-30 grayscale filter hover:opacity-75'
                        }`}
                      >
                        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" onError={handleImgError} />
                      </div>
                      {active && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-zinc-950 rounded-full text-[9px] font-black flex items-center justify-center border border-zinc-950 shadow-md">
                          1
                        </span>
                      )}
                      <span className={`text-[9px] font-bold mt-1 line-clamp-1 ${active ? 'text-amber-300 font-extrabold' : 'text-zinc-500'}`}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 1 */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60">
                {primarySchema.row1.map((item) => {
                  const active = isPrimarySlotSelected(item.name);
                  return (
                    <div key={item.name} className="relative flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all p-1 ${
                          active
                            ? 'bg-amber-400/20 border-2 border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                            : 'opacity-25 grayscale filter hover:opacity-60'
                        }`}
                      >
                        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" onError={handleImgError} />
                      </div>
                      {active && (
                        <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-amber-400 text-zinc-950 rounded-full text-[8px] font-black flex items-center justify-center">
                          2
                        </span>
                      )}
                      <span className={`text-[9px] font-medium mt-1 line-clamp-1 ${active ? 'text-amber-200 font-bold' : 'text-zinc-500'}`}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 2 */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60">
                {primarySchema.row2.map((item) => {
                  const active = isPrimarySlotSelected(item.name);
                  return (
                    <div key={item.name} className="relative flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all p-1 ${
                          active
                            ? 'bg-amber-400/20 border-2 border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                            : 'opacity-25 grayscale filter hover:opacity-60'
                        }`}
                      >
                        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" onError={handleImgError} />
                      </div>
                      {active && (
                        <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-amber-400 text-zinc-950 rounded-full text-[8px] font-black flex items-center justify-center">
                          3
                        </span>
                      )}
                      <span className={`text-[9px] font-medium mt-1 line-clamp-1 ${active ? 'text-amber-200 font-bold' : 'text-zinc-500'}`}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 3 */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60">
                {primarySchema.row3.map((item) => {
                  const active = isPrimarySlotSelected(item.name);
                  return (
                    <div key={item.name} className="relative flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all p-1 ${
                          active
                            ? 'bg-amber-400/20 border-2 border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                            : 'opacity-25 grayscale filter hover:opacity-60'
                        }`}
                      >
                        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" onError={handleImgError} />
                      </div>
                      <span className={`text-[9px] font-medium mt-1 line-clamp-1 ${active ? 'text-amber-200 font-bold' : 'text-zinc-500'}`}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: SECONDARY TREE & STAT SHARDS */}
          <div className="space-y-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider truncate">
                {runes.secondaryTreeName}
              </span>
              <span className="text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-md shrink-0">
                NHÁNH PHỤ
              </span>
            </div>

            {/* Secondary Rows */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60">
                {secondarySchema.row1.map((item) => {
                  const active = isSecondarySlotSelected(item.name);
                  return (
                    <div key={item.name} className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all p-1 ${
                          active
                            ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                            : 'opacity-25 grayscale filter'
                        }`}
                      >
                        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" onError={handleImgError} />
                      </div>
                      <span className={`text-[9px] font-medium mt-1 line-clamp-1 ${active ? 'text-cyan-300 font-bold' : 'text-zinc-500'}`}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60">
                {secondarySchema.row2.map((item) => {
                  const active = isSecondarySlotSelected(item.name);
                  return (
                    <div key={item.name} className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all p-1 ${
                          active
                            ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                            : 'opacity-25 grayscale filter'
                        }`}
                      >
                        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" onError={handleImgError} />
                      </div>
                      <span className={`text-[9px] font-medium mt-1 line-clamp-1 ${active ? 'text-cyan-300 font-bold' : 'text-zinc-500'}`}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60">
                {secondarySchema.row3.map((item) => {
                  const active = isSecondarySlotSelected(item.name);
                  return (
                    <div key={item.name} className="flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all p-1 ${
                          active
                            ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                            : 'opacity-25 grayscale filter'
                        }`}
                      >
                        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" onError={handleImgError} />
                      </div>
                      <span className={`text-[9px] font-medium mt-1 line-clamp-1 ${active ? 'text-cyan-300 font-bold' : 'text-zinc-500'}`}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stat Shards Matrix */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block">Mảnh Chỉ Số (Stat Shards)</span>
              <div className="grid grid-cols-3 gap-2 bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800">
                {runes.statShards.map((shard, idx) => (
                  <div key={idx} className="flex items-center justify-center bg-cyan-950/40 border border-cyan-500/30 p-2 rounded-lg text-center">
                    <span className="text-[10px] font-extrabold text-cyan-300 leading-tight">{shard}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Skill-Capped Style Pro Strategy & Playstyle Breakdown */}
      <div className="glass-card rounded-2xl border border-zinc-800/80 p-5 space-y-4 bg-zinc-950/95 shadow-2xl">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800/80 pb-3">
          <BookOpen size={16} className="text-cyan-400" />
          HƯỚNG DẪN THUẬT LỐI CHƠI CHUYÊN NGHIỆP (SKILL-CAPPED STRATEGY GUIDE)
        </h3>

        {/* Keystone Strategy Card */}
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-3">
            <img src={runes.keystone.icon} alt={runes.keystone.name} className="w-10 h-10 p-1 rounded-xl bg-amber-400/20 border border-amber-400 shrink-0 object-contain" onError={handleImgError} />
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Cách Kích Hoạt Ngọc Siêu Cấp</span>
              <h4 className="text-xs font-bold text-white uppercase">{runes.keystone.name}</h4>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {runes.keystone.description} Lựa chọn này cho phép tối đa hóa sát thương trao đổi ở giai đoạn đi đường và tạo lợi thế bùng nổ khi bước vào giao tranh tổng.
          </p>

          <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
            <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
              &rarr; Mẹo Laning Phase (Giai Đoạn Đi Đường):
            </span>
            <p className="text-xs text-zinc-400 pl-4">
              Hãy tập trung tích dồn các đòn đánh thường và kỹ năng liên tiếp để sớm đạt trạng thái tối đa cộng dồn. Đừng ngại trao đổi chiêu thức ngắn khi ngọc đã sẵn sàng.
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              &rarr; Mẹo Teamfight (Giao Tranh Tổng):
            </span>
            <p className="text-xs text-zinc-400 pl-4">
              Giữ vị trí hợp lý để không bị sốc sát thương đầu giao tranh. Ngay khi kích hoạt ngọc siêu cấp, liên tục dồn sát thương vào mục tiêu gần nhất để duy trì điểm hồi phục.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
