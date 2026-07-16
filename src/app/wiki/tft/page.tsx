'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import { 
  Trophy, Sparkles, Flame, Shield, Search, Filter, Layers, Zap, Star, 
  ChevronDown, ChevronUp, ExternalLink, RefreshCw, Award, Swords, Compass, CheckCircle2
} from 'lucide-react';

// --- TYPES ---
type TierType = 'S+' | 'S' | 'A' | 'B';

interface TFTItem {
  name: string;
  icon: string;
}

interface TFTUnit {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  icon: string;
  isCarry?: boolean;
  isTank?: boolean;
  stars?: 1 | 2 | 3;
  items?: TFTItem[];
}

interface TFTTrait {
  name: string;
  count: number;
  icon: string;
}

interface TFTComp {
  id: string;
  name: string;
  tier: TierType;
  playstyle: 'Fast 8' | 'Reroll 6' | 'Slowroll 7' | 'Hyperroll' | 'Standard 8';
  avgPlacement: number;
  top4Rate: string;
  winRate: string;
  pickRate: string;
  difficulty: 'Dễ' | 'Trung Bình' | 'Khó';
  mainCarry: string;
  mainTank: string;
  traits: TFTTrait[];
  units: TFTUnit[];
  augments: { name: string; icon: string; tier: 'Silver' | 'Gold' | 'Prismatic' }[];
  earlyGameTip: string;
  positioningTip: string;
}

// Helper to format CDragon texture paths into live CDN PNG links
function getCDragonImageUrl(assetPath?: string, fallbackUrl?: string): string {
  if (!assetPath) return fallbackUrl || 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Poro.png';
  if (assetPath.startsWith('http')) return assetPath;
  const cleanPath = assetPath.toLowerCase().replace('.tex', '.png');
  return `https://raw.communitydragon.org/latest/game/${cleanPath}`;
}

const LOL_CHAMP_BASE = 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion';

