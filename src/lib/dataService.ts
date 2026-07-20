export interface GameItem {
  id: string;
  name: string;
  image: string;
  description: string;
  category?: string;
  gameSource: 'League of Legends' | 'Elden Ring';
}

export type FextralifeCategory =
  | 'weapons'
  | 'armors'
  | 'shields'
  | 'talismans'
  | 'sorceries'
  | 'incantations'
  | 'ashes'
  | 'items'
  | 'bosses'
  | 'npcs'
  | 'locations';

export interface EldenRingEntity {
  id: string;
  name: string;
  nameVi?: string;
  image: string;
  description: string;
  category: FextralifeCategory;
  subCategory?: string;
  expansion: 'Base Game' | 'Shadow of the Erdtree';
  locationHint?: string;
  mapLocationUrl: string;
  quote?: string;
  stats?: Record<string, string>;
  weight?: string;
}

interface LolItemPayload {
  name: string;
  description: string;
  plaintext?: string;
  image: {
    full: string;
  };
}

interface LolItemResponse {
  data: Record<string, LolItemPayload>;
}

interface EldenRingApiPayload {
  id: string;
  name: string;
  image: string;
  description: string;
  location?: string;
  quote?: string;
}

interface EldenRingApiResponse {
  success: boolean;
  count: number;
  total?: number;
  data: EldenRingApiPayload[];
}

const REVALIDATE_SECONDS = 3600;

