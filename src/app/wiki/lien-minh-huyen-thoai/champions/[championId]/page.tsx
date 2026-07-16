import React from 'react';
import Link from 'next/link';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import MobalyticsChampionView from '@/components/champions/MobalyticsChampionView';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ championId: 'Ahri' }];
}

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

export default async function ChampionDetailPage({
  params,
}: {
  params: Promise<{ championId: string }>;
}) {
  const { championId } = await params;

  let champion: ChampionDetail | null = null;
  let version = '14.1.1';
  let itemsMap: Record<string, any> = {};
  let errorMsg = '';

  try {
    // 1. Get latest version
    const verRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    if (verRes.ok) {
      const versions = await verRes.json();
      version = versions[0] || '14.1.1';
    }

    // 2. Fetch directly from Riot Data Dragon
    const champRes = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/vi_VN/champion/${championId}.json`
    );

    if (champRes.ok) {
      const data = await champRes.json();
      const rawChamp = data.data?.[championId];
      if (rawChamp) {
        champion = {
          id: rawChamp.id,
          key: rawChamp.key,
          name: rawChamp.name,
          title: rawChamp.title,
          lore: rawChamp.lore || rawChamp.blurb,
          tags: rawChamp.tags || [],
          partype: rawChamp.partype || 'Năng lượng',
          info: rawChamp.info || { attack: 5, defense: 5, magic: 5, difficulty: 5 },
          stats: rawChamp.stats || {},
          image: {
            icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${rawChamp.id}.png`,
            splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${rawChamp.id}_0.jpg`,
            loading: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${rawChamp.id}_0.jpg`,
          },
          skins: (rawChamp.skins || []).map((s: any) => ({
            id: s.id,
            num: s.num,
            name: s.name === 'default' ? rawChamp.name : s.name,
            splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${rawChamp.id}_${s.num}.jpg`,
            loading: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${rawChamp.id}_${s.num}.jpg`,
          })),
          spells: (rawChamp.spells || []).map((sp: any) => ({
            id: sp.id,
            name: sp.name,
            description: sp.description,
            cooldown: sp.cooldownBurn,
            cost: sp.costBurn,
            range: sp.rangeBurn,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${sp.image.full}`,
          })),
          passive: rawChamp.passive
            ? {
                name: rawChamp.passive.name,
                description: rawChamp.passive.description,
                image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${rawChamp.passive.image.full}`,
              }
            : null,
          allytips: rawChamp.allytips || [],
          enemytips: rawChamp.enemytips || [],
        };
      }
    }

    if (!champion) {
      errorMsg = `Không tìm thấy tướng: ${championId}`;
    }

    // 3. Fetch items map from DDragon
    const itemsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/vi_VN/item.json`);
    if (itemsRes.ok) {
      const itemsData = await itemsRes.json();
      Object.entries(itemsData.data || {}).forEach(([id, item]: [string, any]) => {
        itemsMap[id] = {
          id,
          name: item.name,
          description: item.description,
          plaintext: item.plaintext,
          gold: item.gold,
          image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`,
        };
      });
    }
  } catch (error) {
    console.error('Error fetching champion detail:', error);
    errorMsg = 'Lỗi kết nối dữ liệu từ Riot Games.';
  }

  if (errorMsg || !champion) {
    return (
      <WikiLayoutShell>
        <div className="glass-card rounded-2xl p-12 text-center border-rose-500/20 max-w-md mx-auto font-sans">
          <p className="text-base text-zinc-300 mb-6">{errorMsg}</p>
          <Link
            href="/wiki/lien-minh-huyen-thoai/champions"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition duration-300"
          >
            <ArrowLeft size={14} />
            Quay lại danh sách tướng
          </Link>
        </div>
      </WikiLayoutShell>
    );
  }

  return (
    <WikiLayoutShell>
      <MobalyticsChampionView champion={champion} version={version} itemsMap={itemsMap} />
    </WikiLayoutShell>
  );
}