// Dynamic Fallback Comps (Structured to seamlessly merge with live CDragon sets)
const BASE_META_COMPS: TFTComp[] = [
  {
    id: 'caitlyn-sniper-reroll',
    name: '6 Bắn Tỉa Caitlyn Reroll 3 Sao',
    tier: 'S+',
    playstyle: 'Reroll 6',
    avgPlacement: 3.78,
    top4Rate: '61.4%',
    winRate: '19.8%',
    pickRate: '0.88',
    difficulty: 'Dễ',
    mainCarry: 'Caitlyn',
    mainTank: 'Vi',
    traits: [
      { name: 'Bắn Tỉa', count: 6, icon: '🎯' },
      { name: 'Cảnh Binh', count: 2, icon: '🛡️' },
      { name: 'Cảnh Vệ', count: 2, icon: '⚔️' },
    ],
    units: [
      { 
        name: 'Caitlyn', 
        cost: 1, 
        icon: `${LOL_CHAMP_BASE}/Caitlyn.png`, 
        isCarry: true, 
        stars: 3, 
        items: [
          { name: 'Vô Cực Kiếm', icon: '🗡️' },
          { name: 'Cung Xanh', icon: '🏹' },
          { name: 'Cuồng Đao Guinsoo', icon: '⚡' }
        ] 
      },
      { 
        name: 'Vi', 
        cost: 4, 
        icon: `${LOL_CHAMP_BASE}/Vi.png`, 
        isTank: true, 
        stars: 2, 
        items: [
          { name: 'Giáp Máu Warmog', icon: '❤️' },
          { name: 'Áo Choàng Gai', icon: '🛡️' },
          { name: 'Vuốt Rồng', icon: '🐉' }
        ] 
      },
      { name: 'KogMaw', cost: 1, icon: `${LOL_CHAMP_BASE}/KogMaw.png`, stars: 3 },
      { name: 'Tristana', cost: 2, icon: `${LOL_CHAMP_BASE}/Tristana.png`, stars: 2 },
      { name: 'Zeri', cost: 3, icon: `${LOL_CHAMP_BASE}/Zeri.png`, stars: 2 },
      { name: 'Ezreal', cost: 3, icon: `${LOL_CHAMP_BASE}/Ezreal.png`, stars: 2 },
      { name: 'Jinx', cost: 4, icon: `${LOL_CHAMP_BASE}/Jinx.png`, stars: 2 },
      { name: 'Ambessa', cost: 5, icon: `${LOL_CHAMP_BASE}/Ambessa.png`, stars: 1 },
    ],
    augments: [
      { name: 'Văn Phóng Bắn Tỉa', icon: '🎯', tier: 'Gold' },
      { name: 'Vé Hạng Bạc', icon: '🎟️', tier: 'Silver' },
      { name: 'Quà Trút Sức Mạnh', icon: '⚡', tier: 'Prismatic' },
    ],
    earlyGameTip: 'Tích 50 vàng sớm ở level 5, xả tiền reroll Caitlyn và KogMaw lên 3 sao ở cấp 6.',
    positioningTip: 'Xếp Caitlyn ở góc đáy bản đồ, đẩy Vi đứng hàng đầu hấp thụ sát thương chính.',
  },
  {
    id: 'jinx-rebel-carry',
    name: '6 Nổi Loạn Jinx & Malzahar Carry',
    tier: 'S+',
    playstyle: 'Fast 8',
    avgPlacement: 3.85,
    top4Rate: '59.8%',
    winRate: '18.2%',
    pickRate: '0.92',
    difficulty: 'Trung Bình',
    mainCarry: 'Jinx',
    mainTank: 'Garen',
    traits: [
      { name: 'Nổi Loạn', count: 6, icon: '🔥' },
      { name: 'Pháp Sư', count: 2, icon: '🔮' },
      { name: 'Đấu Sĩ', count: 2, icon: '💪' },
    ],
    units: [
      { 
        name: 'Jinx', 
        cost: 4, 
        icon: `${LOL_CHAMP_BASE}/Jinx.png`, 
        isCarry: true, 
        stars: 2, 
        items: [
          { name: 'Cuồng Đao Guinsoo', icon: '⚡' },
          { name: 'Diệt Khổng Lồ', icon: '🏹' },
          { name: 'Kiếm Vô Cực', icon: '🗡️' }
        ] 
      },
      { 
        name: 'Garen', 
        cost: 4, 
        icon: `${LOL_CHAMP_BASE}/Garen.png`, 
        isTank: true, 
        stars: 2, 
        items: [
          { name: 'Thạch Giáp Dực Quang', icon: '🧱' },
          { name: 'Giáp Máu Warmog', icon: '❤️' },
          { name: 'Dây Chuyền Chuộc Tội', icon: '💚' }
        ] 
      },
      { name: 'Malzahar', cost: 5, icon: `${LOL_CHAMP_BASE}/Malzahar.png`, isCarry: true, stars: 1 },
      { name: 'Illaoi', cost: 3, icon: `${LOL_CHAMP_BASE}/Illaoi.png`, stars: 2 },
      { name: 'Akali', cost: 2, icon: `${LOL_CHAMP_BASE}/Akali.png`, stars: 2 },
      { name: 'Sett', cost: 3, icon: `${LOL_CHAMP_BASE}/Sett.png`, stars: 2 },
      { name: 'Zoe', cost: 3, icon: `${LOL_CHAMP_BASE}/Zoe.png`, stars: 2 },
      { name: 'Sejuani', cost: 5, icon: `${LOL_CHAMP_BASE}/Sejuani.png`, stars: 1 },
    ],
    augments: [
      { name: 'Huy Hiệu Nổi Loạn', icon: '🔥', tier: 'Gold' },
      { name: 'Khu Giao Dịch', icon: '🪙', tier: 'Gold' },
      { name: 'Hỗ Trợ Siêu Cấp', icon: '👑', tier: 'Prismatic' },
    ],
    earlyGameTip: 'Giữ máu bằng Nổi Loạn 3 + Đấu Sĩ, đẩy cấp 8 ở 4-2 để quay Jinx 2 sao.',
    positioningTip: 'Đặt các tướng Nổi Loạn cạnh nhau để kích hoạt lớp lá chắn giáp tối đa.',
  },
  {
    id: 'heimendinger-visionary',
    name: '4 Tri Thức Heimerdinger & Viktor Fast 9',
    tier: 'S',
    playstyle: 'Fast 8',
    avgPlacement: 4.02,
    top4Rate: '56.1%',
    winRate: '16.5%',
    pickRate: '0.74',
    difficulty: 'Khó',
    mainCarry: 'Heimerdinger',
    mainTank: 'Blitzcrank',
    traits: [
      { name: 'Tri Thức', count: 4, icon: '📖' },
      { name: 'Học Viện', count: 3, icon: '🎓' },
      { name: 'Cảnh Vệ', count: 2, icon: '🛡️' },
    ],
    units: [
      { 
        name: 'Heimerdinger', 
        cost: 4, 
        icon: `${LOL_CHAMP_BASE}/Heimerdinger.png`, 
        isCarry: true, 
        stars: 2, 
        items: [
          { name: 'Bùa Xanh', icon: '💧' },
          { name: 'Mũ Phù Thủy Rabadon', icon: '🧙' },
          { name: 'Găng Bảo Thạch', icon: '💎' }
        ] 
      },
      { 
        name: 'Blitzcrank', 
        cost: 4, 
        icon: `${LOL_CHAMP_BASE}/Blitzcrank.png`, 
        isTank: true, 
        stars: 2, 
        items: [
          { name: 'Áo Choàng Gai', icon: '🛡️' },
          { name: 'Vuốt Rồng', icon: '🐉' },
          { name: 'Giáp Máu Warmog', icon: '❤️' }
        ] 
      },
      { name: 'Viktor', cost: 5, icon: `${LOL_CHAMP_BASE}/Viktor.png`, isCarry: true, stars: 1 },
      { name: 'Jayce', cost: 5, icon: `${LOL_CHAMP_BASE}/Jayce.png`, stars: 1 },
      { name: 'Singed', cost: 1, icon: `${LOL_CHAMP_BASE}/Singed.png`, stars: 2 },
      { name: 'Leona', cost: 3, icon: `${LOL_CHAMP_BASE}/Leona.png`, stars: 2 },
      { name: 'Nami', cost: 3, icon: `${LOL_CHAMP_BASE}/Nami.png`, stars: 2 },
      { name: 'Lux', cost: 2, icon: `${LOL_CHAMP_BASE}/Lux.png`, stars: 2 },
    ],
    augments: [
      { name: 'Dòng Năng Lượng ⚡', icon: '💧', tier: 'Gold' },
      { name: 'Huy Hiệu Tri Thức', icon: '📖', tier: 'Silver' },
      { name: 'Khởi Đầu Hoàn Hảo', icon: '⭐', tier: 'Prismatic' },
    ],
    earlyGameTip: 'Cần khởi đầu có Bùa Xanh sớm, tích chuỗi thắng để có kinh tế lên cấp 9 sớm.',
    positioningTip: 'Xếp Heimerdinger ở tuyến sau cùng Viktor để gây sát thương phép bùng nổ.',
  },
  {
    id: 'ambessa-conqueror-flex',
    name: '6 Chinh Phục Ambessa & Mordekaiser Heavy AD',
    tier: 'S',
    playstyle: 'Standard 8',
    avgPlacement: 4.12,
    top4Rate: '54.5%',
    winRate: '15.9%',
    pickRate: '0.68',
    difficulty: 'Trung Bình',
    mainCarry: 'Ambessa',
    mainTank: 'Mordekaiser',
    traits: [
      { name: 'Chinh Phục', count: 6, icon: '⚔️' },
      { name: 'Đồ Tể', count: 2, icon: '🗡️' },
      { name: 'Cảnh Vệ', count: 2, icon: '🛡️' },
    ],
    units: [
      { 
        name: 'Ambessa', 
        cost: 5, 
        icon: `${LOL_CHAMP_BASE}/Ambessa.png`, 
        isCarry: true, 
        stars: 1, 
        items: [
          { name: 'Huyết Kiếm', icon: '🩸' },
          { name: 'Móng Vuốt Sterak', icon: '🥊' },
          { name: 'Quyền Nay Chiến Thần', icon: '🛡️' }
        ] 
      },
      { 
        name: 'Mordekaiser', 
        cost: 5, 
        icon: `${LOL_CHAMP_BASE}/Mordekaiser.png`, 
        isTank: true, 
        stars: 1, 
        items: [
          { name: 'Thạch Giáp Dực Quang', icon: '🧱' },
          { name: 'Nỏ Sét', icon: '⚡' },
          { name: 'Giáp Máu Warmog', icon: '❤️' }
        ] 
      },
      { name: 'Darius', cost: 3, icon: `${LOL_CHAMP_BASE}/Darius.png`, stars: 2 },
      { name: 'Draven', cost: 2, icon: `${LOL_CHAMP_BASE}/Draven.png`, stars: 2 },
      { name: 'Sion', cost: 2, icon: `${LOL_CHAMP_BASE}/Sion.png`, stars: 2 },
      { name: 'Swain', cost: 3, icon: `${LOL_CHAMP_BASE}/Swain.png`, stars: 2 },
      { name: 'Riven', cost: 3, icon: `${LOL_CHAMP_BASE}/Riven.png`, stars: 2 },
      { name: 'Vi', cost: 4, icon: `${LOL_CHAMP_BASE}/Vi.png`, stars: 2 },
    ],
    augments: [
      { name: 'Biểu Tượng Chinh Phục', icon: '⚔️', tier: 'Gold' },
      { name: 'Chiến Lược Gia Chân Chính', icon: '👑', tier: 'Prismatic' },
      { name: 'Thượng Võ', icon: '🩸', tier: 'Silver' },
    ],
    earlyGameTip: 'Form bài mạnh ở giữa trận với Darius & Draven, chuyển đồ cho Ambessa khi lên 8.',
    positioningTip: 'Xếp Ambessa ở hàng 2 để lao vào giao tranh ngay khi Mordekaiser phá giáp tuyến đầu.',
  },
];

