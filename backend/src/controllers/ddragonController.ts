import { Request, Response } from 'express';

const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com';
const CDRAGON_BASE = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1';
const LOCALE = 'vi_VN';

// In-memory cache to avoid hammering Riot's CDN
let versionCache: { version: string; fetchedAt: number } | null = null;
let championsCache: { data: any; version: string; fetchedAt: number } | null = null;
let itemsCache: { data: any; version: string; fetchedAt: number } | null = null;
let perksCache: { data: any; fetchedAt: number } | null = null;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

/**
 * Get the latest DDragon patch version
 */
async function getLatestVersion(): Promise<string> {
  if (versionCache && Date.now() - versionCache.fetchedAt < CACHE_TTL) {
    return versionCache.version;
  }

  const res = await fetch(`${DDRAGON_BASE}/api/versions.json`);
  if (!res.ok) throw new Error('Failed to fetch DDragon versions');

  const versions: string[] = await res.json();
  const latest = versions[0];

  versionCache = { version: latest, fetchedAt: Date.now() };
  return latest;
}

/**
 * GET /api/ddragon/version
 * Returns the current DDragon patch version
 */
export async function getDDragonVersion(req: Request, res: Response) {
  try {
    const version = await getLatestVersion();
    return res.json({ version });
  } catch (error: any) {
    console.error('Error fetching DDragon version:', error);
    return res.status(500).json({ error: 'Không thể lấy phiên bản DDragon.' });
  }
}

/**
 * GET /api/ddragon/champions
 * Returns all LoL champions with Vietnamese localization
 */
export async function getChampions(req: Request, res: Response) {
  try {
    const version = await getLatestVersion();

    // Return cached data if version matches and not expired
    if (championsCache && championsCache.version === version && Date.now() - championsCache.fetchedAt < CACHE_TTL) {
      return res.json(championsCache.data);
    }

    const url = `${DDRAGON_BASE}/cdn/${version}/data/${LOCALE}/champion.json`;
    const apiRes = await fetch(url);
    if (!apiRes.ok) throw new Error(`DDragon API returned ${apiRes.status}`);

    const raw = await apiRes.json();

    // Transform into a cleaner format for our wiki
    const champions = Object.values(raw.data).map((champ: any) => ({
      id: champ.id,
      key: champ.key,
      name: champ.name,
      title: champ.title,
      blurb: champ.blurb,
      tags: champ.tags,
      partype: champ.partype,
      stats: champ.stats,
      image: {
        icon: `${DDRAGON_BASE}/cdn/${version}/img/champion/${champ.image.full}`,
        splash: `${DDRAGON_BASE}/cdn/img/champion/splash/${champ.id}_0.jpg`,
        loading: `${DDRAGON_BASE}/cdn/img/champion/loading/${champ.id}_0.jpg`,
      },
    }));

    const responseData = {
      version,
      locale: LOCALE,
      count: champions.length,
      champions,
    };

    championsCache = { data: responseData, version, fetchedAt: Date.now() };
    return res.json(responseData);
  } catch (error: any) {
    console.error('Error fetching DDragon champions:', error);
    return res.status(500).json({ error: 'Không thể tải danh sách tướng từ DDragon.' });
  }
}

/**
 * GET /api/ddragon/champions/:championId
 * Returns detailed data for a single champion (skills, skins, lore, etc.)
 */
