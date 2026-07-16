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

export async function fetchEldenRingCategory(
  endpoint: FextralifeCategory,
  limit: number = 50
): Promise<EldenRingEntity[]> {
  try {
    const res = await fetch(`https://eldenring.fanapis.com/api/${endpoint}?limit=${limit}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const responseData: EldenRingApiResponse = await res.json();

    return (responseData.data || []).map((item) => {
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
  } catch {
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
    fetchEldenRingCategory('weapons', 40),
    fetchEldenRingCategory('armors', 40),
    fetchEldenRingCategory('shields', 30),
    fetchEldenRingCategory('talismans', 30),
    fetchEldenRingCategory('sorceries', 30),
    fetchEldenRingCategory('incantations', 30),
    fetchEldenRingCategory('ashes', 30),
    fetchEldenRingCategory('items', 40),
    fetchEldenRingCategory('bosses', 40),
    fetchEldenRingCategory('npcs', 40),
    fetchEldenRingCategory('locations', 40),
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
