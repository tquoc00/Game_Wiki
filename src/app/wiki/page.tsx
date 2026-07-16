import React from 'react';
import Link from 'next/link';
import { BookOpen, Layers, Gamepad2, Sparkles, Star, Smartphone, Play, Compass } from 'lucide-react';

export const revalidate = 3600;

interface GameApp {
  id: string;
  name: string;
  slug: string;
  categoryTag: string;
  badgeText: string;
  iconUrl: string;
  bannerUrl: string;
  description: string;
  accentColor: string;
  _count: {
    articles: number;
    categories: number;
  };
}

const DEFAULT_GAME_APPS: GameApp[] = [
  {
    id: 'lol',
    name: 'Liên Minh Huyền Thoại',
    slug: 'lien-minh-huyen-thoai',
    categoryTag: 'MOBA 5v5',
    badgeText: '170+ Tướng & Trang Bị',
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60',
    description: 'Tra cứu thông tin của nhiều tựa game',
    accentColor: 'from-amber-500/20 to-amber-700/20 border-amber-500/40 text-amber-400',
    _count: { articles: 170, categories: 5 },
  },
  {
    id: 'er',
    name: 'Elden Ring',
    slug: 'elden-ring',
    categoryTag: 'Action RPG',
    badgeText: '45+ Trùm & Phép Thuật',
    iconUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
    description: 'Tra cứu thông tin của nhiều tựa game',
    accentColor: 'from-orange-500/20 to-amber-700/20 border-orange-500/40 text-orange-400',
    _count: { articles: 45, categories: 6 },
  },
  {
    id: 'wukong',
    name: 'Black Myth: Wukong',
    slug: 'black-myth-wukong',
    categoryTag: 'Action Soulslike',
    badgeText: '80+ Yêu Quái & Pháp Bảo',
    iconUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=300&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60',
    description: 'Tra cứu thông tin của nhiều tựa game',
    accentColor: 'from-amber-600/20 to-yellow-800/20 border-amber-600/40 text-amber-300',
    _count: { articles: 52, categories: 5 },
  },
  {
    id: 'tft',
    name: 'Đấu Trường Chân Lý (TFT)',
    slug: 'tft',
    categoryTag: 'Auto Chess',
    badgeText: 'Đội Hình Meta Mới Nhất',
    iconUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7cfc?w=300&h=300&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7cfc?w=800&auto=format&fit=crop&q=60',
    description: 'Tra cứu thông tin của nhiều tựa game',
    accentColor: 'from-purple-500/20 to-indigo-700/20 border-purple-500/40 text-purple-400',
    _count: { articles: 60, categories: 5 },
  },
];