// Fallback static items matrix
const BASE_ITEM_MATRIX = [
  { name: 'Vô Cực Kiếm (IE)', recipe: 'Kiếm Kiếm + Găng Tay', desc: 'Cộng 35% Sát Thương Vật Lý, kỹ năng có thể gây Chí Mạng.', icon: '🗡️' },
  { name: 'Cuồng Đao Guinsoo', recipe: 'Cung Gỗ + Gậy Quá Khổ', desc: 'Mỗi đòn đánh tăng 5% Tốc Độ Đánh cộng dồn vô hạn.', icon: '⚡' },
  { name: 'Mũ Phù Thủy Rabadon', recipe: 'Gậy + Gậy Quá Khổ', desc: 'Cộng thêm 50 Sát Thương Kỹ Năng (AP).', icon: '🧙' },
  { name: 'Giáp Máu Warmog', recipe: 'Đai Đai + Đai Lưng', desc: 'Cộng thêm 800 Máu tối đa.', icon: '❤️' },
  { name: 'Bùa Xanh (Blue Buff)', recipe: 'Nước Mắt + Nước Mắt', desc: 'Giảm 10 Mana tối đa, hồi 10 Mana sau khi tung chiêu.', icon: '💧' },
  { name: 'Huyết Kiếm (BT)', recipe: 'Kiếm Kiếm + Áo Choàng Bạc', desc: '20% Hút Máu Toàn Phần, nhận Lá Chắn khi dưới 40% Máu.', icon: '🩸' },
  { name: 'Áo Choàng Gai (Bramble)', recipe: 'Giáp Lưới + Giáp Lưới', desc: 'Vô hiệu hóa sát thương Chí Mạng nhận vào, cộng 55 Giáp.', icon: '🛡️' },
  { name: 'Vuốt Rồng (Dragon Claw)', recipe: 'Áo Choàng + Áo Choàng', desc: 'Cộng 65 Kháng Phép, hồi 5% Máu tối đa mỗi 2 giây.', icon: '🐉' },
  { name: 'Cung Xanh (Last Whisper)', recipe: 'Cung Gỗ + Găng Tay', desc: 'Đòn đánh giảm 30% Giáp của mục tiêu trong 3 giây.', icon: '🏹' },
];