export async function fetchLolItems(): Promise<GameItem[]> {
  try {
    const versionsRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json', {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!versionsRes.ok) return [];
    const versions: string[] = await versionsRes.json();
    const latestVersion = versions[0];

    const itemsRes = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!itemsRes.ok) return [];
    const itemsData: LolItemResponse = await itemsRes.json();

    return Object.entries(itemsData.data).map(([id, item]) => ({
      id: `lol-${id}`,
      name: item.name,
      image: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/item/${item.image.full}`,
      description: item.plaintext || item.description.replace(/<[^>]*>?/gm, ''),
      category: 'Trang Bị',
      gameSource: 'League of Legends',
    }));
  } catch {
    return [];
  }
}

// Subcategory Auto-Inferencer for Elden Ring entities
export function inferSubCategory(name: string, category: FextralifeCategory): string {
  const n = name.toLowerCase();

  switch (category) {
    case 'weapons':
      if (n.includes('light greatsword')) return 'Bản Kiếm Nhẹ (Light Greatsword)';
      if (n.includes('backhand')) return 'Kiếm Đảo Tay (Backhand Blade)';
      if (n.includes('great katana')) return 'Đại Trảm Đao (Great Katana)';
      if (n.includes('beast claw')) return 'Móng Vuốt Dã Thú (Beast Claws)';
      if (n.includes('hand-to-hand') || n.includes('dryleaf') || n.includes('footwork')) return 'Võ Thuật Kình Lực (Hand-to-Hand)';
      if (n.includes('perfume')) return 'Bình Hương Phép (Perfume Bottle)';
      if (n.includes('thrusting shield')) return 'Khiên Tấn Công (Thrusting Shield)';
      if (n.includes('greatsword')) return 'Đại Kiếm (Greatsword)';
      if (n.includes('colossal sword') || n.includes('zwei') || n.includes('starscourge')) return 'Bản Kiếm Cực Đại (Colossal Sword)';
      if (n.includes('katana') || n.includes('uchigatana') || n.includes('nagakiba') || n.includes('rivers of blood')) return 'Trảm Đao (Katana)';
      if (n.includes('twinblade')) return 'Song Đầu Kiếm (Twinblade)';
      if (n.includes('straight sword') || n.includes('sword')) return 'Trường Kiếm (Straight Sword)';
      if (n.includes('dagger') || n.includes('kris') || n.includes('knife')) return 'Dao Găm (Dagger)';
      if (n.includes('halberd')) return 'Trường Đao (Halberd)';
      if (n.includes('scythe') || n.includes('reaper')) return 'Lưỡi Liềm Tử Thần (Scythe)';
      if (n.includes('spear')) return 'Trường Thương (Spear)';
      if (n.includes('greataxe') || n.includes('axe')) return 'Rìu Chiến (Axe)';
      if (n.includes('hammer') || n.includes('mace')) return 'Búa Chiến (Hammer)';
      if (n.includes('bow')) return 'Cung Tên (Bow)';
      if (n.includes('staff')) return 'Gậy Ma Thuật (Staff)';
      if (n.includes('seal')) return 'Ấn Chú Phép (Sacred Seal)';
      if (n.includes('whip')) return 'Roi Bật (Whip)';
      if (n.includes('claw')) return 'Vuốt Sắt (Claw)';
      if (n.includes('fist')) return 'Quyền Thủ (Fist)';
      return 'Vũ Khí Chiến Đấu (Weapon)';

    case 'armors':
      if (n.includes('helm') || n.includes('crown') || n.includes('mask') || n.includes('hood') || n.includes('hat') || n.includes('cap')) return 'Mũ Giáp (Helm)';
      if (n.includes('gauntlets') || n.includes('gloves') || n.includes('manchettes') || n.includes('bracers')) return 'Găng Tay (Gauntlets)';
      if (n.includes('greaves') || n.includes('leggings') || n.includes('boots') || n.includes('trousers')) return 'Giáp Chân (Greaves)';
      return 'Áo Giáp Thân (Chest Armor)';

    case 'shields':
      if (n.includes('greatshield')) return 'Đại Khiên (Greatshield)';
      if (n.includes('small')) return 'Khiên Nhỏ (Small Shield)';
      if (n.includes('thrusting')) return 'Khiên Đâm (Thrusting Shield)';
      return 'Khiên Trung (Medium Shield)';

    case 'sorceries':
      if (n.includes('thorn') || n.includes('brier')) return 'Gai Đỏ Huyết Tộc (Thorn Sorcery)';
      if (n.includes('gravity') || n.includes('gravitational') || n.includes('stone') || n.includes('collapsing')) return 'Trọng Lực (Gravity Sorcery)';
      if (n.includes('carian') || n.includes('moon')) return 'Hoàng Gia Carian (Carian Sorcery)';
      if (n.includes('finger') || n.includes('microcosm')) return 'Ngón Tay Ngân Hà (Finger Sorcery)';
      if (n.includes('putrescence') || n.includes('ghostflame')) return 'Ngọn Lửa Băng (Death/Putrescent)';
      if (n.includes('glintstone') || n.includes('comet') || n.includes('shard')) return 'Đá Ma Thuật (Glintstone Sorcery)';
      return 'Ma Thuật Phù Thủy (Sorcery)';

    case 'incantations':
      if (n.includes('lightning') || n.includes('bolt') || n.includes('dragon cult')) return 'Sét Cổ Đại (Lightning Incantation)';
      if (n.includes('dragon') || n.includes('breath') || n.includes('roar')) return 'Long Tộc (Dragon Communion)';
      if (n.includes('frenzy') || n.includes('frenzied') || n.includes('madness') || n.includes('midra')) return 'Ngọn Lửa Điên (Frenzied Flame)';
      if (n.includes('flame') || n.includes('fire') || n.includes('burn')) return 'Ngọn Lửa Tu Sĩ (Fire Monk/Giants)';
      if (n.includes('miquella') || n.includes('light') || n.includes('erdtree') || n.includes('heal') || n.includes('blessing')) return 'Ánh Sáng Thánh (Erdtree/Miquella)';
      if (n.includes('ansbach') || n.includes('blood') || n.includes('swarm')) return 'Huyết Tộc (Blood Incantation)';
      if (n.includes('pest') || n.includes('rot')) return 'Thối Rữa Đỏ (Servants of Rot)';
      return 'Phép Thuật Thánh Giáo (Incantation)';

    case 'talismans':
      if (n.includes('+3') || n.includes('+2') || n.includes('dragon') || n.includes('turtle') || n.includes('dread') || n.includes('stardust')) return 'Bùa Cao Cấp (Great Talisman)';
      return 'Bùa Hộ Mệnh (Talisman)';

    case 'ashes':
      if (n.includes('stance') || n.includes('claw') || n.includes('skewer') || n.includes('wings')) return 'Chiêu Thức Độc Quyền DLC';
      return 'Tuyệt Kỹ Chiến Tranh (Ash of War)';

    case 'items':
      if (n.includes('bell bearing')) return 'Ngọc Chuông Thương Nhân (Bell Bearing)';
      if (n.includes('remembrance')) return 'Ký Ước Bán Thần (Remembrance)';
      if (n.includes('scadutree fragment')) return 'Mảnh Cây Scadutree (Scadutree Fragment)';
      if (n.includes('revered spirit')) return 'Linh Hồn Tôn Kính (Revered Spirit Ash)';
      if (n.includes('glovewort')) return 'Hoa Linh Mộ (Glovewort)';
      if (n.includes('smithing stone')) return 'Đá Rèn Vũ Khí (Smithing Stone)';
      return 'Vật Phẩm Dụng Cụ (Consumable/Item)';

    case 'bosses':
      if (n.includes('messmer') || n.includes('radahn') || n.includes('rellana') || n.includes('midra') || n.includes('bayle') || n.includes('gaius') || n.includes('metyr') || n.includes('malenia') || n.includes('radahn') || n.includes('morgott') || n.includes('mohg')) return 'Bán Thần & Trùm Ký Ước (Remembrance Boss)';
      return 'Trùm & Thủ Lĩnh Khu Vực (Field Boss)';

    case 'npcs':
      if (n.includes('leda') || n.includes('ansbach') || n.includes('thiollier') || n.includes('freyja') || n.includes('hornsent') || n.includes('igon') || n.includes('ymir') || n.includes('ranni') || n.includes('millicent') || n.includes('alexander')) return 'Nhân Vật Cốt Truyện Chính (Main NPC)';
      return 'Nhân Vật Phụ & Thương Nhân (NPC)';

    case 'locations':
      if (n.includes('shadow') || n.includes('scadu') || n.includes('gravesite') || n.includes('enir-ilim') || n.includes('belurat') || n.includes('rauh') || n.includes('jagged') || n.includes('abyssal')) return 'Vùng Đất Bóng Tối (Realm of Shadow DLC)';
      return 'Vùng Đất Lands Between (Base Game)';

    default:
      return 'Tổng Hợp (General)';
  }
}

// ----------------------------------------------------------------------
// SHADOW OF THE ERDTREE (DLC) EXPANSION COMPREHENSIVE DATABASE
// ----------------------------------------------------------------------

export const ELDEN_RING_DLC_WEAPONS: EldenRingEntity[] = [
  {
    id: 'er-dlc-weapon-milady',
    name: 'Milady',
    nameVi: 'Thanh Kiếm Milady',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/milady_light_greatswords_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Thanh bản kiếm nhẹ thanh thoát uyển chuyển của các hiệp sĩ Castle Ensis. Kết hợp tốc độ của trường kiếm và tầm đánh linh hoạt của đại kiếm.',
    category: 'weapons',
    subCategory: 'Bản Kiếm Nhẹ (Light Greatsword)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Castle Ensis (Nhặt trên đỉnh tháp quan sát)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Castle%20Ensis',
    quote: 'Weapon of the knights who accompanied Rellana.',
    stats: { Physical: '116', Critical: '100', Weight: '6.5', Requirements: 'Str 12, Dex 17' },
  },
  {
    id: 'er-dlc-weapon-ledas-sword',
    name: "Leda's Sword",
    nameVi: 'Thanh Kiếm Của Leda',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/ledas_sword_light_greatswords_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bản kiếm nhẹ mạ vàng mỏng manh được sử dụng bởi Hiệp Sĩ Kim Khâu Leda. Tuyệt kỹ Needle Piercer phóng ra kim thánh tước bỏ mọi hiệu ứng có lợi của đối thủ.',
    category: 'weapons',
    subCategory: 'Bản Kiếm Nhẹ (Light Greatsword)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Enir-Ilim (Nhận từ Needle Knight Leda)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Enir-Ilim',
    quote: 'Sword of Needle Knight Leda.',
    stats: { Physical: '102', Holy: '66', Weight: '6.5', Requirements: 'Str 11, Dex 22, Faith 19' },
  },
  {
    id: 'er-dlc-weapon-rellanas-twin-blades',
    name: "Rellana's Twin Blades",
    nameVi: 'Song Kiếm Của Rellana',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/rellanas_twin_blades_light_greatswords_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Cặp bản kiếm nhẹ tượng trưng cho Mặt Trăng Băng và Ngọn Lửa Hoàng Gia. Tuyệt kỹ Moon-and-Fire Stance thi triển chiêu thức song hệ ma thuật rực rỡ.',
    category: 'weapons',
    subCategory: 'Bản Kiếm Nhẹ (Light Greatsword)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Castle Ensis (Đổi từ Remembrance of the Twin Moon Knight)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Rellana',
    quote: 'Pair of light greatswords wielded by Rellana.',
    stats: { Physical: '99', Magic: '64', Fire: '64', Weight: '8.0', Requirements: 'Str 13, Dex 16, Int 16, Faith 16' },
  },
  {
    id: 'er-dlc-weapon-greatsword-of-solitude',
    name: 'Greatsword of Solitude',
    nameVi: 'Đại Kiếm Cô Độc',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/greatsword_of_solitude_greatswords_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Thanh đại kiếm sắt nặng nề cực kỳ kiên cố. Tuyệt kỹ Solitary Moon Slash chém ra sóng xung kích tròn dồn ép kẻ thù.',
    category: 'weapons',
    subCategory: 'Đại Kiếm (Greatsword)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Western Nameless Mausoleum (Thả ra bởi Blackgaal Knight)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Blackgaal%20Knight',
    quote: 'Greatsword of heavy iron forged for the Knight of Solitude.',
    stats: { Physical: '150', GuardBoost: '89', Weight: '15.5', Requirements: 'Str 27, Dex 13' },
  },
  {
    id: 'er-dlc-weapon-great-katana',
    name: 'Great Katana',
    nameVi: 'Đại Trảm Đao',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/great_katana_great_katanas_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Loại trảm đao dài sừng sững mới được giới thiệu trong DLC. Mang tầm với xa vượt trội cùng khả năng gây mất máu Bleed khủng khiếp.',
    category: 'weapons',
    subCategory: 'Đại Trảm Đao (Great Katana)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Gravesite Plain (Nhặt cạnh hồ rồng Sleeping Dragon)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Gravesite%20Plain',
    quote: 'Massive katana that requires both hands to wield.',
    stats: { Physical: '145', Bleed: '55', Weight: '9.0', Requirements: 'Str 17, Dex 21' },
  },
  {
    id: 'er-dlc-weapon-rakshasas-great-katana',
    name: "Rakshasa's Great Katana",
    nameVi: 'Đại Trảm Đao Rakshasa',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/rakshasas_great_katana_great_katanas_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Thanh trảm đao đẫm máu của cuồng ma Rakshasa. Kẻ cầm kiếm không bị ngắt chiêu đòn đánh (Super Armor) nhưng chịu thêm sát thương.',
    category: 'weapons',
    subCategory: 'Đại Trảm Đao (Great Katana)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Eastern Nameless Mausoleum (Đánh bại Rakshasa)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Rakshasa',
    quote: 'Great katana of Rakshasa, dyed a deep crimson.',
    stats: { Physical: '155', Bleed: '55', Weight: '9.5', Requirements: 'Str 12, Dex 27' },
  },
  {
    id: 'er-dlc-weapon-dragon-hunters-great-katana',
    name: "Dragon Hunter's Great Katana",
    nameVi: 'Đại Trảm Đao Săn Rồng',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/dragon_hunters_great_katana_great_katanas_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Đại trảm đao chuyên trị rồng thần. Tuyệt kỹ Dragonwound Slash phóng ra chùm sóng năng lượng hủy diệt loài rồng.',
    category: 'weapons',
    subCategory: 'Đại Trảm Đao (Great Katana)',
    expansion: 'Shadow of the Erdtree',
    locationHint: "Dragon's Pit (Thả ra bởi Ancient Dragon Man)",
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Dragon%20Man',
    quote: 'Great katana crafted specifically for dragon hunting.',
    stats: { Physical: '152', Bleed: '55', Weight: '9.5', Requirements: 'Str 15, Dex 20' },
  },
  {
    id: 'er-dlc-weapon-backhand-blade',
    name: 'Backhand Blade',
    nameVi: 'Kiếm Đảo Tay',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/backhand_blade_backhand_blades_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Vũ khí đảo tay linh hoạt nhất game. Tuyệt kỹ Blind Spot cho phép lướt qua sườn đối phương và đâm một đòn chí mạng.',
    category: 'weapons',
    subCategory: 'Kiếm Đảo Tay (Backhand Blade)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Gravesite Plain (Nhặt tại quan tài đá phía đông bắc)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Gravesite%20Plain',
    quote: 'Curved sword held with a reverse grip.',
    stats: { Physical: '105', Weight: '2.0', Requirements: 'Str 10, Dex 13' },
  },
  {
    id: 'er-dlc-weapon-dryleaf-arts',
    name: 'Dryleaf Arts',
    nameVi: 'Võ Thuật Lá Khô (Dryleaf Arts)',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/dryleaf_arts_hand_to_hand_arts_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Vũ khí võ thuật cận chiến tay không (Hand-to-Hand Arts). Thi triển các cú đấm móc và đá bay dồn dập áp đảo đối thủ.',
    category: 'weapons',
    subCategory: 'Võ Thuật Kình Lực (Hand-to-Hand)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Moorth Ruins (Quyết đấu võ thuật cùng Dryleaf Dane)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Dryleaf%20Dane',
    quote: 'Hand-to-hand martial art practiced by the Seekers of Miquella.',
    stats: { Physical: '92', Weight: '1.0', Requirements: 'Str 8, Dex 8' },
  },
  {
    id: 'er-dlc-weapon-danes-footwork',
    name: "Dane's Footwork",
    nameVi: 'Cước Pháp Của Dane',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/danes_footwork_hand_to_hand_arts_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Võ thuật tập trung tuyệt đối vào kỹ năng cước pháp xoay người quét chân đầy uy lực.',
    category: 'weapons',
    subCategory: 'Võ Thuật Kình Lực (Hand-to-Hand)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Enir-Ilim (Nhận từ Dryleaf Dane)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Enir-Ilim',
    stats: { Physical: '95', Weight: '1.0', Requirements: 'Str 8, Dex 8' },
  },
  {
    id: 'er-dlc-weapon-beast-claw',
    name: 'Beast Claw',
    nameVi: 'Móng Vuốt Dã Thú',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/beast_claw_beast_claws_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Vũ khí móng vuốt quỷ dữ giằng xé thân xác kẻ địch bằng các đòn nhào lộn điên dại.',
    category: 'weapons',
    subCategory: 'Móng Vuốt Dã Thú (Beast Claws)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Gravesite Plain (Hạ gục Logur the Beast Claw)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Logur',
    quote: 'Weapon modeled after the claws of a wild beast.',
    stats: { Physical: '97', Bleed: '45', Weight: '3.0', Requirements: 'Str 13, Dex 11' },
  },
  {
    id: 'er-dlc-weapon-firespark-perfume-bottle',
    name: 'Firespark Perfume Bottle',
    nameVi: 'Bình Hương Phép Hỏa Tinh',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/firespark_perfume_bottle_perfume_bottles_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bình hương phép thuật mới phát vung ra làn sương lửa thiêu đốt toàn bộ khu vực phía trước.',
    category: 'weapons',
    subCategory: 'Bình Hương Phép (Perfume Bottle)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Front of Castle Ensis (Trong rương gỗ)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Castle%20Ensis',
    quote: 'Perfume bottle containing volatile spark powder.',
    stats: { Fire: '110', Weight: '1.0', Requirements: 'Dex 11, Faith 14' },
  },
  {
    id: 'er-dlc-weapon-spear-of-the-impaler',
    name: "Spear of the Impaler",
    nameVi: 'Thương Của Messmer Kẻ Xiên Mạng',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/spear_of_the_impaler_great_spears_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Ngọn đại thương rực lửa của Messmer the Impaler. Ném thương từ xa đâm xuyên kẻ địch và phát nổ thành rừng giáo lửa.',
    category: 'weapons',
    subCategory: 'Đại Thương Rực Lửa (Great Spear)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Shadow Keep (Đổi từ Remembrance of the Impaler)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Messmer',
    quote: 'Weapon of Messmer the Impaler.',
    stats: { Physical: '98', Fire: '115', Weight: '9.5', Requirements: 'Str 14, Dex 35, Faith 18' },
  },
  {
    id: 'er-dlc-weapon-ancient-meteoric-ore-greatsword',
    name: 'Ancient Meteoric Ore Greatsword',
    nameVi: 'Đại Kiếm Đá Thiên Thạch Cổ Đại',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/ancient_meteoric_ore_greatsword_colossal_swords_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Thanh bản kiếm cực đại đúc từ quặng thiên thạch cổ đại. Tuyệt kỹ White Light Charge đâm vút tới trước phát nổ trắng xóa.',
    category: 'weapons',
    subCategory: 'Bản Kiếm Cực Đại (Colossal Sword)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Starfall Catacombs (Ruins of Unte)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Starfall%20Catacombs',
    quote: 'Colossal sword forged from an ancient meteoric ore.',
    stats: { Physical: '148', Arcane: '45', Weight: '22.0', Requirements: 'Str 35, Dex 10, Arcane 19' },
  },
  {
    id: 'er-dlc-weapon-euphoria',
    name: 'Euphoria',
    nameVi: 'Song Đầu Kiếm Euphoria',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/euphemia_twinblades_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Song đầu kiếm ánh sáng thánh tối cao. Xoay tròn nạp năng lượng kim quang và phóng ra chòm tia thánh sát thương cực lớn.',
    category: 'weapons',
    subCategory: 'Song Đầu Kiếm (Twinblade)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Enir-Ilim (Giải đố thang máy ẩn tầng đáy)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Enir-Ilim',
    stats: { Physical: '104', Holy: '67', Weight: '7.0', Requirements: 'Str 16, Dex 16, Faith 24' },
  },
  {
    id: 'er-dlc-weapon-star-lined-sword',
    name: 'Star-Lined Sword',
    nameVi: 'Trảm Đao Ngân Hà',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/star-lined_sword_katanas_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Thanh katana tích tụ ánh sáng ma thuật ngôi sao của Demi-Human Queen Marigga. Tuyệt kỹ Eon Slash múa kiếm ảo diệu.',
    category: 'weapons',
    subCategory: 'Trảm Đao (Katana)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Cerulean Coast (Thả ra bởi Demi-Human Queen Marigga)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Cerulean%20Coast',
    stats: { Physical: '105', Magic: '68', Weight: '5.5', Requirements: 'Str 10, Dex 23, Int 16' },
  },
];

export const ELDEN_RING_DLC_ARMORS: EldenRingEntity[] = [
  {
    id: 'er-dlc-armor-solitude-helm',
    name: 'Helm of Solitude',
    nameVi: 'Mũ Giáp Cô Độc',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/helm_of_solitude_helmets_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Chiếc mũ giáp sắt kiên cố bậc nhất DLC với khả năng chống chịu Poise và kháng sát thương vật lý cực cao.',
    category: 'armors',
    subCategory: 'Mũ Giáp (Helm)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Western Nameless Mausoleum (Rớt ra từ Blackgaal Knight)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Blackgaal%20Knight',
  },
  {
    id: 'er-dlc-armor-solitude-armor',
    name: 'Armor of Solitude',
    nameVi: 'Áo Giáp Cô Độc',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/armor_of_solitude_chest_armor_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bộ áo giáp đúc bằng sắt đen khối của Hiệp Sĩ Cô Độc. Cho chỉ số phòng thủ Poise cao hàng đầu toàn game.',
    category: 'armors',
    subCategory: 'Áo Giáp Thân (Chest Armor)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Western Nameless Mausoleum (Rớt ra từ Blackgaal Knight)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Blackgaal%20Knight',
  },
  {
    id: 'er-dlc-armor-messmers-helm',
    name: "Messmer's Helm",
    nameVi: 'Mũ Rắn Rực Lửa Messmer',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/messmers_helm_helmets_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Mũ giáp vàng khắc họa hình tượng rắn quấn quanh của Messmer. Tăng sát thương phép thuật Incantations hệ Messmer/Fire.',
    category: 'armors',
    subCategory: 'Mũ Giáp (Helm)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Enia at Roundtable Hold (Sau khi hạ gục Messmer the Impaler)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Messmer',
  },
  {
    id: 'er-dlc-armor-rakshasa-armor',
    name: "Rakshasa's Armor",
    nameVi: 'Áo Giáp Ma Huyết Rakshasa',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/rakshasa_armor_chest_armor_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Áo giáp màu đỏ thẫm đẫm máu. Mặc từng mảnh giúp tăng 2% tổng sát thương đầu ra của nhân vật.',
    category: 'armors',
    subCategory: 'Áo Giáp Thân (Chest Armor)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Eastern Nameless Mausoleum (Hạ gục Rakshasa)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Rakshasa',
  },
  {
    id: 'er-dlc-armor-ansbach-set',
    name: "Ansbach's Armor",
    nameVi: 'Áo Giáp Sir Ansbach',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/ansbachs_armor_chest_armor_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bộ trang phục áo choàng quý phái của cuồng hiệp Sir Ansbach. Gia tăng sát thương phép Huyết Tộc (Blood Incantations).',
    category: 'armors',
    subCategory: 'Áo Giáp Thân (Chest Armor)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Enir-Ilim (Nhận sau chuỗi nhiệm vụ Ansbach)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Ansbach',
  },
];

export const ELDEN_RING_DLC_TALISMANS: EldenRingEntity[] = [
  {
    id: 'er-dlc-talisman-two-handed',
    name: 'Two-Handed Talisman',
    nameVi: 'Bùa Cầm Kiếm Hai Tay',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/two-handed_talisman_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bùa hộ mệnh gia tăng +15% sát thương đòn đánh khi cầm vũ khí bằng cả hai tay (Two-Handing).',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Temple Town Ruins (Rương ngầm trong tàn tích)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Temple%20Town%20Ruins',
  },
  {
    id: 'er-dlc-talisman-two-headed-turtle',
    name: 'Two-Headed Turtle Talisman',
    nameVi: 'Bùa Rùa Hai Đầu',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/two-headed_turtle_talisman_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Phiên bản nâng cấp tối thượng của Green Turtle Talisman. Gia tăng tốc độ hồi thể lực (Stamina Recovery) siêu tốc.',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Ellac River (Nhặt trong hang động phía sau thác nước)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Ellac%20River',
  },
  {
    id: 'er-dlc-talisman-crusade-insignia',
    name: 'Crusade Insignia',
    nameVi: 'Huy Chương Cuộc Thập Tự Chinh',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/crusade_insignia_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Huy chương hiệp sĩ chùy đinh Messmer. Tăng +15% sát thương tấn công trong 20 giây mỗi khi hạ gục một mục tiêu.',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Belurat, Tower Settlement (Hạ gục Fire Knight Queelign xâm nhập)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Queelign',
  },
  {
    id: 'er-dlc-talisman-talisman-of-the-dread',
    name: 'Talisman of the Dread',
    nameVi: 'Bùa Hộ Mệnh Rồng Cổ Bayle',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/talisman_of_the_dread_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Hình ảnh khắc họa sự sợ hãi của rồng Bayle. Gia tăng sát thương của các phép ngọn lửa Dung Nham (Magma) & Rồng Bayle.',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Elder\'s Hovel (Gravesite Plain DLC)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Elder%27s%20Hovel',
  },
  {
    id: 'er-dlc-talisman-st-trinas-smile',
    name: "St. Trina's Smile",
    nameVi: 'Nụ Cười Trina',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/st_trinas_smile_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bùa hộ mệnh hình nụ cười hoa tím của St. Trina. Tăng +20% sát thương tấn công trong 30 giây khi gây trạng thái Gây Ngủ (Sleep).',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Stone Coffin Fissure (Nhận sau khi hoàn thành Quest Thiollier)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Thiollier',
  },
  {
    id: 'er-dlc-talisman-beloved-stardust',
    name: 'Beloved Stardust',
    nameVi: 'Bụi Sao Yêu Thương',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/beloved_stardust_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bùa phép tối thượng giảm thời gian thi triển phép thuật (Casting Speed) tới mức tối đa nhưng chịu thêm 30% sát thương.',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Cathedral of Manus Metyr (Rước ngọc chuông Count Ymir)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Manus%20Metyr',
  },
  {
    id: 'er-dlc-talisman-golden-braid',
    name: 'Golden Braid',
    nameVi: 'Tóc Vàng Miquella',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/golden_braid_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Lọn tóc bện vàng óng thần thánh. Gia tăng khả năng kháng sát thương Thánh (Holy Negation) cực lớn (+22%). Chống trùm Radahn DLC.',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Shaman Village (Hốc cây cổ thụ trong làng)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Shaman%20Village',
  },
  {
    id: 'er-dlc-talisman-retaliatory-cross-tree',
    name: 'Retaliatory Cross-Tree',
    nameVi: 'Thập Tự Phản Công',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/retaliatory_cross-tree_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bùa hộ mệnh gia tăng +17% sát thương cho các đòn đánh ngay sau khi thực hiện né tránh Roll hoặc Backstep.',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Shadow Keep (Thưởng bởi Leda sau khi giúp cô hạ Hornsent)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Leda',
  },
  {
    id: 'er-dlc-talisman-lacerating-cross-tree',
    name: 'Lacerating Cross-Tree',
    nameVi: 'Thập Tự Lao Tới',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/lacerating_cross-tree_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bùa hộ mệnh gia tăng +15% sát thương cho các đòn đánh lao chạy (Dash/Dash Attacks).',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Shadow Keep (Thưởng bởi Leda sau khi giúp cô hạ Ansbach)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Leda',
  },
  {
    id: 'er-dlc-talisman-pearl-drake-3',
    name: 'Pearldrake Talisman +3',
    nameVi: 'Bùa Rồng Ngọc Bích +3',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/pearldrake_talisman_3_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bùa hộ mệnh phòng thủ ma thuật tối thượng. Gia tăng kháng toàn bộ sát thương phi vật lý (Phép/Lửa/Sét/Thánh) +11%.',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Storehouse, Unsealed (Shadow Keep DLC)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Shadow%20Keep',
  },
  {
    id: 'er-dlc-talisman-dragoncrest-shield-3',
    name: 'Dragoncrest Shield Talisman +3',
    nameVi: 'Bùa Khiên Rồng +3',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/dragoncrest_shield_talisman_3_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bùa khiên rồng cổ đại gia tăng thêm +20% kháng sát thương vật lý cho nhân vật.',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Ancient Ruins of Rauh (Rương trên tháp đá cổ)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Rauh',
  },
  {
    id: 'er-dlc-talisman-aged-ones-exultation',
    name: "Aged One's Exultation",
    nameVi: 'Khát Máu Cổ Đại',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/aged_ones_exultation_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bùa hộ mệnh gia tăng +20% sát thương tấn công mỗi khi trạng thái Điên Cuồng (Madness) kích hoạt gần kề.',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Abyssal Woods (Hạ gục Winter Lantern quái ngón tay)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Abyssal%20Woods',
  },
  {
    id: 'er-dlc-talisman-shattered-stone',
    name: 'Shattered Stone Talisman',
    nameVi: 'Bùa Đá Vỡ',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/shattered_stone_talisman_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bùa hộ mệnh gia tăng +10% sát thương cho tất cả các đòn đá chân Kick và dẫm đất Stomp.',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Moorth Ruins (Nhặt dưới hố sụt tàn tích)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Moorth%20Ruins',
  },
  {
    id: 'er-dlc-talisman-smithing-talisman',
    name: 'Smithing Talisman',
    nameVi: 'Bùa Thợ Rèn',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/smithing_talisman_talismans_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bùa hộ mệnh gia tăng +10% sát thương cho tất cả các chiêu thức ném vũ khí Smithscript.',
    category: 'talismans',
    subCategory: 'Bùa Cao Cấp (Great Talisman)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Taylew\'s Ruined Forge (Rương nhà lò rèn thợ rèn)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Ruined%20Forge',
  },
];

export const ELDEN_RING_DLC_ITEMS: EldenRingEntity[] = [
  {
    id: 'er-dlc-item-scadutree-fragment',
    name: 'Scadutree Fragment',
    nameVi: 'Mảnh Cây Scadutree',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/scadutree_fragment_dlc_elden_ring_wiki_guide_200px.png',
    description: 'Vật phẩm nâng cấp quan trọng nhất DLC Shadow of the Erdtree. Dùng tại Phước Lành Site of Grace để vĩnh viễn gia tăng sát thương và khả năng chống chịu toàn bộ nhân vật tại Realm of Shadow.',
    category: 'items',
    subCategory: 'Mảnh Scadutree (Scadutree Fragment)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Rải rác khắp vùng đất Shadow Realm (Đặc biệt tại các Bệ Thờ Miquella Cross)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Scadutree%20Fragment',
  },
  {
    id: 'er-dlc-item-revered-spirit-ash',
    name: 'Revered Spirit Ash',
    nameVi: 'Linh Hồn Tôn Kính',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/revered_spirit_ash_dlc_elden_ring_wiki_guide_200px.png',
    description: 'Vật phẩm dâng lên linh hồn. Dùng tại Site of Grace để nâng cấp chỉ số máu và sát thương cho tất cả Spirit Ashes và linh thú cưỡi Torrent trong bản mở rộng.',
    category: 'items',
    subCategory: 'Linh Hồn Tôn Kính (Revered Spirit Ash)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Nhặt trên các bàn thờ thi thể quỳ gối khắp Realm of Shadow',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Revered%20Spirit%20Ash',
  },
  {
    id: 'er-dlc-item-remembrance-impaler',
    name: 'Remembrance of the Impaler',
    nameVi: 'Ký Ưóc Của Messmer Kẻ Xiên Mạng',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/remembrance_of_the_impaler_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Ký ước thần thánh của Messmer. Đổi lấy đại thương Spear of the Impaler hoặc phép thuật Rắn Lửa Rellana.',
    category: 'items',
    subCategory: 'Ký Ước Bán Thần (Remembrance)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Shadow Keep (Đánh bại Messmer the Impaler)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Messmer',
  },
  {
    id: 'er-dlc-item-remembrance-god-lord',
    name: 'Remembrance of a God and a Lord',
    nameVi: 'Ký Ước Thần Vẫn & Chúa Tể (Radahn & Miquella)',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/remembrance_of_a_god_and_a_lord_items_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Ký ước tối cao của Promised Consort Radahn & Miquella. Đổi lấy đại kiếm Greatsword of Radahn hoặc phép thuật Light of Miquella.',
    category: 'items',
    subCategory: 'Ký Ước Bán Thần (Remembrance)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Enir-Ilim (Hạ gục Trùm Cuối Promised Consort Radahn)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Radahn',
  },
];

export const ELDEN_RING_BELL_BEARINGS: EldenRingEntity[] = [
  {
    id: 'er-items-smithing-miner-bell-1',
    name: "Smithing-Stone Miner's Bell Bearing [1]",
    nameVi: 'Lễ Vật Đào Đá Rèn [1]',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/smithing-stone_miners_bell_bearing_1_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Đào Đá Rèn 1. Dùng trao cho Twin Maiden Husks tại Roundtable Hold để mở khóa mua vô hạn Smithing Stone [1] và [2].',
    category: 'items',
    subCategory: 'Ngọc Chuông Thương Nhân (Bell Bearing)',
    expansion: 'Base Game',
    locationHint: 'Raya Lucaria Crystal Tunnel (Thả ra bởi Boss Crystalian)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Raya%20Lucaria%20Crystal%20Tunnel',
    quote: 'Bell bearing of a miner who once dug for smithing stones.',
  },
  {
    id: 'er-items-smithing-miner-bell-2',
    name: "Smithing-Stone Miner's Bell Bearing [2]",
    nameVi: 'Lễ Vật Đào Đá Rèn [2]',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/smithing-stone_miners_bell_bearing_2_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Đào Đá Rèn 2. Dùng trao cho Twin Maiden Husks để mở khóa mua vô hạn Smithing Stone [3] và [4].',
    category: 'items',
    subCategory: 'Ngọc Chuông Thương Nhân (Bell Bearing)',
    expansion: 'Base Game',
    locationHint: 'Sealed Tunnel (Altus Plateau - Rương trong đường hầm ẩn)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Sealed%20Tunnel',
    quote: 'Bell bearing of a miner who once dug for smithing stones.',
  },
];

export const ELDEN_RING_EXTRA_SORCERIES: EldenRingEntity[] = [
  {
    id: 'er-sorceries-rellana-twin-moon',
    name: "Rellana's Twin Moon",
    nameVi: 'Hai Vầng Trăng Của Rellana',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/rellanas_twin_moons_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Ma thuật tối cao của Rellana, Twin Moon Knight. Hóa thân thành hai vầng trăng khuyết đổ ập xuống mặt đất gây sát thương phép bùng nổ diện rộng.',
    category: 'sorceries',
    subCategory: 'Hoàng Gia Carian (Carian Sorcery)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Castle Ensis (Đổi từ Remembrance of the Twin Moon Knight)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Rellana',
    quote: 'Sorcery of Rellana, the Twin Moon Knight.',
  },
  {
    id: 'er-sorceries-impenetrable-thorns',
    name: 'Impenetrable Thorns',
    nameVi: 'Gai Nhọn Bất Xâm',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/impenetrable_thorns_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Triệu hồi gai nhọn màu đỏ thẫm đâm xuyên từ dưới đất lên, gây sát thương xuất huyết (Blood Loss) cực lớn lên mục tiêu.',
    category: 'sorceries',
    subCategory: 'Gai Đỏ Huyết Tộc (Thorn Sorcery)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Shadow Keep (Nhặt tại thi thể tầng trên thành)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Shadow%20Keep',
    quote: 'Scadutree sorcery of the Scadutree avatars.',
  },
  {
    id: 'er-sorceries-fleeting-microcosm',
    name: 'Fleeting Microcosm',
    nameVi: 'Tiểu Vũ Trụ Ngân Hà',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/fleeting_microcosm_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Triệu hồi một tiểu vũ trụ ngân hà thu nhỏ phát nổ gây sóng xung kích trọng lực quét sạch kẻ thù.',
    category: 'sorceries',
    subCategory: 'Ngón Tay Ngân Hà (Finger Sorcery)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Cathedral of Manus Metyr (Đổi từ Count Ymir)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Cathedral%20of%20Manus%20Metyr',
    quote: 'One of the finger sorceries of Count Ymir.',
  },
];

export const ELDEN_RING_EXTRA_INCANTATIONS: EldenRingEntity[] = [
  {
    id: 'er-incantations-flame-cleanse-me',
    name: 'Flame, Cleanse Me',
    nameVi: 'Ngọn Lửa Thanh Tẩy',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/flame_cleanse_me_incantation_elden_ring_wiki_guide_200px.png',
    description: 'Phép thuật hỗ trợ quan trọng nhất game. Dùng ngọn lửa thanh tẩy độc tố (Poison) và tích tụ thối rữa (Scarlet Rot) trong cơ thể.',
    category: 'incantations',
    subCategory: 'Ngọn Lửa Tu Sĩ (Fire Monk/Giants)',
    expansion: 'Base Game',
    locationHint: 'Fire Monk Camp (Liurnia of the Lakes)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Fire%20Monk%20Camp',
    quote: 'One of the incantations of the Fire Monks.',
  },
  {
    id: 'er-incantations-light-of-miquella',
    name: 'Light of Miquella',
    nameVi: 'Ánh Sáng Thánh Miquella',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/light_of_miquella_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Phép thuật ánh sáng thần thánh của Miquella. Dội một luồng sáng thánh giáng xuống hủy diệt diện rộng.',
    category: 'incantations',
    subCategory: 'Ánh Sáng Thánh (Erdtree/Miquella)',
    expansion: 'Shadow of the Erdtree',
    locationHint: 'Enir-Ilim (Đổi từ Remembrance of a God and a Lord)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Enir-Ilim',
    quote: 'An incantation of Miquella the Kind.',
  },
];

export async function fetchEldenRingCategory(
  endpoint: FextralifeCategory,
  limitPerPage: number = 100
): Promise<EldenRingEntity[]> {
  try {
    const firstRes = await fetch(
      `https://eldenring.fanapis.com/api/${endpoint}?limit=${limitPerPage}&page=0`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    let apiDataList: EldenRingApiPayload[] = [];
    if (firstRes.ok) {
      const firstData: EldenRingApiResponse = await firstRes.json();
      const total = firstData.total || (firstData.data ? firstData.data.length : 0);
      apiDataList = [...(firstData.data || [])];

      const totalPages = Math.ceil(total / limitPerPage);
      if (totalPages > 1) {
        const pagePromises = [];
        for (let page = 1; page < totalPages; page++) {
          pagePromises.push(
            fetch(
              `https://eldenring.fanapis.com/api/${endpoint}?limit=${limitPerPage}&page=${page}`,
              { next: { revalidate: REVALIDATE_SECONDS } }
            ).then((res) => (res.ok ? res.json() : { data: [] }))
          );
        }
        const pagesData = await Promise.all(pagePromises);
        pagesData.forEach((pData: EldenRingApiResponse) => {
          if (pData.data && Array.isArray(pData.data)) {
            apiDataList.push(...pData.data);
          }
        });
      }
    }

    // Deduplicate API base game items by name
    const uniqueMap = new Map<string, EldenRingApiPayload>();
    apiDataList.forEach((item) => {
      if (item && item.name && !uniqueMap.has(item.name)) {
        uniqueMap.set(item.name, item);
      }
    });

    const parsedBaseGameItems: EldenRingEntity[] = Array.from(uniqueMap.values()).map((item) => {
      const encodedName = encodeURIComponent(item.name);
      return {
        id: `er-${endpoint}-${item.id}`,
        name: item.name,
        image: item.image || '',
        description: item.description || '',
        category: endpoint,
        subCategory: inferSubCategory(item.name, endpoint),
        expansion: 'Base Game',
        locationHint: item.location || undefined,
        mapLocationUrl: `https://mapgenie.io/elden-ring/maps/the-lands-between?search=${encodedName}`,
        quote: item.quote || undefined,
      };
    });

    // Merge with DLC lists
    const existingNames = new Set(parsedBaseGameItems.map((i) => i.name.toLowerCase()));

    let dlcAdditions: EldenRingEntity[] = [];
    if (endpoint === 'weapons') dlcAdditions = ELDEN_RING_DLC_WEAPONS;
    else if (endpoint === 'armors') dlcAdditions = ELDEN_RING_DLC_ARMORS;
    else if (endpoint === 'talismans') dlcAdditions = ELDEN_RING_DLC_TALISMANS;
    else if (endpoint === 'sorceries') dlcAdditions = ELDEN_RING_EXTRA_SORCERIES;
    else if (endpoint === 'incantations') dlcAdditions = ELDEN_RING_EXTRA_INCANTATIONS;
    else if (endpoint === 'items') dlcAdditions = [...ELDEN_RING_BELL_BEARINGS, ...ELDEN_RING_DLC_ITEMS];

    const filteredDlc = dlcAdditions.filter((d) => !existingNames.has(d.name.toLowerCase()));

    return [...parsedBaseGameItems, ...filteredDlc];
  } catch {
    if (endpoint === 'weapons') return ELDEN_RING_DLC_WEAPONS;
    if (endpoint === 'armors') return ELDEN_RING_DLC_ARMORS;
    if (endpoint === 'talismans') return ELDEN_RING_DLC_TALISMANS;
    if (endpoint === 'sorceries') return ELDEN_RING_EXTRA_SORCERIES;
    if (endpoint === 'incantations') return ELDEN_RING_EXTRA_INCANTATIONS;
    if (endpoint === 'items') return [...ELDEN_RING_BELL_BEARINGS, ...ELDEN_RING_DLC_ITEMS];
    return [];
  }
}

export async function fetchEldenRingItems(): Promise<GameItem[]> {
  const items = await fetchEldenRingCategory('items');
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    description: item.description,
    category: 'Vật Phẩm',
    gameSource: 'Elden Ring',
  }));
}

export async function getEldenRingFullWikiData() {
  const [
    weapons,
    armors,
    shields,
    talismans,
    sorceries,
    incantations,
    ashes,
    items,
    bosses,
    npcs,
    locations,
  ] = await Promise.all([
    fetchEldenRingCategory('weapons'),
    fetchEldenRingCategory('armors'),
    fetchEldenRingCategory('shields'),
    fetchEldenRingCategory('talismans'),
    fetchEldenRingCategory('sorceries'),
    fetchEldenRingCategory('incantations'),
    fetchEldenRingCategory('ashes'),
    fetchEldenRingCategory('items'),
    fetchEldenRingCategory('bosses'),
    fetchEldenRingCategory('npcs'),
    fetchEldenRingCategory('locations'),
  ]);

  return {
    weapons,
    armors,
    shields,
    talismans,
    sorceries,
    incantations,
    ashes,
    items,
    bosses,
    npcs,
    locations,
  };
}

export async function getUnifiedGameItems(): Promise<GameItem[]> {
  const [lolItems, eldenRingItems] = await Promise.all([
    fetchLolItems(),
    fetchEldenRingItems(),
  ]);

  return [...lolItems, ...eldenRingItems];
}