export async function getChampionDetail(req: Request, res: Response) {
  try {
    const { championId } = req.params;
    const version = await getLatestVersion();

    const url = `${DDRAGON_BASE}/cdn/${version}/data/${LOCALE}/champion/${championId}.json`;
    const apiRes = await fetch(url);
    if (!apiRes.ok) {
      return res.status(404).json({ error: `Không tìm thấy tướng: ${championId}` });
    }

    const raw = await apiRes.json();
    const champ = Object.values(raw.data)[0] as any;

    const champion = {
      id: champ.id,
      key: champ.key,
      name: champ.name,
      title: champ.title,
      lore: champ.lore,
      blurb: champ.blurb,
      tags: champ.tags,
      partype: champ.partype,
      info: champ.info,
      stats: champ.stats,
      image: {
        icon: `${DDRAGON_BASE}/cdn/${version}/img/champion/${champ.image.full}`,
        splash: `${DDRAGON_BASE}/cdn/img/champion/splash/${champ.id}_0.jpg`,
        loading: `${DDRAGON_BASE}/cdn/img/champion/loading/${champ.id}_0.jpg`,
      },
      skins: champ.skins?.map((skin: any) => ({
        id: skin.id,
        num: skin.num,
        name: skin.name,
        splash: `${DDRAGON_BASE}/cdn/img/champion/splash/${champ.id}_${skin.num}.jpg`,
        loading: `${DDRAGON_BASE}/cdn/img/champion/loading/${champ.id}_${skin.num}.jpg`,
      })),
      spells: champ.spells?.map((spell: any) => ({
        id: spell.id,
        name: spell.name,
        description: spell.description,
        tooltip: spell.tooltip,
        cooldown: spell.cooldownBurn,
        cost: spell.costBurn,
        range: spell.rangeBurn,
        image: `${DDRAGON_BASE}/cdn/${version}/img/spell/${spell.image.full}`,
      })),
      passive: champ.passive
        ? {
            name: champ.passive.name,
            description: champ.passive.description,
            image: `${DDRAGON_BASE}/cdn/${version}/img/passive/${champ.passive.image.full}`,
          }
        : null,
      allytips: champ.allytips,
      enemytips: champ.enemytips,
    };

    return res.json({ version, champion });
  } catch (error: any) {
    console.error('Error fetching champion detail:', error);
    return res.status(500).json({ error: 'Không thể tải thông tin chi tiết tướng.' });
  }
}

/**
 * GET /api/ddragon/items
 * Returns all LoL items with Vietnamese localization
 */
export async function getItems(req: Request, res: Response) {
  try {
    const version = await getLatestVersion();

    if (itemsCache && itemsCache.version === version && Date.now() - itemsCache.fetchedAt < CACHE_TTL) {
      return res.json(itemsCache.data);
    }

    const url = `${DDRAGON_BASE}/cdn/${version}/data/${LOCALE}/item.json`;
    const apiRes = await fetch(url);
    if (!apiRes.ok) throw new Error(`DDragon items API returned ${apiRes.status}`);

    const raw = await apiRes.json();

    const items = Object.entries(raw.data).map(([itemId, item]: [string, any]) => ({
      id: itemId,
      name: item.name,
      description: item.description,
      plaintext: item.plaintext,
      gold: item.gold,
      tags: item.tags,
      stats: item.stats,
      image: `${DDRAGON_BASE}/cdn/${version}/img/item/${itemId}.png`,
      into: item.into || [],
      from: item.from || [],
    }));

    const responseData = {
      version,
      locale: LOCALE,
      count: items.length,
      items,
    };

    itemsCache = { data: responseData, version, fetchedAt: Date.now() };
    return res.json(responseData);
  } catch (error: any) {
    console.error('Error fetching DDragon items:', error);
    return res.status(500).json({ error: 'Không thể tải danh sách trang bị từ DDragon.' });
  }
}

/**
 * GET /api/ddragon/perks
 * Returns all League of Legends Runes Perks using DDragon official CDN
 */
export async function getPerks(req: Request, res: Response) {
  try {
    if (perksCache && Date.now() - perksCache.fetchedAt < CACHE_TTL) {
      return res.json(perksCache.data);
    }

    const resPerks = await fetch(`${CDRAGON_BASE}/perks.json`);
    const resStyles = await fetch(`${CDRAGON_BASE}/perkstyles.json`);

    if (!resPerks.ok || !resStyles.ok) {
      throw new Error('Failed to fetch CommunityDragon perks data');
    }

    const rawPerks: any[] = await resPerks.json();
    const rawStyles: any = await resStyles.json();

    const perks = rawPerks.map((perk) => {
      const cleanPath = perk.iconPath.replace('/lol-game-data/assets/v1/perk-images', '');
      return {
        id: perk.id,
        name: perk.name,
        shortDesc: perk.shortDesc,
        icon: `${DDRAGON_BASE}/cdn/img/perk-images${cleanPath}`,
      };
    });

    const responseData = {
      count: perks.length,
      perks,
      styles: rawStyles.styles || [],
    };

    perksCache = { data: responseData, fetchedAt: Date.now() };
    return res.json(responseData);
  } catch (error: any) {
    console.error('Error fetching CommunityDragon perks:', error);
    return res.status(500).json({ error: 'Không thể tải bảng ngọc từ CommunityDragon.' });
  }
}