export default async function WikiCatalogPage() {
  let gameApps: GameApp[] = DEFAULT_GAME_APPS;

  try {
    const res = await fetch('http://localhost:5000/api/games', {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.games && data.games.length > 0) {
        // Map backend response if present
        gameApps = data.games.map((g: any, idx: number) => {
          const fallback = DEFAULT_GAME_APPS[idx % DEFAULT_GAME_APPS.length];
          return {
            id: g.id || fallback.id,
            name: g.name || fallback.name,
            slug: g.slug || fallback.slug,
            categoryTag: fallback.categoryTag,
            badgeText: `${g._count?.articles || fallback._count.articles}+ Bài viết`,
            iconUrl: (g.logoUrl && !g.logoUrl.includes('placeholder')) ? g.logoUrl : fallback.iconUrl,
            bannerUrl: g.bannerUrl || fallback.bannerUrl,
            description: 'Tra cứu thông tin của nhiều tựa game',
            accentColor: fallback.accentColor,
            _count: g._count || fallback._count,
          };
        });
      }
    }
  } catch (error) {
    console.error('Using default app launcher games grid:', error);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans select-none">
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Gamepad2 size={20} />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-white uppercase md:text-2xl font-sans">
              WI<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">GAKI</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/40 transition duration-200"
            >
              <Compass size={15} /> TRANG CHỦ
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Minimalist Phone Launcher Header */}
      <section className="relative px-6 py-10 flex flex-col items-center text-center overflow-hidden border-b border-zinc-800/50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md px-4 py-1 text-xs font-semibold tracking-wide text-cyan-400 uppercase">
            <Smartphone size={14} className="text-cyan-400 animate-pulse" /> WIGAKI GAME LAUNCHER
          </span>

          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight text-white uppercase">
            Tra cứu thông tin của nhiều tựa game
          </h1>

          <p className="text-xs md:text-sm text-zinc-400 max-w-lg mx-auto font-sans">
            Chạm vào bất kỳ Icon ứng dụng game nào bên dưới để mở thư viện tra cứu.
          </p>
        </div>
      </section>

      {/* 3. Smartphone App Icon Grid (Phone Screen Layout) */}
      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">
        {/* Smartphone Screen Box Container */}
        <div className="rounded-3xl bg-zinc-950/60 border border-zinc-800/80 p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Phone Screen Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gradient-to-br from-purple-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Grid Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/60">
            <div className="flex items-center gap-2">
              <Sparkles className="text-cyan-400" size={18} />
              <h2 className="text-sm font-extrabold text-zinc-200 uppercase tracking-widest">
                DỰ DỤNG THƯ VIỆN GAME ({gameApps.length})
              </h2>
            </div>
            <span className="text-[11px] font-medium text-zinc-500">Chạm Icon để Mở thư viện</span>
          </div>

          {/* Minimalist Phone Icons Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-8 gap-x-4 md:gap-x-6 justify-items-center">
            {gameApps.map((app) => (
              <Link
                key={app.id}
                href={`/wiki/${app.slug}`}
                className="group flex flex-col items-center text-center w-full max-w-[100px] transition-transform duration-200 active:scale-95"
              >
                {/* Smartphone Squircle App Icon */}
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[22%] bg-zinc-900 border border-zinc-700/70 shadow-lg shadow-black/60 overflow-hidden group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center">
                    <img
                      src={app.iconUrl}
                      alt={app.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Smartphone Red Notification Badge */}
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-rose-600 text-[10px] font-black text-white flex items-center justify-center border-2 border-zinc-950 shadow-md">
                    {app._count?.articles ? `${app._count.articles}+` : 'NEW'}
                  </span>
                </div>

                {/* Smartphone Icon Title Label */}
                <span className="mt-2 text-[12px] font-medium text-zinc-200 group-hover:text-cyan-400 group-hover:font-semibold line-clamp-2 leading-tight tracking-tight transition-colors drop-shadow">
                  {app.name}
                </span>

                {/* Button Action Label */}
                <span className="mt-1 text-[9px] font-extrabold text-cyan-400 group-hover:text-white uppercase tracking-wider bg-cyan-950/50 group-hover:bg-cyan-500 border border-cyan-500/30 px-2 py-0.5 rounded-md transition-colors">
                  MỞ THƯ VIỆN
                </span>
              </Link>
            ))}
          </div>

          {/* Smartphone Bottom Home Dock Bar */}
          <div className="mt-12 pt-6 border-t border-zinc-800/60 flex items-center justify-center">
            <div className="inline-flex items-center gap-6 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl px-6 py-3 shadow-xl backdrop-blur-md">
              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                <Star size={14} className="text-amber-400 fill-amber-400" /> WIGAKI LAUNCHER DOCK
              </span>
              <span className="h-4 w-px bg-zinc-800" />
              <Link
                href="/wiki/lien-minh-huyen-thoai/champions"
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
              >
                Mở thư viện 170+ Tướng Riot &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Minimalist Footer */}
      <footer className="border-t border-zinc-800/60 py-6 px-6 text-center text-xs text-zinc-500 bg-zinc-950">
        <p className="font-bold tracking-wider text-zinc-400 uppercase">WIGAKI - Tra cứu thông tin của nhiều tựa game</p>
        <p className="pt-1 text-zinc-600">&copy; 2026 Wigaki Việt Nam. All rights reserved.</p>
      </footer>
    </div>
  );
}
