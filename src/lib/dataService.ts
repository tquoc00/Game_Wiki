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
  image: string;
  description: string;
  category: FextralifeCategory;
  locationHint?: string;
  mapLocationUrl: string;
  quote?: string;
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

export const ELDEN_RING_BELL_BEARINGS: EldenRingEntity[] = [
  {
    id: 'er-items-smithing-miner-bell-1',
    name: "Smithing-Stone Miner's Bell Bearing [1]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/smithing-stone_miners_bell_bearing_1_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Đào Đá Rèn 1. Dùng trao cho Twin Maiden Husks tại Roundtable Hold để mở khóa mua vô hạn Smithing Stone [1] và [2].',
    category: 'items',
    locationHint: 'Raya Lucaria Crystal Tunnel (Thả ra bởi Boss Crystalian)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Raya%20Lucaria%20Crystal%20Tunnel',
    quote: 'Bell bearing of a miner who once dug for smithing stones.',
  },
  {
    id: 'er-items-smithing-miner-bell-2',
    name: "Smithing-Stone Miner's Bell Bearing [2]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/smithing-stone_miners_bell_bearing_2_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Đào Đá Rèn 2. Dùng trao cho Twin Maiden Husks để mở khóa mua vô hạn Smithing Stone [3] và [4].',
    category: 'items',
    locationHint: 'Sealed Tunnel (Altus Plateau - Rương trong đường hầm ẩn)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Sealed%20Tunnel',
    quote: 'Bell bearing of a miner who once dug for smithing stones.',
  },
  {
    id: 'er-items-smithing-miner-bell-3',
    name: "Smithing-Stone Miner's Bell Bearing [3]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/smithing-stone_miners_bell_bearing_3_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Đào Đá Rèn 3. Dùng trao cho Twin Maiden Husks để mở khóa mua vô hạn Smithing Stone [5] và [6].',
    category: 'items',
    locationHint: 'Zamor Ruins (Mountaintops of the Giants - Rương ngầm dưới tàn tích)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Zamor%20Ruins',
    quote: 'Bell bearing of a miner who once dug for smithing stones.',
  },
  {
    id: 'er-items-smithing-miner-bell-4',
    name: "Smithing-Stone Miner's Bell Bearing [4]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/smithing-stone_miners_bell_bearing_4_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Đào Đá Rèn 4. Dùng trao cho Twin Maiden Husks để mở khóa mua vô hạn Smithing Stone [7] và [8].',
    category: 'items',
    locationHint: 'Crumbling Farum Azula (Thả ra sau khi đánh bại Godskin Duo)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Godskin%20Duo',
    quote: 'Bell bearing of a miner who once dug for smithing stones.',
  },
  {
    id: 'er-items-somber-miner-bell-1',
    name: "Somberstone Miner's Bell Bearing [1]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/somberstone_miners_bell_bearing_1_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Đào Đá U Ám 1. Dùng trao cho Twin Maiden Husks để mở khóa mua vô hạn Somber Smithing Stone [1] và [2].',
    category: 'items',
    locationHint: 'Sellia Crystal Tunnel (Caelid - Thả ra bởi Fallingstar Beast)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Sellia%20Crystal%20Tunnel',
    quote: 'Bell bearing of a miner who once dug for somber smithing stones.',
  },
  {
    id: 'er-items-somber-miner-bell-2',
    name: "Somberstone Miner's Bell Bearing [2]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/somberstone_miners_bell_bearing_2_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Đào Đá U Ám 2. Dùng trao cho Twin Maiden Husks để mở khóa mua vô hạn Somber Smithing Stone [3] và [4].',
    category: 'items',
    locationHint: 'Altus Tunnel (Altus Plateau - Thả ra bởi Crystalian Spear & Ringblade Duo)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Altus%20Tunnel',
    quote: 'Bell bearing of a miner who once dug for somber smithing stones.',
  },
  {
    id: 'er-items-somber-miner-bell-3',
    name: "Somberstone Miner's Bell Bearing [3]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/somberstone_miners_bell_bearing_3_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Đào Đá U Ám 3. Dùng trao cho Twin Maiden Husks để mở khóa mua vô hạn Somber Smithing Stone [5] và [6].',
    category: 'items',
    locationHint: 'First Church of Marika (Mountaintops of the Giants - Nhặt trên xác ngoài nhà thờ)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=First%20Church%20of%20Marika',
    quote: 'Bell bearing of a miner who once dug for somber smithing stones.',
  },
  {
    id: 'er-items-somber-miner-bell-4',
    name: "Somberstone Miner's Bell Bearing [4]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/somberstone_miners_bell_bearing_4_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Đào Đá U Ám 4. Dùng trao cho Twin Maiden Husks để mở khóa mua vô hạn Somber Smithing Stone [7] và [8].',
    category: 'items',
    locationHint: 'Crumbling Farum Azula (Nhặt trên xác chết mỏm đá Tempest-Facing Balcony)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Tempest-Facing%20Balcony',
    quote: 'Bell bearing of a miner who once dug for somber smithing stones.',
  },
  {
    id: 'er-items-somber-miner-bell-5',
    name: "Somberstone Miner's Bell Bearing [5]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/somberstone_miners_bell_bearing_5_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Đào Đá U Ám 5. Dùng trao cho Twin Maiden Husks để mở khóa mua vô hạn Somber Smithing Stone [9].',
    category: 'items',
    locationHint: 'Crumbling Farum Azula (Nhặt tại bệ thờ gần Dragon Temple Lift)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Dragon%20Temple%20Lift',
    quote: 'Bell bearing of a miner who once dug for somber smithing stones.',
  },
  {
    id: 'er-items-glovewort-picker-bell-1',
    name: "Glovewort Picker's Bell Bearing [1]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/glovewort_pickers_bell_bearing_1_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Hái Hoa Linh Mộ 1. Trao cho Twin Maiden Husks để mở khóa mua Grave Glovewort [1], [2], [3].',
    category: 'items',
    locationHint: 'Wyndham Catacombs (Altus Plateau - Thả ra bởi Erdtree Burial Watchdog)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Wyndham%20Catacombs',
    quote: 'Bell bearing of a picker of grave gloveworts.',
  },
  {
    id: 'er-items-glovewort-picker-bell-2',
    name: "Glovewort Picker's Bell Bearing [2]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/glovewort_pickers_bell_bearing_2_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Hái Hoa Linh Mộ 2. Trao cho Twin Maiden Husks để mở khóa mua Grave Glovewort [4], [5], [6].',
    category: 'items',
    locationHint: "Giants' Mountaintop Catacombs (Mountaintops of the Giants - Thả ra bởi Ulcerated Tree Spirit)",
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Giants%27%20Mountaintop%20Catacombs',
    quote: 'Bell bearing of a picker of grave gloveworts.',
  },
  {
    id: 'er-items-glovewort-picker-bell-3',
    name: "Glovewort Picker's Bell Bearing [3]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/glovewort_pickers_bell_bearing_3_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Hái Hoa Linh Mộ 3. Trao cho Twin Maiden Husks để mở khóa mua Grave Glovewort [7], [8], [9].',
    category: 'items',
    locationHint: 'Crumbling Farum Azula (Nhặt trên hồ nước đầm lầy gần Crumbing Grave Site of Grace)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Crumbling%20Farum%20Azula',
    quote: 'Bell bearing of a picker of grave gloveworts.',
  },
  {
    id: 'er-items-ghost-glovewort-picker-bell-1',
    name: "Ghost Glovewort Picker's Bell Bearing [1]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/ghost_glovewort_pickers_bell_bearing_1_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Hái Hoa U Linh 1. Trao cho Twin Maiden Husks để mở khóa mua Ghost Glovewort [1], [2], [3].',
    category: 'items',
    locationHint: 'Nokron, Eternal City (Nhặt tại thi thể lối vào quảng trường Nokron)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Nokron%2C%20Eternal%20City',
    quote: 'Bell bearing of a picker of ghost gloveworts.',
  },
  {
    id: 'er-items-ghost-glovewort-picker-bell-2',
    name: "Ghost Glovewort Picker's Bell Bearing [2]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/ghost_glovewort_pickers_bell_bearing_2_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Hái Hoa U Linh 2. Trao cho Twin Maiden Husks để mở khóa mua Ghost Glovewort [4], [5], [6].',
    category: 'items',
    locationHint: 'Nokstella, Eternal City (Nhặt trong rương gỗ căn phòng nhỏ)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Nokstella%2C%20Eternal%20City',
    quote: 'Bell bearing of a picker of ghost gloveworts.',
  },
  {
    id: 'er-items-ghost-glovewort-picker-bell-3',
    name: "Ghost Glovewort Picker's Bell Bearing [3]",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/ghost_glovewort_pickers_bell_bearing_3_elden_ring_wiki_guide_200px.png',
    description: 'Lễ Vật Hái Hoa U Linh 3. Trao cho Twin Maiden Husks để mở khóa mua Ghost Glovewort [7], [8], [9].',
    category: 'items',
    locationHint: 'Elphael, Brace of the Haligtree (Nhặt tại khu nghĩa trang hẻm núi)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Elphael%2C%20Brace%20of%20the%20Haligtree',
    quote: 'Bell bearing of a picker of ghost gloveworts.',
  },
  {
    id: 'er-items-bone-peddler-bell',
    name: "Bone Peddler's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/bone_peddlers_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Ngọc Chuông Thương Nhân Xương. Dùng trao cho Twin Maiden Husks để mua Thin Animal Bones và Hefty Beast Bones.',
    category: 'items',
    locationHint: "Warmaster's Shack (Stormhill - Thả ra khi hạ gục Bell Bearing Hunter ban đêm)",
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Warmaster%27s%20Shack',
    quote: 'Left by the Bell Bearing Hunter who appears at night.',
  },
  {
    id: 'er-items-meat-peddler-bell',
    name: "Meat Peddler's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/meat_peddlers_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Ngọc Chuông Thương Nhân Thịt. Dùng trao cho Twin Maiden Husks để mua Lump of Meat, Sliver of Meat, Turtle Neck Meat.',
    category: 'items',
    locationHint: 'Church of Vows (Liurnia - Thả ra khi hạ gục Bell Bearing Hunter ban đêm)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Church%20of%20Vows',
    quote: 'Left by the Bell Bearing Hunter who appears at night.',
  },
  {
    id: 'er-items-medicine-peddler-bell',
    name: "Medicine Peddler's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/medicine_peddlers_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Ngọc Chuông Thương Nhân Thuốc. Dùng trao cho Twin Maiden Husks để mua Neutralizing, Stanching, Stimulating, Thawfrost Boluses.',
    category: 'items',
    locationHint: "Hermit Merchant's Shack (Altus Plateau - Thả ra khi hạ gục Bell Bearing Hunter ban đêm)",
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Hermit%20Merchant%27s%20Shack',
    quote: 'Left by the Bell Bearing Hunter who appears at night.',
  },
  {
    id: 'er-items-gravity-stone-peddler-bell',
    name: "Gravity Stone Peddler's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/gravity_stone_peddlers_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Ngọc Chuông Thương Nhân Đá Trọng Lực. Dùng trao cho Twin Maiden Husks để mua Gravity Stone Fan & Chunk.',
    category: 'items',
    locationHint: "Isolated Merchant's Shack (Dragonbarrow - Thả ra khi hạ gục Bell Bearing Hunter ban đêm)",
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Isolated%20Merchant%27s%20Shack',
    quote: 'Left by the Bell Bearing Hunter who appears at night.',
  },
  {
    id: 'er-items-bernahl-bell',
    name: "Bernahl's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/bernahl_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mở khóa mua các tuyệt kỹ Ashes of War của Knight Bernahl.',
    category: 'items',
    locationHint: "Warmaster's Shack / Crumbling Farum Azula (Rớt ra khi Knight Bernahl qua đời)",
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Knight%20Bernahl',
  },
  {
    id: 'er-items-corhyn-bell',
    name: "Corhyn's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/corhyns_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mở khóa mua các phép Incantation của Brother Corhyn.',
    category: 'items',
    locationHint: 'Altus Plateau / Leyndell (Rớt ra khi Brother Corhyn qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Brother%20Corhyn',
  },
  {
    id: 'er-items-d-bell',
    name: "D's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/ds_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mở khóa mua phép thuật của D, Hunter of the Dead.',
    category: 'items',
    locationHint: 'Roundtable Hold (Rớt ra sau khi nhiệm vụ Fia hoàn tất)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Roundtable%20Hold',
  },
  {
    id: 'er-items-gowry-bell',
    name: "Gowry's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/gowrys_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mở khóa mua Sorceries & Incantations của Gowry.',
    category: 'items',
    locationHint: "Gowry's Shack (Caelid - Rớt ra khi Gowry qua đời)",
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Gowry%27s%20Shack',
  },
  {
    id: 'er-items-iji-bell',
    name: "Iji's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/ijis_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mua các cấp đá Somber Smithing Stone từ Iji.',
    category: 'items',
    locationHint: 'Road to the Manor (Liurnia - Rớt ra khi Iji qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Road%20to%20the%20Manor',
  },
  {
    id: 'er-items-kale-bell',
    name: "Kale's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/kales_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mua toàn bộ các món đồ của Merchant Kalé.',
    category: 'items',
    locationHint: 'Church of Elleh (Limgrave - Rớt ra khi Merchant Kalé qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Church%20of%20Elleh',
  },
  {
    id: 'er-items-miriel-bell',
    name: "Miriel's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/miriels_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mua toàn bộ ma thuật và phép thuật của Miriel, Pastor of Vows.',
    category: 'items',
    locationHint: 'Church of Vows (Liurnia - Rớt ra khi Pastor Miriel qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Church%20of%20Vows',
  },
  {
    id: 'er-items-thops-bell',
    name: "Thops's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/thopss_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mua ma thuật của Sorcerer Thops.',
    category: 'items',
    locationHint: 'Academy of Raya Lucaria (Rớt ra khi Thops qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Academy%20of%20Raya%20Lucaria',
  },
  {
    id: 'er-items-seluvis-bell',
    name: "Seluvis's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/seluviss_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mua các ma thuật cao cấp của Preceptor Seluvis.',
    category: 'items',
    locationHint: "Seluvis's Rise (Three Sisters - Rớt ra khi Seluvis qua đời)",
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Seluvis%27s%20Rise',
  },
  {
    id: 'er-items-sellen-bell',
    name: "Sellen's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/sellens_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mua ma thuật của Sorceress Sellen.',
    category: 'items',
    locationHint: 'Waypoint Ruins (Limgrave - Rớt ra khi Sorceress Sellen qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Waypoint%20Ruins',
  },
  {
    id: 'er-items-rogier-bell',
    name: "Rogier's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/rogiers_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mua các chiêu Ashes of War của Spellblade Rogier.',
    category: 'items',
    locationHint: 'Roundtable Hold (Rớt ra sau khi Rogier qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Roundtable%20Hold',
  },
  {
    id: 'er-items-pidia-bell',
    name: "Pidia's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/pidias_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mua đồ vật tư của Pidia, Carian Servant.',
    category: 'items',
    locationHint: 'Caria Manor (Liurnia - Rớt ra khi Pidia qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Caria%20Manor',
  },
  {
    id: 'er-items-dung-eater-bell',
    name: "Dung Eater's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/dung_eaters_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mở khóa vật tư của Dung Eater.',
    category: 'items',
    locationHint: 'Subterranean Shunning-Grounds (Leyndell - Rớt ra khi Dung Eater qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Subterranean%20Shunning-Grounds',
  },
  {
    id: 'er-items-boggart-bell',
    name: "Blackguard's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/blackguards_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mua Tôm Nướng & Cua Nướng từ Blackguard Big Boggart.',
    category: 'items',
    locationHint: 'Boiled Prawn Shack / Leyndell moat (Rớt ra khi Big Boggart qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Boiled%20Prawn%20Shack',
  },
  {
    id: 'er-items-yura-bell',
    name: "Yura's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/yuras_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mua vật tư của Bloody Finger Hunter Yura.',
    category: 'items',
    locationHint: 'Second Church of Marika / Zamor Ruins (Rớt ra khi Yura qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Second%20Church%20of%20Marika',
  },
  {
    id: 'er-items-nomadic-merchant-bell',
    name: "Nomadic Merchant's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/nomadic_merchants_bell_bearing_1_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mở lại gian hàng mua sắm của các Thương Nhân Du Mục.',
    category: 'items',
    locationHint: 'Lands Between (Rớt ra từ bất kỳ Thương nhân du mục nào khi qua đời)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Nomadic%20Merchant',
  },
  {
    id: 'er-items-isolated-merchant-bell',
    name: "Isolated Merchant's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/isolated_merchants_bell_bearing_1_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mở mua hàng của Thương Nhân Biệt Lập.',
    category: 'items',
    locationHint: 'Weeping Peninsula / Raya Lucaria / Dragonbarrow (Rớt ra từ Thương nhân biệt lập)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Isolated%20Merchant',
  },
  {
    id: 'er-items-hermit-merchant-bell',
    name: "Hermit Merchant's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/hermit_merchants_bell_bearing_1_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mở mua hàng của Thương Nhân Ẩn Sĩ.',
    category: 'items',
    locationHint: 'Ainsel River / Mount Gelmir / Leyndell Outskirts (Rớt ra từ Thương nhân ẩn sĩ)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Hermit%20Merchant',
  },
  {
    id: 'er-items-abandoned-merchant-bell',
    name: "Abandoned Merchant's Bell Bearing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/abandoned_merchants_bell_bearing_elden_ring_wiki_guide_200px.png',
    description: 'Trao cho Twin Maiden Husks để mua hàng của Thương Nhân Hoang Vắng Siofra River.',
    category: 'items',
    locationHint: 'Siofra River (Rớt ra từ Thương nhân hoang vắng Siofra River)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Siofra%20River',
  },
];

