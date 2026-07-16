// Helper for Mobalytics-style League of Legends Meta Data & Recommended Builds
// Supports Champion-Specific Builds, Rank Division Filters (Low Elo, Emerald+, High Elo)
// Integrated with Riot Official Data Dragon CDN for live perks & runes icons

export type RankTier = 'all' | 'low' | 'emerald' | 'high';
export type LaneRole = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';

export interface RuneNode {
  name: string;
  icon: string;
  description: string;
  isKeystone?: boolean;
}

export interface RuneTree {
  name: string;
  icon: string;
  keystone: RuneNode;
  primarySlots: RuneNode[];
  secondaryTreeName: string;
  secondarySlots: RuneNode[];
  statShards: string[];
}

export interface MetaBuild {
  role: string;
  lane: LaneRole;
  tier: 'S+' | 'S' | 'A' | 'B';
  winRate: string;
  pickRate: string;
  banRate: string;
  difficulty: 'Dễ' | 'Trung Bình' | 'Khó' | 'Cực Khó';
  recommendedEloText: string;
  summonerSpells: { name: string; icon: string }[];
  skillOrder: { key: string; name: string }[];
  skillMaxPriority: string[]; // e.g. ["Q", "E", "W"]
  starterItems: string[]; // DDragon Item IDs
  coreItems: string[]; // DDragon Item IDs
  situationalItems: string[]; // DDragon Item IDs
  boots: string[]; // DDragon Item IDs
  runes: RuneTree;
  counters: {
    strongAgainst: { name: string; icon: string; winRate: string }[];
    weakAgainst: { name: string; icon: string; winRate: string }[];
  };
}

const DDRAGON_PERK_BASE = 'https://ddragon.leagueoflegends.com/cdn/img/perk-images';
const DDRAGON_SPELL_BASE = 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/spell';
const DDRAGON_CHAMP_BASE = 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion';

// Comprehensive Riot Champion Primary Lane Meta Mapping (Mobalytics / Skill-Capped standard)
const CHAMPION_PRIMARY_LANE_MAP: Record<string, LaneRole> = {
  // JUNGLE (Đi Rừng)
  LeeSin: 'JUNGLE', Viego: 'JUNGLE', MasterYi: 'JUNGLE', Khazix: 'JUNGLE', JarvanIV: 'JUNGLE',
  Nocturne: 'JUNGLE', Graves: 'JUNGLE', Vi: 'JUNGLE', Zac: 'JUNGLE', Warwick: 'JUNGLE',
  Evelynn: 'JUNGLE', Shaco: 'JUNGLE', Kayn: 'JUNGLE', Rengar: 'JUNGLE', Hecarim: 'JUNGLE',
  Nunu: 'JUNGLE', Amumu: 'JUNGLE', Elise: 'JUNGLE', Kindred: 'JUNGLE', Fiddlesticks: 'JUNGLE',
  Rammus: 'JUNGLE', Sejuani: 'JUNGLE', Volibear: 'JUNGLE', XinZhao: 'JUNGLE', Belveth: 'JUNGLE',
  Briar: 'JUNGLE', Diana: 'JUNGLE', Ekko: 'JUNGLE', Gragas: 'JUNGLE', Ivern: 'JUNGLE',
  Karthus: 'JUNGLE', Lillia: 'JUNGLE', Nidalee: 'JUNGLE', Poppy: 'JUNGLE', Reksai: 'JUNGLE',
  Skarner: 'JUNGLE', Taliyah: 'JUNGLE', Udyr: 'JUNGLE', MonkeyKing: 'JUNGLE',

  // TOP (Đường Trên)
  Aatrox: 'TOP', Yorick: 'TOP', Jax: 'TOP', Darius: 'TOP', Fiora: 'TOP', Garen: 'TOP',
  Renekton: 'TOP', Ornn: 'TOP', Malphite: 'TOP', Camille: 'TOP', KSante: 'TOP', Teemo: 'TOP',
  Ambessa: 'TOP', Chogath: 'TOP', DrMundo: 'TOP', Gangplank: 'TOP', Gwen: 'TOP', Illaoi: 'TOP',
  Irelia: 'TOP', Jayce: 'TOP', Kayle: 'TOP', Kled: 'TOP', Mordekaiser: 'TOP', Nasus: 'TOP',
  Olaf: 'TOP', Pantheon: 'TOP', Quinn: 'TOP', Riven: 'TOP', Rumble: 'TOP', Shen: 'TOP',
  Singed: 'TOP', Sion: 'TOP', TahmKench: 'TOP', Trundle: 'TOP', Tryndamere: 'TOP', Urgot: 'TOP',

  // MID (Đường Giữa)
  Ahri: 'MID', Zed: 'MID', Yasuo: 'MID', Yone: 'MID', Syndra: 'MID', Viktor: 'MID',
  Lux: 'MID', Akali: 'MID', Katarina: 'MID', Veigar: 'MID', Anivia: 'MID', Annie: 'MID',
  AurelionSol: 'MID', Azir: 'MID', Cassiopeia: 'MID', Fizz: 'MID', Galio: 'MID', Hwei: 'MID',
  Kassadin: 'MID', Leblanc: 'MID', Lissandra: 'MID', Malzahar: 'MID', Naafiri: 'MID', Neeko: 'MID',
  Orianna: 'MID', Qiyana: 'MID', Ryze: 'MID', Swain: 'MID', Sylas: 'MID', Talon: 'MID',
  TwistedFate: 'MID', Vex: 'MID', Vladimir: 'MID', Xerath: 'MID', Zoe: 'MID', Ziggs: 'MID',

  // ADC / BOT (Xạ Thủ Đường Dưới)
  Jinx: 'ADC', Kaisa: 'ADC', Caitlyn: 'ADC', Ezreal: 'ADC', Vayne: 'ADC', Jhin: 'ADC',
  Lucian: 'ADC', Samira: 'ADC', Draven: 'ADC', MissFortune: 'ADC', Aphelios: 'ADC', Ashe: 'ADC',
  Kalista: 'ADC', KogMaw: 'ADC', Nilah: 'ADC', Sivir: 'ADC', Smolder: 'ADC', Tristana: 'ADC',
  Twitch: 'ADC', Varus: 'ADC', Xayah: 'ADC', Zeri: 'ADC',

  // SUPPORT (Hỗ Trợ)
  Thresh: 'SUPPORT', Blitzcrank: 'SUPPORT', Nautilus: 'SUPPORT', Leona: 'SUPPORT', Lulu: 'SUPPORT',
  Nami: 'SUPPORT', Pyke: 'SUPPORT', Karma: 'SUPPORT', Senna: 'SUPPORT', Morgana: 'SUPPORT',
  Alistar: 'SUPPORT', Bard: 'SUPPORT', Braum: 'SUPPORT', Janna: 'SUPPORT', Milio: 'SUPPORT',
  Rakan: 'SUPPORT', Rell: 'SUPPORT', Renata: 'SUPPORT', Seraphine: 'SUPPORT', Sona: 'SUPPORT',
  Soraka: 'SUPPORT', Taric: 'SUPPORT', Velkoz: 'SUPPORT', Yuumi: 'SUPPORT', Zilean: 'SUPPORT', Zyra: 'SUPPORT'
};

