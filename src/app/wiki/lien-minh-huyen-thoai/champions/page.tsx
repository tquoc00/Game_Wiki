'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import { ArrowLeft, Search, Flame, Compass } from 'lucide-react';
import { getChampionMetaBuild, LaneRole } from '@/lib/lolMetaHelper';

interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  tags: string[];
  partype: string;
  stats: Record<string, number>;
  image: {
    icon: string;
    splash: string;
    loading: string;
  };
}

const TAG_TRANSLATIONS: Record<string, string> = {
  Fighter: 'Đấu Sĩ',
  Tank: 'Đỡ Đòn',
  Mage: 'Pháp Sư',
  Assassin: 'Sát Thủ',
  Marksman: 'Xạ Thủ',
  Support: 'Hỗ Trợ',
};

const TAG_COLORS: Record<string, string> = {
  Fighter: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
  Tank: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
  Mage: 'border-violet-500/40 text-violet-400 bg-violet-500/10',
  Assassin: 'border-red-500/40 text-red-400 bg-red-500/10',
  Marksman: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  Support: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
};

const LANE_CONFIG: Record<LaneRole | 'ALL', { label: string; icon: string }> = {
  ALL: { label: 'Tất Cả Đường', icon: '⚔️' },
  TOP: { label: 'Đường Trên (TOP)', icon: '🛡️' },
  JUNGLE: { label: 'Đi Rừng (JUNGLE)', icon: '🌲' },
  MID: { label: 'Đường Giữa (MID)', icon: '🔮' },
  ADC: { label: 'Đường Dưới (ADC / BOT)', icon: '🏹' },
  SUPPORT: { label: 'Hỗ Trợ (SUPPORT)', icon: '💚' },
};

function ChampionsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';
  const lane = searchParams.get('lane') || 'ALL';

  const [champions, setChampions] = useState<Champion[]>([]);
  const [version, setVersion] = useState('14.1.1');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchChampions() {
      try {
        const verRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        let ver = '14.1.1';
        if (verRes.ok) {
          const versions = await verRes.json();
          ver = versions[0] || '14.1.1';
          setVersion(ver);
        }

        const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/en_US/champion.json`);
        if (champRes.ok) {
          const data = await champRes.json();
          const list: Champion[] = Object.values(data.data || {}).map((c: any) => ({
            id: c.id,
            key: c.key,
            name: c.name,
            title: c.title,
            blurb: c.blurb,
            tags: c.tags,
            partype: c.partype,
            stats: c.stats,
            image: {
              icon: `https://ddragon.leagueoflegends.com/cdn/${ver}/img/champion/${c.id}.png`,
              splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${c.id}_0.jpg`,
              loading: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${c.id}_0.jpg`,
            },
          }));
          setChampions(list);
        } else {
          setErrorMsg('Không thể tải danh sách tướng.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Lỗi kết nối dữ liệu.');
      } finally {
        setLoading(false);
      }
    }
    fetchChampions();
  }, []);

  const championsWithMeta = champions.map((champ) => {
    const meta = getChampionMetaBuild(champ.id, champ.tags, 'all');
    return { ...champ, meta };
  });

  let filtered = championsWithMeta;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }

  if (tag) {
    filtered = filtered.filter((c) => c.tags.includes(tag));
  }

  if (lane && lane !== 'ALL') {
    filtered = filtered.filter((c) => c.meta.lane === lane);
  }

  const allTags = Array.from(new Set(champions.flatMap((c) => c.tags))).sort();

  return (
    <>
      <div className="mb-6 border-b border-zinc-800/80 pb-6 space-y-4 font-sans">
        <div className="flex items-center gap-2">
          <Link
            href="/wiki/lien-minh-huyen-thoai"
            className="text-[10px] tracking-widest font-mono text-zinc-500 uppercase hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={10} />
            LIÊN MINH HUYỀN THOẠI
          </Link>
          <span className="text-zinc-600">&bull;</span>
          <span className="text-[10px] tracking-widest font-mono text-cyan-400 uppercase">
            COMMUNITYDRAGON & RIOT PATCH {version}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <Compass className="text-cyan-400" size={32} />
              Bảng Xếp Hạng Meta Tướng (Tier List & Lane Guide)
            </h1>
            <p className="mt-1.5 text-xs text-zinc-400 max-w-3xl font-sans leading-relaxed">
              Dữ liệu lối chơi, trang bị và tỷ lệ thắng được xếp hạng theo 5 vị trí chuẩn Mobalytics & Skill-Capped cho <strong className="text-cyan-400">{champions.length}</strong> tướng.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-2">
            Lọc Theo Vị Trí / Đường (Lane Metagame):
          </span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(LANE_CONFIG) as (LaneRole | 'ALL')[]).map((key) => {
              const cfg = LANE_CONFIG[key];
              const isActive = lane === key;
              return (
                <Link
                  key={key}
                  href={`/wiki/lien-minh-huyen-thoai/champions?lane=${key}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 scale-105 border border-cyan-400/50'
                      : 'bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href={`/wiki/lien-minh-huyen-thoai/champions?lane=${lane}${search ? `&search=${search}` : ''}`}
            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
              !tag
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            Tất cả hệ tướng
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/wiki/lien-minh-huyen-thoai/champions?tag=${t}&lane=${lane}${search ? `&search=${search}` : ''}`}
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                tag === t
                  ? TAG_COLORS[t] || 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {TAG_TRANSLATIONS[t] || t}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-md mb-8 font-sans">
        <form action="/wiki/lien-minh-huyen-thoai/champions" method="GET" className="relative">
          {tag && <input type="hidden" name="tag" value={tag} />}
          {lane && <input type="hidden" name="lane" value={lane} />}
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Tìm tướng theo tên hoặc vị trí..."
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 focus:border-cyan-500 py-3 pl-4 pr-12 text-zinc-100 placeholder-zinc-500 outline-none transition duration-300 font-sans text-xs tracking-wide"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 rounded-lg bg-cyan-500 p-1.5 text-zinc-950 hover:bg-cyan-400 transition duration-200 cursor-pointer font-bold"
          >
            <Search size={14} />
          </button>
        </form>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-16 text-center text-zinc-400 font-sans">
          Đang tải dữ liệu 170+ tướng từ Riot Games...
        </div>
      ) : errorMsg ? (
        <div className="glass-card rounded-2xl p-12 text-center text-rose-400 border-rose-900 font-sans">
          {errorMsg}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center border-zinc-800 space-y-4 font-sans">
          <p className="text-sm text-zinc-400">
            Không tìm thấy tướng nào phù hợp với vị trí/hệ tướng đã chọn.
          </p>
          <Link
            href="/wiki/lien-minh-huyen-thoai/champions"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-500/20 px-5 py-2 text-xs font-bold uppercase tracking-wider text-cyan-400 transition duration-300"
          >
            Xóa bộ lọc
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 font-sans">
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              Hiển thị <span className="text-cyan-400 font-bold">{filtered.length}</span> / {champions.length} tướng ({LANE_CONFIG[lane as LaneRole | 'ALL']?.label})
            </p>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 font-sans">
            {filtered.map((champ) => (
              <Link
                key={champ.id}
                href={`/wiki/lien-minh-huyen-thoai/champions/${champ.id}`}
                className="group glass-card rounded-2xl border-zinc-800/80 overflow-hidden flex flex-col hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 shadow-xl"
              >
                <div className="relative h-52 w-full overflow-hidden bg-zinc-950">
                  <img
                    src={champ.image.loading}
                    alt={champ.name}
                    className="h-full w-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-zinc-950/90 border border-amber-500/40 px-2 py-0.5 rounded-md shadow-lg">
                    <Flame size={10} className="text-amber-400" />
                    <span className="text-[10px] font-black text-amber-300">
                      TIER {champ.meta.tier}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {champ.tags.map((t) => (
                      <span
                        key={t}
                        className={`rounded border px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider ${
                          TAG_COLORS[t] || 'border-zinc-600 text-zinc-400 bg-zinc-800/80'
                        }`}
                      >
                        {TAG_TRANSLATIONS[t] || t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider truncate">
                        {champ.name}
                      </h3>
                      <span className="text-[9px] font-extrabold text-emerald-400 font-mono">
                        {champ.meta.winRate} WR
                      </span>
                    </div>
                    <p className="text-[9px] text-zinc-400 truncate mt-0.5 italic">
                      {champ.title}
                    </p>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-2 flex items-center justify-between text-[9px]">
                    <span className="text-cyan-400 font-bold uppercase truncate">
                      {champ.meta.role.split(' ')[0]}
                    </span>
                    <span className="text-zinc-500 font-mono">
                      Pick: {champ.meta.pickRate}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default function ChampionsPage() {
  return (
    <WikiLayoutShell>
      <Suspense fallback={<div className="p-12 text-center text-zinc-400 font-sans">Đang tải...</div>}>
        <ChampionsContent />
      </Suspense>
    </WikiLayoutShell>
  );
}