export const ELDEN_RING_EXTRA_SORCERIES: EldenRingEntity[] = [
  {
    id: 'er-sorceries-rellana-twin-moon',
    name: "Rellana's Twin Moon",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/rellanas_twin_moons_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Ma thuật tối cao của Rellana, Twin Moon Knight. Hóa thân thành hai vầng trăng khuyết đổ ập xuống mặt đất gây sát thương phép bùng nổ diện rộng.',
    category: 'sorceries',
    locationHint: 'Castle Ensis (Shadow of the Erdtree DLC - Đổi từ Remembrance of the Twin Moon Knight)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Rellana',
    quote: 'Sorcery of Rellana, the Twin Moon Knight.',
  },
  {
    id: 'er-sorceries-impenetrable-thorns',
    name: 'Impenetrable Thorns',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/impenetrable_thorns_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Triệu hồi gai nhọn màu đỏ thẫm đâm xuyên từ dưới đất lên, gây sát thương xuất huyết (Blood Loss) cực lớn lên mục tiêu.',
    category: 'sorceries',
    locationHint: 'Shadow Keep (Shadow of the Erdtree DLC - Nhặt tại thi thể tầng trên thành)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Shadow%20Keep',
    quote: 'Scadutree sorcery of the Scadutree avatars.',
  },
  {
    id: 'er-sorceries-fleeting-microcosm',
    name: 'Fleeting Microcosm',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/fleeting_microcosm_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Triệu hồi một tiểu vũ trụ ngân hà thu nhỏ phát nổ gây sóng xung kích trọng lực quét sạch kẻ thù.',
    category: 'sorceries',
    locationHint: 'Cathedral of Manus Metyr (Shadow of the Erdtree DLC - Đổi từ Count Ymir)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Cathedral%20of%20Manus%20Metyr',
    quote: 'One of the finger sorceries of Count Ymir.',
  },
  {
    id: 'er-sorceries-gravitational-missile',
    name: 'Gravitational Missile',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/gravitational_missile_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bắn ra cầu năng lượng trọng lực tím hút kẻ thù vào tâm trước khi phát nổ dứt điểm.',
    category: 'sorceries',
    locationHint: 'Hinterland (Shadow of the Erdtree DLC - Thả ra bởi Commander Gaius)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Commander%20Gaius',
    quote: 'Gravity sorcery used by Commander Gaius.',
  },
  {
    id: 'er-sorceries-blades-of-stone',
    name: 'Blades of Stone',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/blades_of_stone_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Phép thuật trọng lực của Trùm Cuối DLC. Tạo ra vô số lưỡi đá sắc nhọn đâm vút từ lòng đất.',
    category: 'sorceries',
    locationHint: 'Enir-Ilim (Shadow of the Erdtree DLC - Đổi từ Remembrance of a God and a Lord)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Enir-Ilim',
  },
  {
    id: 'er-sorceries-vortex-of-putrescence',
    name: 'Vortex of Putrescence',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/vortex_of_putrescence_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Phóng ra các làn sóng bùn ma thuật thối rữa màu lam thiêu đốt kẻ địch bằng ngọn lửa băng giá.',
    category: 'sorceries',
    locationHint: 'Stone Coffin Fissure (Shadow of the Erdtree DLC - Đổi từ Putrescent Knight)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Putrescent%20Knight',
  },
  {
    id: 'er-sorceries-miriam-vanishing',
    name: "Miriam's Vanishing",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/miriams_vanishing_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Biến mất trong màn sương ảo ảnh và tức thời dịch chuyển đến vị trí bất ngờ đằng sau kẻ thù.',
    category: 'sorceries',
    locationHint: 'Cathedral of Manus Metyr (Shadow of the Erdtree DLC - Mua từ Count Ymir)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Count%20Ymir',
  },
  {
    id: 'er-sorceries-glintstone-nail',
    name: 'Glintstone Nail',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/glintstone_nail_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bắn ra đinh ma thuật đá phát sáng đuổi mục tiêu với tốc độ cao.',
    category: 'sorceries',
    locationHint: 'Cathedral of Manus Metyr (Shadow of the Erdtree DLC - Mua từ Count Ymir)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Cathedral%20of%20Manus%20Metyr',
  },
  {
    id: 'er-sorceries-glintstone-nails',
    name: 'Glintstone Nails',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/glintstone_nails_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bắn ra chùm 3 đinh ma thuật đá phát sáng truy đuổi mục tiêu song song.',
    category: 'sorceries',
    locationHint: 'Cathedral of Manus Metyr (Shadow of the Erdtree DLC - Mua từ Count Ymir sau chuỗi nhiệm vụ)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Cathedral%20of%20Manus%20Metyr',
  },
  {
    id: 'er-sorceries-mantle-of-thorns',
    name: 'Mantle of Thorns',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/mantle_of_thorns_sorceries_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bao phủ cơ thể bằng lớp áo gai huyết tộc gây sát thương gai nhọn lên bất kỳ ai chạm vào.',
    category: 'sorceries',
    locationHint: 'Shadow Keep (Shadow of the Erdtree DLC)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Shadow%20Keep',
  },
];

