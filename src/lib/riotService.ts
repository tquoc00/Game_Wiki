export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[];
  partype: string;
  stats: Record<string, number>;
}

export interface ChampionListResponse {
  type: string;
  format: string;
  version: string;
  data: Record<string, Champion>;
}

export async function getLatestPatchVersion(): Promise<string> {
  const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json', {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch version info: ${response.statusText}`);
  }

  const versions: string[] = await response.json();
  return versions[0] || '14.1.1';
}

export async function getChampionsList(): Promise<{ version: string; champions: Champion[] }> {
  const version = await getLatestPatchVersion();
  const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch champions list: ${response.statusText}`);
  }

  const result: ChampionListResponse = await response.json();
  const champions = Object.values(result.data);

  return {
    version,
    champions,
  };
}