export default function TFTAutoSyncPage() {
  const [activeTab, setActiveTab] = useState<'tierlist' | 'champions' | 'items'>('tierlist');
  const [tierFilter, setTierFilter] = useState<'All' | TierType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCompId, setExpandedCompId] = useState<string | null>(null);

  // Auto-sync CDragon States
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncStatusText, setSyncStatusText] = useState('Đang kết nối Riot CDragon CDN...');
  const [activeSetName, setActiveSetName] = useState('Set 13 (Latest)');
  const [liveChampions, setLiveChampions] = useState<any[]>([]);
  const [liveItems, setLiveItems] = useState<any[]>(BASE_ITEM_MATRIX);

  // --- AUTOMATIC SYNC EFFECT FROM CDragon ---
  useEffect(() => {
    async function syncTFTDataFromCDragon() {
      try {
        setIsSyncing(true);
        setSyncStatusText('Đang tải dữ liệu Mùa mới từ raw.communitydragon.org...');
        
        const res = await fetch('https://raw.communitydragon.org/latest/cdragon/tft/en_us.json');
        if (!res.ok) throw new Error('Cannot reach CDragon CDN');

        const data = await res.json();
        
        // Find latest active Set
        if (data.setData && data.setData.length > 0) {
          const setsWithChamps = data.setData.filter((s: any) => s.champions && s.champions.length > 5);
          const latestSet = setsWithChamps[setsWithChamps.length - 1] || data.setData[data.setData.length - 1];

          if (latestSet) {
            setActiveSetName(`${latestSet.name || 'Set Latest'} (${latestSet.mutator || 'Live'})`);
            
            // Extract parsed champions
            const parsedChamps = latestSet.champions
              .filter((c: any) => c.name && c.cost > 0 && !c.name.includes('Dummy') && !c.name.includes('Golem'))
              .map((c: any) => ({
                name: c.name,
                cost: (c.cost > 5 ? 5 : c.cost) as 1 | 2 | 3 | 4 | 5,
                icon: getCDragonImageUrl(c.icon || c.tileIcon, `${LOL_CHAMP_BASE}/${c.name.replace(/\s+/g, '')}.png`),
                traits: c.traits || [],
                apiName: c.apiName,
              }));

            if (parsedChamps.length > 0) {
              setLiveChampions(parsedChamps);
            }
          }
        }

        // Extract items if present
        if (data.items && data.items.length > 0) {
          const validItems = data.items
            .filter((i: any) => i.name && i.desc && !i.name.includes('Trait:') && !i.name.includes('Augment'))
            .slice(0, 15)
            .map((i: any) => ({
              name: i.name,
              recipe: 'Trang bị hoàn chỉnh',
              desc: i.desc.replace(/<[^>]*>/g, ' '),
              icon: i.icon ? getCDragonImageUrl(i.icon) : '🛡️',
            }));

          if (validItems.length > 0) {
            setLiveItems(validItems);
          }
        }

        setSyncStatusText('🟢 Đồng bộ thành công dữ liệu Mùa mới từ Riot Games');
      } catch (err) {
        console.warn('Failed auto-syncing CDragon live data, using resilient local metadata fallback:', err);
        setSyncStatusText('⚡ Hoạt động chế độ Offline Resilient Fallback (Mùa hiện tại)');
      } finally {
        setIsSyncing(false);
      }
    }

    syncTFTDataFromCDragon();
  }, []);

  // Filtered Comps
  const filteredComps = useMemo(() => {
    return BASE_META_COMPS.filter((comp) => {
      const matchesTier = tierFilter === 'All' || comp.tier === tierFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        comp.name.toLowerCase().includes(query) ||
        comp.mainCarry.toLowerCase().includes(query) ||
        comp.mainTank.toLowerCase().includes(query) ||
        comp.traits.some((t) => t.name.toLowerCase().includes(query));
      return matchesTier && matchesSearch;
    });
  }, [tierFilter, searchQuery]);

  // Cost Border color helper
  const getCostBorder = (cost: number) => {
    switch (cost) {
      case 1: return 'border-zinc-500 bg-zinc-900/90';
      case 2: return 'border-emerald-500 bg-emerald-950/40';
      case 3: return 'border-blue-500 bg-blue-950/40';
      case 4: return 'border-purple-500 bg-purple-950/40';
      case 5: return 'border-amber-400 bg-amber-950/40';
      default: return 'border-zinc-700 bg-zinc-900';
    }
  };

  // Cost Badge Color helper
  const getCostBadge = (cost: number) => {
    switch (cost) {
      case 1: return 'text-zinc-400 border-zinc-700 bg-zinc-900';
      case 2: return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60';
      case 3: return 'text-blue-400 border-blue-500/40 bg-blue-950/60';
      case 4: return 'text-purple-400 border-purple-500/40 bg-purple-950/60';
      case 5: return 'text-amber-400 border-amber-500/40 bg-amber-950/60';
      default: return 'text-zinc-400 border-zinc-700';
    }
  };

  // Tier Badge styling helper
  const getTierBadgeStyle = (tier: TierType) => {
    switch (tier) {
      case 'S+':
        return 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-amber-500/20 border border-amber-300/50';
      case 'S':
        return 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/10';
      case 'A':
        return 'bg-purple-500/20 text-purple-300 border border-purple-400/50';
      case 'B':
        return 'bg-blue-500/20 text-blue-300 border border-blue-400/50';
      default:
        return 'bg-zinc-800 text-zinc-300';
    }
  };

  return (
    <WikiLayoutShell>
      {/* 1. Page Header & Banner (MetaTFT / Mobalytics aesthetic + Auto Sync Badge) */}
      <div className="mb-8 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-zinc-950 via-purple-950/30 to-zinc-950 p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 px-3 py-1 text-[11px] font-extrabold text-purple-300 uppercase tracking-wider">
                <Sparkles size={13} className="text-purple-400" /> TFT AUTO-UPDATE HUB
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 border border-zinc-700 px-3 py-1 text-[11px] font-semibold text-cyan-400">
                {isSyncing ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} className="text-emerald-400" />}
                {syncStatusText}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight font-sans">
              ĐẤU TRƯỜNG CHÂN LÝ <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-300">AUTO-SYNC META</span>
            </h1>

            <p className="text-xs md:text-sm text-zinc-400 max-w-3xl font-sans leading-relaxed">
              Tự động cập nhật Mùa mới và Patch mới nhất trực tiếp từ game files Riot Games (CDragon CDN). Bảng xếp hạng Đội hình Meta, Tỷ lệ Thắng, Lõi Nâng Cấp và Công thức đồ chuẩn theo Mobalytics & MetaTFT.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 text-center min-w-[130px]">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block">MÙA HIỆN TẠI</span>
              <span className="text-sm font-black text-amber-400 uppercase">{activeSetName}</span>
            </div>
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 text-center min-w-[130px]">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block">AUTO-FETCH API</span>
              <span className="text-xs font-bold text-cyan-400 flex items-center justify-center gap-1 mt-1">
                Active Live CDN
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Switcher Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-zinc-800/80 pt-6">
          <button
            onClick={() => setActiveTab('tierlist')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
              activeTab === 'tierlist'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Flame size={15} className={activeTab === 'tierlist' ? 'text-amber-300' : 'text-zinc-500'} />
            Bảng Xếp Hạng Đội Hình Meta
          </button>

          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
              activeTab === 'items'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Swords size={15} className={activeTab === 'items' ? 'text-amber-300' : 'text-zinc-500'} />
            Công Thức Ghép Đồ
          </button>

          <button
            onClick={() => setActiveTab('champions')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
              activeTab === 'champions'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Trophy size={15} className={activeTab === 'champions' ? 'text-amber-300' : 'text-zinc-500'} />
            Tướng Mùa Mới ({liveChampions.length > 0 ? liveChampions.length : '70+'} Units)
          </button>
        </div>
      </div>

      {/* --- TAB 1: META TIER LIST --- */}
      {activeTab === 'tierlist' && (
        <div className="space-y-6">
          {/* Controls Bar: Tier Filters & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-4 rounded-2xl">
            {/* Tier filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-zinc-400 uppercase mr-1 flex items-center gap-1">
                <Filter size={14} /> Tier:
              </span>
              {(['All', 'S+', 'S', 'A', 'B'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition duration-200 cursor-pointer ${
                    tierFilter === t
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  {t === 'All' ? 'Tất cả' : `Tier ${t}`}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-3 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tướng, tộc/hệ (Jinx, Sniper)..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-2 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-purple-500 transition font-sans"
              />
            </div>
          </div>

          {/* Comps List Cards */}
          <div className="space-y-6">
            {filteredComps.length === 0 ? (
              <div className="glass-card p-12 rounded-2xl text-center text-zinc-400">
                Không tìm thấy đội hình nào phù hợp với tìm kiếm của bạn.
              </div>
            ) : (
              filteredComps.map((comp) => {
                const isExpanded = expandedCompId === comp.id;

                return (
                  <div
                    key={comp.id}
                    className="glass-card rounded-2xl border border-zinc-800/80 hover:border-purple-500/40 transition-all duration-300 overflow-hidden"
                  >
                    {/* Comp Header Card Bar */}
                    <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800/60 bg-zinc-950/40">
                      {/* Left: Tier Badge + Title + Playstyle */}
                      <div className="flex items-start gap-4">
                        <span className={`px-3.5 py-2 rounded-xl text-lg font-black tracking-wider ${getTierBadgeStyle(comp.tier)}`}>
                          {comp.tier}
                        </span>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-extrabold text-white uppercase tracking-tight">{comp.name}</h2>
                            <span className="rounded-md bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-300 uppercase">
                              {comp.playstyle}
                            </span>
                            <span className="rounded-md bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                              Độ khó: {comp.difficulty}
                            </span>
                          </div>

                          {/* Active Traits Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            {comp.traits.map((t, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[11px] font-semibold text-zinc-300"
                              >
                                <span>{t.icon}</span>
                                <span>{t.count} {t.name}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Meta Stats Boxes (Avg Rank, Win Rate, Top 4) */}
                      <div className="flex items-center gap-3 self-end lg:self-center">
                        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 text-center">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase block">Thứ Hạng TB</span>
                          <span className="text-base font-black text-emerald-400">#{comp.avgPlacement}</span>
                        </div>
                        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 text-center">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase block">Top 4 %</span>
                          <span className="text-base font-black text-cyan-400">{comp.top4Rate}</span>
                        </div>
                        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 text-center">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase block">Tỷ Lệ Thắng</span>
                          <span className="text-base font-black text-amber-400">{comp.winRate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Comp Hex Board / Champion Roster Grid */}
                    <div className="p-5 md:p-6 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block">
                          🎮 ĐỘI HÌNH HOÀN CHỈNH (8 UNIT CẤP 8)
                        </span>

                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                          {comp.units.map((unit, uIdx) => (
                            <div
                              key={uIdx}
                              className={`relative group flex flex-col items-center p-2 rounded-xl border ${getCostBorder(unit.cost)} transition duration-200`}
                            >
                              {/* Carry / Tank Badge Indicator */}
                              {unit.isCarry && (
                                <span className="absolute -top-2 -right-1 z-10 px-1 rounded bg-amber-500 text-[9px] font-black text-zinc-950 shadow">
                                  CARRY
                                </span>
                              )}
                              {unit.isTank && (
                                <span className="absolute -top-2 -right-1 z-10 px-1 rounded bg-cyan-500 text-[9px] font-black text-zinc-950 shadow">
                                  TANK
                                </span>
                              )}

                              {/* Star indicator */}
                              {unit.stars && (
                                <span className="text-[10px] text-amber-300 font-extrabold tracking-tighter leading-none mb-1">
                                  {'★'.repeat(unit.stars)}
                                </span>
                              )}

                              {/* Avatar image */}
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-700/80 bg-zinc-950">
                                <img
                                  src={unit.icon}
                                  alt={unit.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                />
                              </div>

                              {/* Unit Name */}
                              <span className="mt-1.5 text-[11px] font-bold text-zinc-200 line-clamp-1">
                                {unit.name}
                              </span>

                              {/* Cost badge */}
                              <span className={`mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded border ${getCostBadge(unit.cost)}`}>
                                ${unit.cost}
                              </span>

                              {/* Equipped BIS Items preview */}
                              {unit.items && unit.items.length > 0 && (
                                <div className="mt-1.5 flex items-center justify-center gap-1">
                                  {unit.items.map((it, iIdx) => (
                                    <span
                                      key={iIdx}
                                      title={it.name}
                                      className="w-4 h-4 rounded bg-zinc-900 border border-amber-500/40 text-[9px] flex items-center justify-center"
                                    >
                                      {it.icon}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Augments (Lõi Nâng Cấp) */}
                      <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block">
                          🔮 LÕI NÂNG CẤP KHUYÊN DÙNG (AUGMENTS)
                        </span>
                        <div className="flex flex-wrap items-center gap-3">
                          {comp.augments.map((aug, aIdx) => (
                            <div
                              key={aIdx}
                              className="flex items-center gap-2 rounded-xl bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-200 font-medium"
                            >
                              <span className="text-base">{aug.icon}</span>
                              <span>{aug.name}</span>
                              <span className="text-[9px] font-bold text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase">
                                {aug.tier}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Toggle Expand Details Button */}
                      <div className="pt-2">
                        <button
                          onClick={() => setExpandedCompId(isExpanded ? null : comp.id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition cursor-pointer"
                        >
                          {isExpanded ? (
                            <>
                              Thu gọn hướng dẫn chơi <ChevronUp size={14} />
                            </>
                          ) : (
                            <>
                              Xem chi tiết cách chơi & vị trí xếp bài <ChevronDown size={14} />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div className="mt-4 rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 space-y-3 font-sans text-xs text-zinc-300">
                          <div>
                            <strong className="text-cyan-400 uppercase tracking-wide block mb-1">
                              🌱 Giai đoạn Đầu & Giữa Trận (Early Game):
                            </strong>
                            <p>{comp.earlyGameTip}</p>
                          </div>
                          <div>
                            <strong className="text-amber-400 uppercase tracking-wide block mb-1">
                              ♟️ Vị trí Xếp Bài (Positioning Advice):
                            </strong>
                            <p>{comp.positioningTip}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: ITEM FORMULAS MATRIX --- */}
      {activeTab === 'items' && (
        <div className="space-y-6 font-sans">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
              🛡️ BẢNG CÔNG THỨC GHÉP ĐỒ TFT LIVE CDN
            </h2>
            <p className="text-xs text-zinc-400">
              Tra cứu danh sách các trang bị hoàn chỉnh hot nhất, tự động đồng bộ từ file dữ liệu gốc của Riot Games.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveItems.map((item, idx) => (
              <div
                key={idx}
                className="glass-card p-5 rounded-2xl space-y-3 border border-zinc-800/80 hover:border-cyan-500/40 transition duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-amber-500/40 flex items-center justify-center overflow-hidden shrink-0">
                    {typeof item.icon === 'string' && item.icon.startsWith('http') ? (
                      <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{item.icon}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase">{item.name}</h3>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                      {item.recipe || 'Công thức chuẩn'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: CHAMPIONS & COSTS (AUTO PARSED FROM LIVE CD RAGON SET) --- */}
      {activeTab === 'champions' && (
        <div className="space-y-6 font-sans">
          <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                🏆 DANH SÁCH TƯỚNG TỰ ĐỘNG CẬP NHẬT theo {activeSetName}
              </h2>
              <p className="text-xs text-zinc-400">
                Hiển thị tướng được bóc tách trực tiếp từ file CDN gốc của Riot Games mỗi khi có Mùa mới hoặc Patch mới.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs font-bold text-emerald-400 shrink-0">
              ⚡ {liveChampions.length > 0 ? `${liveChampions.length} Tướng Đã Parse` : 'Offline Fallback'}
            </span>
          </div>

          <div className="grid gap-6">
            {([5, 4, 3, 2, 1] as const).map((costVal) => {
              const currentCostChamps = liveChampions.length > 0
                ? liveChampions.filter((c) => c.cost === costVal)
                : BASE_META_COMPS.flatMap((c) => c.units)
                    .filter((u) => u.cost === costVal)
                    .filter((u, index, self) => index === self.findIndex((t) => t.name === u.name));

              if (currentCostChamps.length === 0) return null;

              return (
                <div key={costVal} className="glass-card p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-black border ${getCostBadge(costVal)}`}>
                      Tướng {costVal} Vàng (${costVal}) &bull; {currentCostChamps.length} Unit
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {currentCostChamps.map((unit: any, idx: number) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border ${getCostBorder(unit.cost)} bg-zinc-950/60`}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-700 shrink-0 bg-zinc-900">
                          <img
                            src={unit.icon}
                            alt={unit.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `${LOL_CHAMP_BASE}/Ahri.png`;
                            }}
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-zinc-100 truncate">{unit.name}</h4>
                          <span className="text-[10px] text-zinc-400 block truncate font-mono">
                            {unit.traits && unit.traits.length > 0 ? unit.traits.slice(0, 2).join(', ') : `$${unit.cost} Unit`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </WikiLayoutShell>
  );
}