export const ELDEN_RING_EXTRA_INCANTATIONS: EldenRingEntity[] = [
  {
    id: 'er-incantations-flame-cleanse-me',
    name: 'Flame, Cleanse Me',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/flame_cleanse_me_incantation_elden_ring_wiki_guide_200px.png',
    description: 'Phép thuật hỗ trợ quan trọng nhất game. Dùng ngọn lửa thanh tẩy độc tố (Poison) và tích tụ thối rữa (Scarlet Rot) trong cơ thể.',
    category: 'incantations',
    locationHint: 'Fire Monk Camp (Liurnia of the Lakes - Nhặt trên thi thể trại Tu sĩ Lửa)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Fire%20Monk%20Camp',
    quote: 'One of the incantations of the Fire Monks.',
  },
  {
    id: 'er-incantations-light-of-miquella',
    name: 'Light of Miquella',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/light_of_miquella_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Phép thuật ánh sáng thần thánh của Miquella. Dội một luồng sáng thánh giáng xuống hủy diệt diện rộng.',
    category: 'incantations',
    locationHint: 'Enir-Ilim (Shadow of the Erdtree DLC - Đổi từ Remembrance of a God and a Lord)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Enir-Ilim',
    quote: 'An incantation of Miquella the Kind.',
  },
  {
    id: 'er-incantations-knights-lightning-spear',
    name: "Knight's Lightning Spear",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/knights_lightning_spear_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Phép sét cổ đại nâng cấp của Hiệp Sĩ. Bắn thương sét chính kèm 4 tia sét bổ sung bay song song.',
    category: 'incantations',
    locationHint: 'Scadu Altus (Shadow of the Erdtree DLC - Nhặt tại Scorpion River Catacombs)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Scorpion%20River%20Catacombs',
  },
  {
    id: 'er-incantations-fire-serpent',
    name: 'Fire Serpent',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/fire_serpent_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Tạo ra rắn lửa rực cháy uốn lượn truy đuổi kẻ địch cực kỳ linh hoạt.',
    category: 'incantations',
    locationHint: 'Shadow Keep (Shadow of the Erdtree DLC - Nhặt tại khu tháp quan sát)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Shadow%20Keep',
  },
  {
    id: 'er-incantations-midra-flame-of-frenzy',
    name: "Midra's Flame of Frenzy",
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/midras_flame_of_frenzy_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Phép ngọn lửa điên loạn của Midra, Lord of Frenzied Flame. Phun trào ngọn lửa vàng điên dại hủy diệt lý trí kẻ thù.',
    category: 'incantations',
    locationHint: 'Midra\'s Manse (Abyssal Woods - Đổi từ Remembrance of the Lord of Frenzied Flame)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Midra%27s%20Manse',
  },
  {
    id: 'er-incantations-furious-blade-of-ansbach',
    name: 'Furious Blade of Ansbach',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/furious_blade_of_ansbach_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Lưỡi kiếm huyết huyết Ma Tộc của Sir Ansbach. Vung đường chém máu hình lưỡi liềm gây chảy máu dồn dập.',
    category: 'incantations',
    locationHint: 'Enir-Ilim (Shadow of the Erdtree DLC - Nhận sau khi hoàn thành Quest Ansbach)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Ansbach',
  },
  {
    id: 'er-incantations-minor-erdtree',
    name: 'Minor Erdtree',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/minor_erdtree_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Triệu hồi cây thần Erdtree thu nhỏ liên tục hồi máu cho người thi triển và tất cả đồng đội xung quanh.',
    category: 'incantations',
    locationHint: 'Shaman Village (Shadow of the Erdtree DLC - Nhặt tại cánh đồng hoa)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Shaman%20Village',
  },
  {
    id: 'er-incantations-spira',
    name: 'Spira',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/spira_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Tạo ra luồng cột xoáy ánh sáng thánh bùng nổ liên tiếp ngay dưới chân đối phương.',
    category: 'incantations',
    locationHint: 'Enir-Ilim (Shadow of the Erdtree DLC - Nhặt tại ban công tháp cao)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Enir-Ilim',
  },
  {
    id: 'er-incantations-pest-thread-spears',
    name: 'Pest-Thread Spears',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/pest-thread_spears_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bắn ra hai ngọn giáo tơ quỷ khổng lồ xuyên thấu qua thân xác các kẻ thù to lớn.',
    category: 'incantations',
    locationHint: 'Rauh Base (Shadow of the Erdtree DLC - Nhặt tại nhà hoang sát đầm lầy)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Rauh%20Base',
  },
  {
    id: 'er-incantations-electrocharge',
    name: 'Electrocharge',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/electrocharge_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Tích điện vào cơ thể liên tục phóng ra các tia sét nhỏ giật các mục tiêu đứng gần.',
    category: 'incantations',
    locationHint: 'Fog Rift Catacombs (Shadow of the Erdtree DLC - Nhặt tại khu bẫy chông)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Fog%20Rift%20Catacombs',
  },
  {
    id: 'er-incantations-rain-of-fire',
    name: 'Rain of Fire',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/rain_of_fire_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Tạo cơn mưa lửa đỏ giội xuống từ trên cao đốt cháy khu vực rộng lớn.',
    category: 'incantations',
    locationHint: 'Castle Ensis (Shadow of the Erdtree DLC - Giải đố tháp Salza)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Castle%20Ensis',
  },
  {
    id: 'er-incantations-heal-from-afar',
    name: 'Heal from Afar',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/heal_from_afar_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bắn ra cầu phép thuật hồi lượng máu lớn tức thì cho đồng đội từ khoảng cách rất xa.',
    category: 'incantations',
    locationHint: 'Scadu Altus (Shadow of the Erdtree DLC - Nhặt dưới chân cây cổ thụ)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Scadu%20Altus',
  },
  {
    id: 'er-incantations-roar-of-rugalea',
    name: 'Roar of Rugalea',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/roar_of_rugalea_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Biến hình thành gấu khổng lồ rống lên tiếng gầm chấn động làm ngã gục mọi đối thủ.',
    category: 'incantations',
    locationHint: 'Rauh Base (Shadow of the Erdtree DLC - Hạ gục Rugalea the Great Red Bear)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Rugalea',
  },
  {
    id: 'er-incantations-wrath-from-afar',
    name: 'Wrath from Afar',
    image: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/wrath_from_afar_incantations_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png',
    description: 'Bắn cầu xung kích thánh nổ tung đẩy lùi kẻ thù từ khoảng cách xa.',
    category: 'incantations',
    locationHint: 'Scadu Altus (Shadow of the Erdtree DLC - Nhặt trong rương nhà tù ngầm)',
    mapLocationUrl: 'https://mapgenie.io/elden-ring/maps/the-lands-between?search=Scadu%20Altus',
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
    if (!firstRes.ok) return endpoint === 'items' ? ELDEN_RING_BELL_BEARINGS : [];
    const firstData: EldenRingApiResponse = await firstRes.json();
    const total = firstData.total || (firstData.data ? firstData.data.length : 0);
    const allData: EldenRingApiPayload[] = [...(firstData.data || [])];

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
          allData.push(...pData.data);
        }
      });
    }

    // Deduplicate items by name to avoid redundant entries
    const uniqueMap = new Map<string, EldenRingApiPayload>();
    allData.forEach((item) => {
      if (item && item.name && !uniqueMap.has(item.name)) {
        uniqueMap.set(item.name, item);
      }
    });

    const parsedItems: EldenRingEntity[] = Array.from(uniqueMap.values()).map((item) => {
      const encodedName = encodeURIComponent(item.name);
      return {
        id: `er-${endpoint}-${item.id}`,
        name: item.name,
        image: item.image || '',
        description: item.description || '',
        category: endpoint,
        locationHint: item.location || undefined,
        mapLocationUrl: `https://mapgenie.io/elden-ring/maps/the-lands-between?search=${encodedName}`,
        quote: item.quote || undefined,
      };
    });

    if (endpoint === 'items') {
      const existingNames = new Set(parsedItems.map((i) => i.name.toLowerCase()));
      const extraBellBearings = ELDEN_RING_BELL_BEARINGS.filter(
        (b) => !existingNames.has(b.name.toLowerCase())
      );
      return [...parsedItems, ...extraBellBearings];
    }

    if (endpoint === 'sorceries') {
      const existingNames = new Set(parsedItems.map((i) => i.name.toLowerCase()));
      const extraSorceries = ELDEN_RING_EXTRA_SORCERIES.filter(
        (s) => !existingNames.has(s.name.toLowerCase())
      );
      return [...parsedItems, ...extraSorceries];
    }

    if (endpoint === 'incantations') {
      const existingNames = new Set(parsedItems.map((i) => i.name.toLowerCase()));
      const extraIncantations = ELDEN_RING_EXTRA_INCANTATIONS.filter(
        (inc) => !existingNames.has(inc.name.toLowerCase())
      );
      return [...parsedItems, ...extraIncantations];
    }

    return parsedItems;
  } catch {
    if (endpoint === 'items') return ELDEN_RING_BELL_BEARINGS;
    if (endpoint === 'sorceries') return ELDEN_RING_EXTRA_SORCERIES;
    if (endpoint === 'incantations') return ELDEN_RING_EXTRA_INCANTATIONS;
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