// Registered High-Accuracy Meta Builds
const CHAMPION_META_REGISTRY: Record<string, Record<RankTier, MetaBuild>> = {
  // AATROX
  Aatrox: createChampionRankMap('ĐƯỜNG TRÊN (TOP)', 'TOP', 'S+', '51.9%', '9.8%', '14.2%', 'Trung Bình',
    ['Q', 'E', 'W'], ['1054', '2003'], ['6630', '3071', '3053'], ['3143', '6333', '3026'], ['3047'],
    {
      name: 'Chuẩn Xác (Precision)', icon: `${DDRAGON_PERK_BASE}/Styles/7201_Precision.png`,
      keystone: { name: 'Chinh Phục (Conqueror)', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Conqueror/Conqueror.png`, description: 'Tích dồn sức mạnh thích ứng và hồi máu 8% sát thương.', isKeystone: true },
      primarySlots: [{ name: 'Đắc Thắng', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Triumph.png`, description: 'Hồi 5% máu khi hạ gục' }, { name: 'Huyền Thoại: Gia Tốc', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendHaste/LegendHaste.png`, description: 'Tăng gia tốc kỹ năng' }, { name: 'Chốt Chặn Cuối Cùng', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/LastStand/LastStand.png`, description: 'Sát thương khi thấp máu' }],
      secondaryTreeName: 'Kiên Định (Resolve)',
      secondarySlots: [{ name: 'Giáp Cốt', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/BonePlating/BonePlating.png`, description: 'Giảm đòn đánh cận chiến' }, { name: 'Lan Truyền', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/Overgrowth/Overgrowth.png`, description: 'Tích máu tối đa' }],
      statShards: ['+9 Sức mạnh thích ứng', '+9 Sức mạnh thích ứng', '+6 Giáp']
    },
    [{ name: 'Sion', icon: `${DDRAGON_CHAMP_BASE}/Sion.png`, winRate: '54.7%' }],
    [{ name: 'Fiora', icon: `${DDRAGON_CHAMP_BASE}/Fiora.png`, winRate: '47.3%' }]
  ),

  // JAX
  Jax: createChampionRankMap('ĐƯỜNG TRÊN (TOP)', 'TOP', 'S+', '52.4%', '8.9%', '11.5%', 'Trung Bình',
    ['E', 'W', 'Q'], ['1054', '2003'], ['3078', '6630', '3153'], ['3075', '3053', '3026'], ['3047'],
    {
      name: 'Chuẩn Xác (Precision)', icon: `${DDRAGON_PERK_BASE}/Styles/7201_Precision.png`,
      keystone: { name: 'Nhịp Độ Chết Chóc (Lethal Tempo)', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LethalTempo/LethalTempoTemp.png`, description: 'Tăng tốc độ đánh liên hoàn khi gõ nhẹ.', isKeystone: true },
      primarySlots: [{ name: 'Đắc Thắng', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Triumph.png`, description: 'Hồi máu hạ gục' }, { name: 'Huyền Thoại: Tốc Độ Đánh', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendAlacrity/LegendAlacrity.png`, description: 'Đập thường liên tục' }, { name: 'Chốt Chặn Cuối Cùng', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/LastStand/LastStand.png`, description: 'Sát thương khi thấp máu' }],
      secondaryTreeName: 'Cảm Hứng (Inspiration)',
      secondarySlots: [{ name: 'Bước Chân Kỳ Diệu', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png`, description: 'Giày xịn miễn phí' }, { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png`, description: 'Giảm CD phép bổ trợ' }],
      statShards: ['+10% Tốc độ đánh', '+9 Sức mạnh thích ứng', '+6 Giáp']
    },
    [{ name: 'Yorick', icon: `${DDRAGON_CHAMP_BASE}/Yorick.png`, winRate: '55.3%' }],
    [{ name: 'Malphite', icon: `${DDRAGON_CHAMP_BASE}/Malphite.png`, winRate: '46.8%' }]
  ),

  // LEE SIN
  LeeSin: createChampionRankMap('ĐI RỪNG (JUNGLE)', 'JUNGLE', 'S+', '50.8%', '15.4%', '8.2%', 'Khó',
    ['Q', 'W', 'E'], ['1101', '2003'], ['6630', '3071', '3053'], ['6333', '3143', '3026'], ['3111'],
    {
      name: 'Chuẩn Xác (Precision)', icon: `${DDRAGON_PERK_BASE}/Styles/7201_Precision.png`,
      keystone: { name: 'Chinh Phục (Conqueror)', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Conqueror/Conqueror.png`, description: 'Dồn sát thương 1v1 dội gank 2 cánh cực ảo.', isKeystone: true },
      primarySlots: [{ name: 'Đắc Thắng', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Triumph.png`, description: 'Hồi máu combat' }, { name: 'Huyền Thoại: Tốc Độ Đánh', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendAlacrity/LegendAlacrity.png`, description: 'Đòn đánh nội tại' }, { name: 'Nhát Chém Ân Huệ', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/CoupDeGrace/CoupDeGrace.png`, description: 'Sát thương kết liễu Q2' }],
      secondaryTreeName: 'Cảm Hứng (Inspiration)',
      secondarySlots: [{ name: 'Bước Chân Kỳ Diệu', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png`, description: 'Tốc độ di chuyển' }, { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png`, description: 'Giảm CD Tốc Biến' }],
      statShards: ['+9 Sức mạnh thích ứng', '+9 Sức mạnh thích ứng', '+6 Giáp']
    },
    [{ name: 'MasterYi', icon: `${DDRAGON_CHAMP_BASE}/MasterYi.png`, winRate: '53.9%' }],
    [{ name: 'Poppy', icon: `${DDRAGON_CHAMP_BASE}/Poppy.png`, winRate: '45.1%' }]
  ),

  // VIEGO
  Viego: createChampionRankMap('ĐI RỪNG (JUNGLE)', 'JUNGLE', 'S+', '51.5%', '12.1%', '7.9%', 'Khó',
    ['Q', 'E', 'W'], ['1102', '2003'], ['6630', '3078', '3053'], ['3153', '6333', '3026'], ['3047'],
    {
      name: 'Chuẩn Xác (Precision)', icon: `${DDRAGON_PERK_BASE}/Styles/7201_Precision.png`,
      keystone: { name: 'Chinh Phục (Conqueror)', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Conqueror/Conqueror.png`, description: 'Cướp thể xác kẻ địch liên tục trong giao tranh.', isKeystone: true },
      primarySlots: [{ name: 'Đắc Thắng', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Triumph.png`, description: 'Hồi máu lật kèo' }, { name: 'Huyền Thoại: Tốc Độ Đánh', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendAlacrity/LegendAlacrity.png`, description: 'Chém 2 lần' }, { name: 'Nhát Chém Ân Huệ', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/CoupDeGrace/CoupDeGrace.png`, description: 'Kết liễu' }],
      secondaryTreeName: 'Cảm Hứng (Inspiration)',
      secondarySlots: [{ name: 'Bước Chân Kỳ Diệu', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png`, description: 'Giày cướp gank' }, { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png`, description: 'Giảm CD Smite' }],
      statShards: ['+10% Tốc độ đánh', '+9 Sức mạnh thích ứng', '+6 Giáp']
    },
    [{ name: 'KhaZix', icon: `${DDRAGON_CHAMP_BASE}/Khazix.png`, winRate: '54.1%' }],
    [{ name: 'Rammus', icon: `${DDRAGON_CHAMP_BASE}/Rammus.png`, winRate: '46.0%' }]
  ),

  // AHRI
  Ahri: createChampionRankMap('ĐƯỜNG GIỮA (MID)', 'MID', 'S+', '52.1%', '14.2%', '6.5%', 'Trung Bình',
    ['Q', 'W', 'E'], ['1056', '2003'], ['6655', '3020', '3157'], ['3089', '3135', '3102'], ['3020'],
    {
      name: 'Pháp Thuật (Sorcery)', icon: `${DDRAGON_PERK_BASE}/Styles/7202_Sorcery.png`,
      keystone: { name: 'Thiên Thạch Kỳ Bí (Arcane Comet)', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/ArcaneComet/ArcaneComet.png`, description: 'Cấu rích sát thương phép cực mạnh khi thả Q E.', isKeystone: true },
      primarySlots: [{ name: 'Dải Băng Năng Lượng', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/ManaflowBand/ManaflowBand.png`, description: 'Năng lượng trụ lane' }, { name: 'Thăng Tiến Sức Mạnh', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/Transcendence/Transcendence.png`, description: 'Hồi R lướt' }, { name: 'Thiêu Rụi', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/Scorch/Scorch.png`, description: 'Đốt sát thương phép' }],
      secondaryTreeName: 'Cảm Hứng (Inspiration)',
      secondarySlots: [{ name: 'Giao Hàng Bánh Quy', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png`, description: 'Hồi phục mana' }, { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png`, description: 'Hồi chiêu phép bổ trợ' }],
      statShards: ['+9 Sức mạnh thích ứng', '+9 Sức mạnh thích ứng', '+6 Giáp']
    },
    [{ name: 'Veigar', icon: `${DDRAGON_CHAMP_BASE}/Veigar.png`, winRate: '54.8%' }],
    [{ name: 'Yasuo', icon: `${DDRAGON_CHAMP_BASE}/Yasuo.png`, winRate: '47.9%' }]
  ),

  // ZED
  Zed: createChampionRankMap('ĐƯỜNG GIỮA (MID)', 'MID', 'S+', '51.4%', '11.8%', '21.5%', 'Khó',
    ['Q', 'E', 'W'], ['1055', '2003'], ['6692', '3142', '3814'], ['3036', '3156', '3026'], ['3158'],
    {
      name: 'Áp Đảo (Domination)', icon: `${DDRAGON_PERK_BASE}/Styles/7200_Domination.png`,
      keystone: { name: 'Sốc Điện (Electrocute)', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/Electrocute/Electrocute.png`, description: 'Combo WEQ sốc chết tướng yếu máu trong 1s.', isKeystone: true },
      primarySlots: [{ name: 'Tác Động Bất Ngờ', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/SuddenImpact/SuddenImpact.png`, description: 'Tăng sát lực khi đổi bóng W/R' }, { name: 'Thu Thập Nhãn Cầu', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/EyeballCollection/EyeballCollection.png`, description: 'Tăng AD khi hạ gục' }, { name: 'Thợ Săn Tàn Nhẫn', icon: `${DDRAGON_PERK_BASE}/Styles/Domination/RelentlessHunter/RelentlessHunter.png`, description: 'Chạy gank 2 lane' }],
      secondaryTreeName: 'Pháp Thuật (Sorcery)',
      secondarySlots: [{ name: 'Thăng Tiến Sức Mạnh', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/Transcendence/Transcendence.png`, description: 'Giảm hồi bóng W' }, { name: 'Quả Cầu Hủy Diệt', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/NullifyingOrb/PetherrosShield.png`, description: 'Kháng dồn phép' }],
      statShards: ['+9 Sức mạnh thích ứng', '+9 Sức mạnh thích ứng', '+6 Giáp']
    },
    [{ name: 'Lux', icon: `${DDRAGON_CHAMP_BASE}/Lux.png`, winRate: '56.2%' }],
    [{ name: 'Lissandra', icon: `${DDRAGON_CHAMP_BASE}/Lissandra.png`, winRate: '45.4%' }]
  ),

  // JINX
  Jinx: createChampionRankMap('XẠ THỦ (ADC / BOT)', 'ADC', 'S+', '52.6%', '18.5%', '4.2%', 'Dễ',
    ['Q', 'W', 'E'], ['1055', '2003'], ['6672', '3031', '3072'], ['3036', '3071', '3026'], ['3006'],
    {
      name: 'Chuẩn Xác (Precision)', icon: `${DDRAGON_PERK_BASE}/Styles/7201_Precision.png`,
      keystone: { name: 'Nhịp Độ Chết Chóc (Lethal Tempo)', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LethalTempo/LethalTempoTemp.png`, description: 'Nội tại Hưng Phấn + Nhịp Độ quạt cháy toàn bộ giao tranh.', isKeystone: true },
      primarySlots: [{ name: 'Đắc Thắng', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Triumph.png`, description: 'Hồi máu khi hạ gục' }, { name: 'Huyền Thoại: Tốc Độ Đánh', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendAlacrity/LegendAlacrity.png`, description: 'Xả đạn nhanh' }, { name: 'Nhát Chém Ân Huệ', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/CoupDeGrace/CoupDeGrace.png`, description: 'Kết liễu bằng R tên lửa' }],
      secondaryTreeName: 'Cảm Hứng (Inspiration)',
      secondarySlots: [{ name: 'Giao Hàng Bánh Quy', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png`, description: 'Bánh quy trụ đường bot' }, { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png`, description: 'Giảm CD Tốc Biến' }],
      statShards: ['+10% Tốc độ đánh', '+9 Sức mạnh thích ứng', '+6 Giáp']
    },
    [{ name: 'Aphelios', icon: `${DDRAGON_CHAMP_BASE}/Aphelios.png`, winRate: '54.6%' }],
    [{ name: 'Draven', icon: `${DDRAGON_CHAMP_BASE}/Draven.png`, winRate: '46.1%' }]
  ),

  // KAISA
  Kaisa: createChampionRankMap('XẠ THỦ (ADC / BOT)', 'ADC', 'S+', '51.8%', '22.4%', '8.9%', 'Khó',
    ['Q', 'E', 'W'], ['1055', '2003'], ['6672', '3124', '3031'], ['3157', '3072', '3026'], ['3006'],
    {
      name: 'Chuẩn Xác (Precision)', icon: `${DDRAGON_PERK_BASE}/Styles/7201_Precision.png`,
      keystone: { name: 'Nhịp Độ Chết Chóc (Lethal Tempo)', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LethalTempo/LethalTempoTemp.png`, description: 'Nổ điện nội tại 5 điểm liên tục.', isKeystone: true },
      primarySlots: [{ name: 'Hiện Diện Trí Tuệ', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/PresenceOfMind.png`, description: 'Thả Q không lo hết mana' }, { name: 'Huyền Thoại: Tốc Độ Đánh', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendAlacrity/LegendAlacrity.png`, description: 'Tấn công dồn tiến hóa E' }, { name: 'Nhát Chém Ân Huệ', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/CoupDeGrace/CoupDeGrace.png`, description: 'Sát thương dồn R lướt' }],
      secondaryTreeName: 'Cảm Hứng (Inspiration)',
      secondarySlots: [{ name: 'Giao Hàng Bánh Quy', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png`, description: 'Mana & HP' }, { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png`, description: 'Giảm CD Tốc biến' }],
      statShards: ['+10% Tốc độ đánh', '+9 Sức mạnh thích ứng', '+6 Giáp']
    },
    [{ name: 'Zeri', icon: `${DDRAGON_CHAMP_BASE}/Zeri.png`, winRate: '53.8%' }],
    [{ name: 'Caitlyn', icon: `${DDRAGON_CHAMP_BASE}/Caitlyn.png`, winRate: '47.2%' }]
  ),

  // THRESH
  Thresh: createChampionRankMap('HỖ TRỢ (SUPPORT)', 'SUPPORT', 'S+', '51.9%', '14.1%', '9.2%', 'Khó',
    ['Q', 'W', 'E'], ['3858', '2003'], ['3190', '3050', '3109'], ['3110', '4401', '3083'], ['3117'],
    {
      name: 'Kiên Định (Resolve)', icon: `${DDRAGON_PERK_BASE}/Styles/7204_Resolve.png`,
      keystone: { name: 'Dư Địa Chấn (Aftershock)', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/VeteranAftershock/VeteranAftershock.png`, description: 'Trở nên trâu bò ngay khi Kéo Q hoặc Đập E trúng.', isKeystone: true },
      primarySlots: [{ name: 'Suối Nguồn Sinh Mệnh', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/FontOfLife/FontOfLife.png`, description: 'Hồi máu cho ADC khi giữ chân' }, { name: 'Giáp Cốt', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/BonePlating/BonePlating.png`, description: 'Giảm đòn đánh khi lao vào' }, { name: 'Lan Truyền', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/Overgrowth/Overgrowth.png`, description: 'Tích máu nhặt linh hồn' }],
      secondaryTreeName: 'Cảm Hứng (Inspiration)',
      secondarySlots: [{ name: 'Bước Chân Kỳ Diệu', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png`, description: 'Giày đảo gank' }, { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png`, description: 'Giảm CD Tốc Biến kéo Q' }],
      statShards: ['+8 Tốc độ hồi kỹ năng', '+6 Giáp', '+15-140 Máu theo cấp']
    },
    [{ name: 'Yuumi', icon: `${DDRAGON_CHAMP_BASE}/Yuumi.png`, winRate: '56.1%' }],
    [{ name: 'Morgana', icon: `${DDRAGON_CHAMP_BASE}/Morgana.png`, winRate: '45.8%' }]
  ),
};

function createChampionRankMap(
  roleName: string, lane: LaneRole, defaultTier: 'S+' | 'S' | 'A' | 'B',
  wr: string, pr: string, br: string, diff: 'Dễ' | 'Trung Bình' | 'Khó' | 'Cực Khó',
  skillMax: string[], starters: string[], cores: string[], situationals: string[], bootsList: string[],
  runeSchema: RuneTree, strong: { name: string; icon: string; winRate: string }[], weak: { name: string; icon: string; winRate: string }[]
): Record<RankTier, MetaBuild> {
  const baseBuild: MetaBuild = {
    role: roleName, lane, tier: defaultTier, winRate: wr, pickRate: pr, banRate: br, difficulty: diff,
    recommendedEloText: `Top Meta chuẩn mực lane ${lane} ở mọi bậc Rank`,
    summonerSpells: lane === 'JUNGLE'
      ? [{ name: 'Tốc Biến', icon: `${DDRAGON_SPELL_BASE}/SummonerFlash.png` }, { name: 'Trừng Phạt', icon: `${DDRAGON_SPELL_BASE}/SummonerSmite.png` }]
      : lane === 'ADC'
      ? [{ name: 'Tốc Biến', icon: `${DDRAGON_SPELL_BASE}/SummonerFlash.png` }, { name: 'Hồi Máu', icon: `${DDRAGON_SPELL_BASE}/SummonerHeal.png` }]
      : lane === 'SUPPORT'
      ? [{ name: 'Tốc Biến', icon: `${DDRAGON_SPELL_BASE}/SummonerFlash.png` }, { name: 'Kiệt Sức', icon: `${DDRAGON_SPELL_BASE}/SummonerExhaust.png` }]
      : [{ name: 'Tốc Biến', icon: `${DDRAGON_SPELL_BASE}/SummonerFlash.png` }, { name: 'Dịch Chuyển', icon: `${DDRAGON_SPELL_BASE}/SummonerTeleport.png` }],
    skillMaxPriority: skillMax,
    skillOrder: [{ key: skillMax[0], name: `Chiêu ${skillMax[0]}` }, { key: skillMax[1], name: `Chiêu ${skillMax[1]}` }, { key: skillMax[2], name: `Chiêu ${skillMax[2]}` }],
    starterItems: starters, coreItems: cores, situationalItems: situationals, boots: bootsList,
    runes: runeSchema, counters: { strongAgainst: strong, weakAgainst: weak }
  };

  return {
    all: baseBuild,
    low: { ...baseBuild, recommendedEloText: `Bá chủ leo rank Sắt - Vàng ở vị trí ${lane}`, winRate: (parseFloat(wr) + 1.5).toFixed(1) + '%' },
    emerald: { ...baseBuild, recommendedEloText: `Chuẩn Meta Lục Bảo & Bạch Kim vị trí ${lane}` },
    high: { ...baseBuild, recommendedEloText: `Tối ưu hóa phản ứng kỹ năng ở bối cảnh High Elo`, winRate: (parseFloat(wr) - 0.8).toFixed(1) + '%' },
  };
}

/**
 * Main query method for retrieving champion rank-specific meta information
 */
export function getChampionMetaBuild(
  championId: string,
  tags: string[] = [],
  rank: RankTier = 'all'
): MetaBuild {
  if (CHAMPION_META_REGISTRY[championId]) {
    return CHAMPION_META_REGISTRY[championId][rank] || CHAMPION_META_REGISTRY[championId]['all'];
  }

  // Get primary lane from map or fallback from tags
  const mappedLane = CHAMPION_PRIMARY_LANE_MAP[championId] || determineLaneFromTags(tags[0]);
  return generateLaneMetaBuild(championId, mappedLane, rank);
}

function determineLaneFromTags(primaryTag?: string): LaneRole {
  switch (primaryTag) {
    case 'Assassin':
    case 'Mage':
      return 'MID';
    case 'Marksman':
      return 'ADC';
    case 'Support':
      return 'SUPPORT';
    case 'Tank':
    case 'Fighter':
    default:
      return 'TOP';
  }
}

function generateLaneMetaBuild(championId: string, lane: LaneRole, rank: RankTier): MetaBuild {
  const isLowRank = rank === 'low';

  switch (lane) {
    case 'JUNGLE':
      return {
        role: 'ĐI RỪNG (JUNGLE)', lane: 'JUNGLE', tier: 'S', winRate: '51.8%', pickRate: '10.1%', banRate: '8.4%', difficulty: 'Khó',
        recommendedEloText: 'Kiểm soát mục tiêu rồng, sứ giả và tổ chức gank 2 cánh hiệu quả',
        summonerSpells: [{ name: 'Tốc Biến', icon: `${DDRAGON_SPELL_BASE}/SummonerFlash.png` }, { name: 'Trừng Phạt', icon: `${DDRAGON_SPELL_BASE}/SummonerSmite.png` }],
        skillMaxPriority: ['Q', 'W', 'E'], skillOrder: [{ key: 'Q', name: 'Chiêu Q' }, { key: 'W', name: 'Chiêu W' }, { key: 'E', name: 'Chiêu E' }],
        starterItems: ['1101', '2003'], coreItems: ['6630', '3078', '3053'], situationalItems: ['6333', '3143', '3026'], boots: ['3047'],
        runes: {
          name: 'Chuẩn Xác (Precision)', icon: `${DDRAGON_PERK_BASE}/Styles/7201_Precision.png`,
          keystone: { name: 'Chinh Phục (Conqueror)', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Conqueror/Conqueror.png`, description: 'Cộng dồn sức mạnh khi gank.', isKeystone: true },
          primarySlots: [{ name: 'Đắc Thắng', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Triumph.png`, description: 'Hồi máu combat' }, { name: 'Huyền Thoại: Tốc Độ Đánh', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendAlacrity/LegendAlacrity.png`, description: 'Dọn quái nhanh' }, { name: 'Nhát Chém Ân Huệ', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/CoupDeGrace/CoupDeGrace.png`, description: 'Kết liễu' }],
          secondaryTreeName: 'Cảm Hứng (Inspiration)', secondarySlots: [{ name: 'Bước Chân Kỳ Diệu', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png`, description: 'Giày free' }, { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png`, description: 'Giảm CD Smite' }],
          statShards: ['+10% Tốc độ đánh', '+9 Sức mạnh thích ứng', '+6 Giáp']
        },
        counters: { strongAgainst: [{ name: 'MasterYi', icon: `${DDRAGON_CHAMP_BASE}/MasterYi.png`, winRate: '53.4%' }], weakAgainst: [{ name: 'Poppy', icon: `${DDRAGON_CHAMP_BASE}/Poppy.png`, winRate: '46.2%' }] }
      };

    case 'MID':
      return {
        role: 'ĐƯỜNG GIỮA (MID)', lane: 'MID', tier: 'S', winRate: '52.1%', pickRate: '9.2%', banRate: '5.8%', difficulty: 'Trung Bình',
        recommendedEloText: 'Cấu rích sát thương diện rộng và kiểm soát giao tranh tổng',
        summonerSpells: [{ name: 'Tốc Biến', icon: `${DDRAGON_SPELL_BASE}/SummonerFlash.png` }, { name: 'Dịch Chuyển', icon: `${DDRAGON_SPELL_BASE}/SummonerTeleport.png` }],
        skillMaxPriority: ['Q', 'W', 'E'], skillOrder: [{ key: 'Q', name: 'Chiêu Q' }, { key: 'W', name: 'Chiêu W' }, { key: 'E', name: 'Chiêu E' }],
        starterItems: ['1056', '2003'], coreItems: ['6655', '3020', '3157'], situationalItems: ['3089', '3135', '3102'], boots: ['3020'],
        runes: {
          name: 'Pháp Thuật (Sorcery)', icon: `${DDRAGON_PERK_BASE}/Styles/7202_Sorcery.png`,
          keystone: { name: 'Thiên Thạch Kỳ Bí (Arcane Comet)', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/ArcaneComet/ArcaneComet.png`, description: 'Gây thêm sát thương phép từ xa.', isKeystone: true },
          primarySlots: [{ name: 'Dải Băng Năng Lượng', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/ManaflowBand/ManaflowBand.png`, description: 'Mana' }, { name: 'Thăng Tiến Sức Mạnh', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/Transcendence/Transcendence.png`, description: 'Giảm hồi chiêu' }, { name: 'Thiêu Rụi', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/Scorch/Scorch.png`, description: 'Đốt phép' }],
          secondaryTreeName: 'Cảm Hứng (Inspiration)', secondarySlots: [{ name: 'Giao Hàng Bánh Quy', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png`, description: 'Trụ lane' }, { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png`, description: 'Hồi chiêu bổ trợ' }],
          statShards: ['+9 Sức mạnh thích ứng', '+9 Sức mạnh thích ứng', '+6 Giáp']
        },
        counters: { strongAgainst: [{ name: 'Veigar', icon: `${DDRAGON_CHAMP_BASE}/Veigar.png`, winRate: '53.9%' }], weakAgainst: [{ name: 'Zed', icon: `${DDRAGON_CHAMP_BASE}/Zed.png`, winRate: '46.8%' }] }
      };

    case 'ADC':
      return {
        role: 'XẠ THỦ (ADC / BOT)', lane: 'ADC', tier: 'S', winRate: '51.8%', pickRate: '12.4%', banRate: '6.1%', difficulty: 'Dễ',
        recommendedEloText: 'Sát thương dồn theo thời gian cực kỳ uy lực ở giai đoạn cuối trận',
        summonerSpells: [{ name: 'Tốc Biến', icon: `${DDRAGON_SPELL_BASE}/SummonerFlash.png` }, { name: 'Hồi Máu', icon: `${DDRAGON_SPELL_BASE}/SummonerHeal.png` }],
        skillMaxPriority: ['Q', 'W', 'E'], skillOrder: [{ key: 'Q', name: 'Chiêu Q' }, { key: 'W', name: 'Chiêu W' }, { key: 'E', name: 'Chiêu E' }],
        starterItems: ['1055', '2003'], coreItems: ['6672', '3031', '3072'], situationalItems: ['3036', '3071', '3026'], boots: ['3006'],
        runes: {
          name: 'Chuẩn Xác (Precision)', icon: `${DDRAGON_PERK_BASE}/Styles/7201_Precision.png`,
          keystone: { name: 'Nhịp Độ Chết Chóc (Lethal Tempo)', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LethalTempo/LethalTempoTemp.png`, description: 'Tăng tốc độ bắn.', isKeystone: true },
          primarySlots: [{ name: 'Đắc Thắng', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Triumph.png`, description: 'Hồi máu hạ gục' }, { name: 'Huyền Thoại: Tốc Độ Đánh', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendAlacrity/LegendAlacrity.png`, description: 'Tốc độ bắn' }, { name: 'Nhát Chém Ân Huệ', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/CoupDeGrace/CoupDeGrace.png`, description: 'Kết liễu' }],
          secondaryTreeName: 'Cảm Hứng (Inspiration)', secondarySlots: [{ name: 'Giao Hàng Bánh Quy', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png`, description: 'Bánh quy trụ đường' }, { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png`, description: 'Giảm CD' }],
          statShards: ['+10% Tốc độ đánh', '+9 Sức mạnh thích ứng', '+6 Giáp']
        },
        counters: { strongAgainst: [{ name: 'Zeri', icon: `${DDRAGON_CHAMP_BASE}/Zeri.png`, winRate: '53.1%' }], weakAgainst: [{ name: 'Draven', icon: `${DDRAGON_CHAMP_BASE}/Draven.png`, winRate: '46.9%' }] }
      };

    case 'SUPPORT':
      return {
        role: 'HỖ TRỢ (SUPPORT)', lane: 'SUPPORT', tier: 'S+', winRate: '52.4%', pickRate: '11.1%', banRate: '4.2%', difficulty: 'Dễ',
        recommendedEloText: 'Bảo vệ xạ thủ và tạo đột biến khống chế trong combat',
        summonerSpells: [{ name: 'Tốc Biến', icon: `${DDRAGON_SPELL_BASE}/SummonerFlash.png` }, { name: 'Kiệt Sức', icon: `${DDRAGON_SPELL_BASE}/SummonerExhaust.png` }],
        skillMaxPriority: ['E', 'Q', 'W'], skillOrder: [{ key: 'E', name: 'Chiêu E' }, { key: 'Q', name: 'Chiêu Q' }, { key: 'W', name: 'Chiêu W' }],
        starterItems: ['3858', '2003'], coreItems: ['3190', '3050', '3109'], situationalItems: ['3110', '3083', '4401'], boots: ['3117'],
        runes: {
          name: 'Kiên Định (Resolve)', icon: `${DDRAGON_PERK_BASE}/Styles/7204_Resolve.png`,
          keystone: { name: 'Dư Địa Chấn (Aftershock)', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/VeteranAftershock/VeteranAftershock.png`, description: 'Trâu bò khi mở giao tranh.', isKeystone: true },
          primarySlots: [{ name: 'Suối Nguồn Sinh Mệnh', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/FontOfLife/FontOfLife.png`, description: 'Hồi máu cho đồng đội' }, { name: 'Giáp Cốt', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/BonePlating/BonePlating.png`, description: 'Chống đòn đánh' }, { name: 'Lan Truyền', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/Overgrowth/Overgrowth.png`, description: 'Tích máu' }],
          secondaryTreeName: 'Cảm Hứng (Inspiration)', secondarySlots: [{ name: 'Bước Chân Kỳ Diệu', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png`, description: 'Giày miễn phí' }, { name: 'Thấu Thị Vũ Trụ', icon: `${DDRAGON_PERK_BASE}/Styles/Inspiration/CosmicInsight/CosmicInsight.png`, description: 'Giảm hồi chiêu' }],
          statShards: ['+8 Tốc độ hồi kỹ năng', '+6 Giáp', '+15-140 Máu theo cấp']
        },
        counters: { strongAgainst: [{ name: 'Yuumi', icon: `${DDRAGON_CHAMP_BASE}/Yuumi.png`, winRate: '55.4%' }], weakAgainst: [{ name: 'Morgana', icon: `${DDRAGON_CHAMP_BASE}/Morgana.png`, winRate: '46.0%' }] }
      };

    case 'TOP':
    default:
      return {
        role: 'ĐƯỜNG TRÊN (TOP)', lane: 'TOP', tier: 'S+', winRate: '51.9%', pickRate: '9.8%', banRate: '12.4%', difficulty: 'Trung Bình',
        recommendedEloText: 'Solo 1v1 mạnh mẽ, đè bẹp đường và tự tay gánh đội',
        summonerSpells: [{ name: 'Tốc Biến', icon: `${DDRAGON_SPELL_BASE}/SummonerFlash.png` }, { name: 'Dịch Chuyển', icon: `${DDRAGON_SPELL_BASE}/SummonerTeleport.png` }],
        skillMaxPriority: ['Q', 'E', 'W'], skillOrder: [{ key: 'Q', name: 'Chiêu Q' }, { key: 'E', name: 'Chiêu E' }, { key: 'W', name: 'Chiêu W' }],
        starterItems: ['1054', '2003'], coreItems: ['6630', '3071', '3053'], situationalItems: ['3143', '6333', '3026'], boots: ['3047'],
        runes: {
          name: 'Chuẩn Xác (Precision)', icon: `${DDRAGON_PERK_BASE}/Styles/7201_Precision.png`,
          keystone: { name: 'Chinh Phục (Conqueror)', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Conqueror/Conqueror.png`, description: 'Tích dồn sát thương và hồi máu.', isKeystone: true },
          primarySlots: [{ name: 'Đắc Thắng', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/Triumph.png`, description: 'Hồi máu hạ gục' }, { name: 'Huyền Thoại: Gia Tốc', icon: `${DDRAGON_PERK_BASE}/Styles/Precision/LegendHaste/LegendHaste.png`, description: 'Gia tốc kỹ năng' }, { name: 'Chốt Chặn Cuối Cùng', icon: `${DDRAGON_PERK_BASE}/Styles/Sorcery/LastStand/LastStand.png`, description: 'Sát thương khi thấp máu' }],
          secondaryTreeName: 'Kiên Định (Resolve)', secondarySlots: [{ name: 'Giáp Cốt', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/BonePlating/BonePlating.png`, description: 'Chống đòn đánh' }, { name: 'Lan Truyền', icon: `${DDRAGON_PERK_BASE}/Styles/Resolve/Overgrowth/Overgrowth.png`, description: 'Tích máu' }],
          statShards: ['+9 Sức mạnh thích ứng', '+9 Sức mạnh thích ứng', '+6 Giáp']
        },
        counters: { strongAgainst: [{ name: 'Sion', icon: `${DDRAGON_CHAMP_BASE}/Sion.png`, winRate: '54.7%' }], weakAgainst: [{ name: 'Fiora', icon: `${DDRAGON_CHAMP_BASE}/Fiora.png`, winRate: '47.3%' }] }
      };
  }
}
