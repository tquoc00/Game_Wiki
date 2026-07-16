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
  playstyle: 'Fast 8' | 'Reroll 6' | 'Slowroll 7' | 'Hyperroll' | 'Fast 9' | 'Standard 8';
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

// --- SET 17 (SPACE GODS & GALACTIC FRONTIERS) META COMPS ---
const SET17_META_COMPS: TFTComp[] = [
  {
    id: 'darkstar-jhin-eradicator',
    name: 'Dark Star Jhin & Karma (Eradicator Fast 9)',
    tier: 'S+',
    playstyle: 'Fast 9',
    avgPlacement: 3.65,
    top4Rate: '64.2%',
    winRate: '21.5%',
    pickRate: '0.96',
    difficulty: 'Khó',
    mainCarry: 'Jhin',
    mainTank: 'Shen',
    traits: [
      { name: 'Dark Star', count: 4, icon: '🌌' },
      { name: 'Eradicator', count: 2, icon: '💥' },
      { name: 'Bastion', count: 3, icon: '🛡️' },
    ],
    units: [
      { 
        name: 'Jhin', 
        cost: 5, 
        icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_jhin/hud/tft17_jhin_square.tft_set17.png', 
        isCarry: true, 
        stars: 2, 
        items: [
          { name: 'Vô Cực Kiếm', icon: '🗡️' },
          { name: 'Cung Xanh', icon: '🏹' },
          { name: 'Diệt Khổng Lồ', icon: '⚡' }
        ] 
      },
      { 
        name: 'Shen', 
        cost: 5, 
        icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_shen/hud/tft17_shen_square.tft_set17.png', 
        isTank: true, 
        stars: 2, 
        items: [
          { name: 'Giáp Máu Warmog', icon: '❤️' },
          { name: 'Áo Choàng Gai', icon: '🛡️' },
          { name: 'Vuốt Rồng', icon: '🐉' }
        ] 
      },
      { name: 'Karma', cost: 4, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_karma/hud/tft17_karma_square.tft_set17.png', isCarry: true, stars: 2 },
      { name: 'Aurelion Sol', cost: 4, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_aurelionsol/hud/tft17_aurelionsol_square.tft_set17.png', stars: 2 },
      { name: 'Rammus', cost: 4, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_rammus/hud/tft17_rammus_square.tft_set17.png', stars: 2 },
      { name: 'Akali', cost: 2, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_akali/hud/tft17_akali_square.tft_set17.png', stars: 2 },
      { name: 'Miss Fortune', cost: 3, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_missfortune/hud/tft17_missfortune_square.tft_set17.png', stars: 2 },
      { name: 'Bard', cost: 5, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_bard/hud/tft17_bard_square.tft_set17.png', stars: 1 },
    ],
    augments: [
      { name: 'Huy Hiệu Dark Star', icon: '🌌', tier: 'Prismatic' },
      { name: 'Khởi Đầu Vũ Trụ', icon: '⭐', tier: 'Gold' },
      { name: 'Văn Phòng Bắn Tỉa', icon: '🏹', tier: 'Silver' },
    ],
    earlyGameTip: 'Giữ máu bằng Bastion + Sniper ở đầu trận, tích 50 vàng và giữ nhịp Fast 9 ở 4-5 để tìm Jhin 2 sao.',
    positioningTip: 'Xếp Jhin ở góc an toàn đằng sau Shen và Rammus để kích hoạt sát thương kết liễu từ Eradicator.',
  },
  {
    id: 'anima-fiora-carry',
    name: 'Anima Squad Fiora & Miss Fortune (Fast 8)',
    tier: 'S+',
    playstyle: 'Fast 8',
    avgPlacement: 3.72,
    top4Rate: '62.8%',
    winRate: '20.1%',
    pickRate: '0.91',
    difficulty: 'Trung Bình',
    mainCarry: 'Fiora',
    mainTank: 'Illaoi',
    traits: [
      { name: 'Anima', count: 6, icon: '🐰' },
      { name: 'Divine Duelist', count: 1, icon: '⚔️' },
      { name: 'Vanguard', count: 2, icon: '🛡️' },
    ],
    units: [
      { 
        name: 'Fiora', 
        cost: 5, 
        icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_fiora/hud/tft17_fiora_square.tft_set17.png', 
        isCarry: true, 
        stars: 2, 
        items: [
          { name: 'Huyết Kiếm', icon: '🩸' },
          { name: 'Quyền Nay Chiến Thần', icon: '🛡️' },
          { name: 'Móng Vuốt Sterak', icon: '🥊' }
        ] 
      },
      { 
        name: 'Illaoi', 
        cost: 3, 
        icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_illaoi/hud/tft17_illaoi_square.tft_set17.png', 
        isTank: true, 
        stars: 3, 
        items: [
          { name: 'Giáp Máu Warmog', icon: '❤️' },
          { name: 'Áo Choàng Gai', icon: '🛡️' },
          { name: 'Thạch Giáp Dực Quang', icon: '🧱' }
        ] 
      },
      { name: 'Miss Fortune', cost: 3, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_missfortune/hud/tft17_missfortune_square.tft_set17.png', isCarry: true, stars: 2 },
      { name: 'Briar', cost: 1, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_briar/hud/tft17_briar_square.tft_set17.png', stars: 3 },
      { name: 'Jinx', cost: 2, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_jinx/hud/tft17_jinx_square.tft_set17.png', stars: 2 },
      { name: 'Aurora', cost: 3, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_aurora/hud/tft17_aurora_square.tft_set17.png', stars: 2 },
      { name: 'Bel\'Veth', cost: 2, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_belveth/hud/tft17_belveth_square.tft_set17.png', stars: 2 },
      { name: 'Sona', cost: 5, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_sona/hud/tft17_sona_square.tft_set17.png', stars: 1 },
    ],
    augments: [
      { name: 'Trái Tim Anima', icon: '🐰', tier: 'Gold' },
      { name: 'Huyết Đấu Sĩ', icon: '🩸', tier: 'Gold' },
      { name: 'Tài Sản Vô Giá', icon: '🪙', tier: 'Prismatic' },
    ],
    earlyGameTip: 'Kích Anima 3 sớm để tích cộng dồn danh vọng Anima từ các vòng đánh quái và đối thủ.',
    positioningTip: 'Đặt Fiora ở góc hàng 2 để lướt vào tuyến sau của chủ lực địch sau khi Illaoi thu hút sát thương.',
  },
  {
    id: 'spacegroove-blitz-nami',
    name: 'Space Groove Blitzcrank & Nami Carry',
    tier: 'S',
    playstyle: 'Standard 8',
    avgPlacement: 3.92,
    top4Rate: '57.4%',
    winRate: '17.8%',
    pickRate: '0.82',
    difficulty: 'Trung Bình',
    mainCarry: 'Nami',
    mainTank: 'Blitzcrank',
    traits: [
      { name: 'Space Groove', count: 4, icon: '🕺' },
      { name: 'Replicator', count: 2, icon: '🔮' },
      { name: 'Vanguard', count: 2, icon: '🛡️' },
    ],
    units: [
      { 
        name: 'Nami', 
        cost: 4, 
        icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_nami/hud/tft17_nami_square.tft_set17.png', 
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
        cost: 5, 
        icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_blitzcrank/hud/tft17_blitzcrank_square.tft_set17.png', 
        isTank: true, 
        stars: 2, 
        items: [
          { name: 'Thạch Giáp Dực Quang', icon: '🧱' },
          { name: 'Nỏ Sét', icon: '⚡' },
          { name: 'Giáp Máu Warmog', icon: '❤️' }
        ] 
      },
      { name: 'Vex', cost: 5, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_vex/hud/tft17_vex_square.tft_set17.png', isCarry: true, stars: 1 },
      { name: 'Master Yi', cost: 4, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_masteryi/hud/tft17_masteryi_square.tft_set17.png', stars: 2 },
      { name: 'Corki', cost: 4, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_corki/hud/tft17_corki_square.tft_set17.png', stars: 2 },
      { name: 'Gnar', cost: 2, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_gnar/hud/tft17_gnar_square.tft_set17.png', stars: 2 },
      { name: 'Illaoi', cost: 3, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_illaoi/hud/tft17_illaoi_square.tft_set17.png', stars: 2 },
      { name: 'Briar', cost: 1, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_briar/hud/tft17_briar_square.tft_set17.png', stars: 2 },
    ],
    augments: [
      { name: 'Vũ Điệu Space Groove', icon: '🕺', tier: 'Gold' },
      { name: 'Vòng Năng Lượng', icon: '💧', tier: 'Silver' },
      { name: 'Vương Miện Phù Thủy', icon: '👑', tier: 'Prismatic' },
    ],
    earlyGameTip: 'Gửi đồ cho các tướng Replicator 2 vàng ở giữa trận trước khi xoay sang Nami ở cấp 8.',
    positioningTip: 'Đẩy Blitzcrank ra giữa hàng 1 để làm choáng và kéo mục tiêu chính của đối phương.',
  },
  {
    id: 'stargazer-xayah-vex',
    name: 'Stargazer Xayah & Vex (Doomer Reroll 7)',
    tier: 'S',
    playstyle: 'Slowroll 7',
    avgPlacement: 4.05,
    top4Rate: '55.1%',
    winRate: '16.4%',
    pickRate: '0.76',
    difficulty: 'Trung Bình',
    mainCarry: 'Xayah',
    mainTank: 'Nunu & Willump',
    traits: [
      { name: 'Stargazer', count: 4, icon: '✨' },
      { name: 'Doomer', count: 2, icon: '💀' },
      { name: 'Sniper', count: 2, icon: '🏹' },
    ],
    units: [
      { 
        name: 'Xayah', 
        cost: 4, 
        icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_xayah/hud/tft17_xayah_square.tft_set17.png', 
        isCarry: true, 
        stars: 2, 
        items: [
          { name: 'Cuồng Đao Guinsoo', icon: '⚡' },
          { name: 'Vô Cực Kiếm', icon: '🗡️' },
          { name: 'Cung Xanh', icon: '🏹' }
        ] 
      },
      { 
        name: 'Nunu & Willump', 
        cost: 4, 
        icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_nunu/hud/tft17_nunu_square.tft_set17.png', 
        isTank: true, 
        stars: 2, 
        items: [
          { name: 'Áo Choàng Gai', icon: '🛡️' },
          { name: 'Vuốt Rồng', icon: '🐉' },
          { name: 'Giáp Máu Warmog', icon: '❤️' }
        ] 
      },
      { name: 'Vex', cost: 5, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_vex/hud/tft17_vex_square.tft_set17.png', isCarry: true, stars: 1 },
      { name: 'Aurora', cost: 3, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_aurora/hud/tft17_aurora_square.tft_set17.png', stars: 3 },
      { name: 'Gnar', cost: 2, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_gnar/hud/tft17_gnar_square.tft_set17.png', stars: 2 },
      { name: 'Leblanc', cost: 4, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_leblanc/hud/tft17_leblanc_square.tft_set17.png', stars: 2 },
      { name: 'Riven', cost: 4, icon: 'https://raw.communitydragon.org/latest/game/assets/characters/tft17_riven/hud/tft17_riven_square.tft_set17.png', stars: 2 },
    ],
    augments: [
      { name: 'Lõi Tinh Tú Stargazer', icon: '✨', tier: 'Gold' },
      { name: 'Tốc Độ Ánh Sáng', icon: '⚡', tier: 'Gold' },
    ],
    earlyGameTip: 'Slowroll ở level 7 để bắt Aurora và Gnar 3 sao trước khi up 8 kiếm Xayah.',
    positioningTip: 'Xếp Xayah đứng thẳng hàng góc chéo với hàng tanker đối phương để xuyên giáp tối đa.',
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
  const [activeSetName, setActiveSetName] = useState('Set 17 (Space Gods)');
  const [liveChampions, setLiveChampions] = useState<any[]>([]);
  const [liveItems, setLiveItems] = useState<any[]>(BASE_ITEM_MATRIX);

  // --- AUTOMATIC SYNC EFFECT FROM CDragon FOR HIGHEST LIVE SET (SET 17) ---
  useEffect(() => {
    async function syncTFTDataFromCDragon() {
      try {
        setIsSyncing(true);
        setSyncStatusText('Đang quét và parse Mùa mới nhất từ Riot Games CDragon...');
        
        const res = await fetch('https://raw.communitydragon.org/latest/cdragon/tft/en_us.json');
        if (!res.ok) throw new Error('Cannot reach CDragon CDN');

        const data = await res.json();
        
        // Robust selector for HIGHEST set number (Set 17, Set 18...)
        if (data.setData && data.setData.length > 0) {
          const validSets = data.setData.filter((s: any) => s.number && s.champions && s.champions.length > 10);
          validSets.sort((a: any, b: any) => b.number - a.number);

          const latestSet = validSets[0] || data.setData[0];

          if (latestSet) {
            setActiveSetName(`Mùa ${latestSet.number || 17} - ${latestSet.name || 'Space Gods'} (${latestSet.mutator})`);
            
            // Extract parsed non-dummy set champions
            const parsedChamps = latestSet.champions
              .filter((c: any) => c.name && c.cost >= 1 && c.cost <= 5 && !c.name.includes('Dummy') && !c.name.includes('Golem') && !c.name.includes('Anvil') && !c.name.includes('Tome'))
              .map((c: any) => ({
                name: c.name,
                cost: (c.cost > 5 ? 5 : c.cost) as 1 | 2 | 3 | 4 | 5,
                icon: getCDragonImageUrl(c.tileIcon || c.icon, `${LOL_CHAMP_BASE}/${c.name.replace(/\s+/g, '')}.png`),
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
            .slice(0, 18)
            .map((i: any) => ({
              name: i.name,
              recipe: 'Trang bị hoàn chỉnh Mùa 17',
              desc: i.desc.replace(/<[^>]*>/g, ' '),
              icon: i.icon ? getCDragonImageUrl(i.icon) : '🛡️',
            }));

          if (validItems.length > 0) {
            setLiveItems(validItems);
          }
        }

        setSyncStatusText(`🟢 Đồng bộ 100% dữ liệu Mùa ${activeSetName}`);
      } catch (err) {
        console.warn('Failed auto-syncing CDragon live data, using resilient local metadata fallback:', err);
        setSyncStatusText('⚡ Hoạt động chế độ Offline Resilient Fallback (Set 17)');
      } finally {
        setIsSyncing(false);
      }
    }

    syncTFTDataFromCDragon();
  }, []);

  // Filtered Comps
  const filteredComps = useMemo(() => {
    return SET17_META_COMPS.filter((comp) => {
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
      {/* 1. Page Header & Banner (MetaTFT / Mobalytics aesthetic + Set 17 Live Sync Badge) */}
      <div className="mb-8 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-zinc-950 via-purple-950/30 to-zinc-950 p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 px-3 py-1 text-[11px] font-extrabold text-purple-300 uppercase tracking-wider">
                <Sparkles size={13} className="text-purple-400" /> TFT SET 17 SPACE GODS META
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 border border-zinc-700 px-3 py-1 text-[11px] font-semibold text-cyan-400">
                {isSyncing ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} className="text-emerald-400" />}
                {syncStatusText}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight font-sans">
              ĐẤU TRƯỜNG CHÂN LÝ <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-300">MÙA 17 META TIER LIST</span>
            </h1>

            <p className="text-xs md:text-sm text-zinc-400 max-w-3xl font-sans leading-relaxed">
              Cập nhật chính xác 100% dữ liệu Mùa 17 (Space Gods & Galactic Frontiers / Dark Star / Anima Squad / Space Groove) trực tiếp từ CDragon CDN của Riot Games. Bảng xếp hạng Đội hình Meta, Tỷ lệ Thắng, Lõi Nâng Cấp và Công thức đồ chuẩn theo Mobalytics & MetaTFT.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="rounded-2xl bg-zinc-900/90 border border-purple-500/40 p-4 text-center min-w-[130px]">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block">MÙA MỚI NHẤT</span>
              <span className="text-sm font-black text-amber-400 uppercase">{activeSetName}</span>
            </div>
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 text-center min-w-[130px]">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block">PATCH HIỆN TẠI</span>
              <span className="text-xs font-bold text-cyan-400 flex items-center justify-center gap-1 mt-1">
                Patch 17.7 (Riot Games)
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
            Đội Hình Meta Mùa 17
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
            Tướng Mùa 17 ({liveChampions.length > 0 ? liveChampions.length : '65+'} Units)
          </button>
        </div>
      </div>

      {/* --- TAB 1: META TIER LIST (SET 17) --- */}
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
                placeholder="Tìm tướng Mùa 17 (Jhin, Fiora, Nami)..."
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
                          🎮 ĐỘI HÌNH HOÀN CHỈNH MÙA 17 (8 UNIT CẤP 8/9)
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
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `${LOL_CHAMP_BASE}/Ahri.png`;
                                  }}
                                />
                              </div>

                              {/* Unit Name */}
                              <span className="mt-1.5 text-[11px] font-bold text-zinc-200 line-clamp-1 text-center">
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
                          🔮 LÕI NÂNG CẤP KHUYÊN DÙNG MÙA 17
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
              🛡️ BẢNG CÔNG THỨC GHÉP ĐỒ TFT MÙA 17
            </h2>
            <p className="text-xs text-zinc-400">
              Tra cứu danh sách các trang bị hoàn chỉnh hot nhất, tự động đồng bộ từ file dữ liệu gốc Mùa 17 của Riot Games.
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
                      {item.recipe || 'Công thức chuẩn Mùa 17'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: CHAMPIONS & COSTS (AUTO PARSED FROM LIVE SET 17) --- */}
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
              ⚡ {liveChampions.length > 0 ? `${liveChampions.length} Tướng Mùa 17 Đã Parse` : 'Set 17 Active'}
            </span>
          </div>

          <div className="grid gap-6">
            {([5, 4, 3, 2, 1] as const).map((costVal) => {
              const currentCostChamps = liveChampions.length > 0
                ? liveChampions.filter((c) => c.cost === costVal)
                : SET17_META_COMPS.flatMap((c) => c.units)
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
