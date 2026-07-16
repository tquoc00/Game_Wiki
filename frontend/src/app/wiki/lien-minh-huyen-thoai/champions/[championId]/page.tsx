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
  let version = '';
  let itemsMap: Record<string, any> = {};
  let errorMsg = '';

  try {
    // 1. Fetch champion detail from API
    const res = await fetch(`http://localhost:5000/api/ddragon/champions/${championId}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      champion = data.champion;
      version = data.version;
    } else {
      errorMsg = `Không tìm thấy tướng: ${championId}`;
    }

    // 2. Fetch items map for build display
    const itemsRes = await fetch(`http://localhost:5000/api/ddragon/items`, {
      next: { revalidate: 3600 },
    });
    if (itemsRes.ok) {
      const itemsData = await itemsRes.json();
      (itemsData.items || []).forEach((item: any) => {
        itemsMap[item.id] = item;
      });
    }
  } catch (error) {
    console.error('Error fetching champion detail:', error);
    errorMsg = 'Lỗi kết nối đến máy chủ dữ liệu.';
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
