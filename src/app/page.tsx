import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { BookOpen, ArrowRight, ShieldCheck, Database, Users, Sparkles, Gamepad2, Cpu, Compass, Smartphone, Play, Star } from 'lucide-react';

export const revalidate = 3600;

const GAME_APP_DOCK = [
  {
    id: 'lol',
    name: 'Liên Minh Huyền Thoại',
    slug: 'lien-minh-huyen-thoai',
    tag: 'MOBA 5v5',
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png',
    stat: '870+',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
  },
  {
    id: 'er',
    name: 'Elden Ring',
    slug: 'elden-ring',
    tag: 'Action RPG',
    iconUrl: '/elden-ring-icon.png',
    stat: '815+',
    color: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
  },
  {
    id: 'wukong',
    name: 'Black Myth Wukong',
    slug: 'black-myth-wukong',
    tag: 'Soulslike',
    iconUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=300&fit=crop&q=80',
    stat: '29+',
    color: 'border-amber-600/40 text-amber-300 bg-amber-600/10',
  },
  {
    id: 'tft',
    name: 'Đấu Trường Chân Lý',
    slug: 'tft',
    tag: 'Auto Chess',
    iconUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7cfc?w=300&h=300&fit=crop&q=80',
    stat: 'META',
    color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
  },
];

export default async function HomePage() {
  let recentArticles: any[] = [];
  let articleCount = 0;
  let games: any[] = [];
  let gameCount = GAME_APP_DOCK.length;

  try {
    const articlesRes = await fetch('http://localhost:5000/api/articles?limit=3', {
      next: { revalidate: 3600 }
    });
    if (articlesRes.ok) {
      const articlesData = await articlesRes.json();
      recentArticles = articlesData.articles || [];
      articleCount = articlesData.pagination?.total || 0;
    }
  } catch (error) {
    console.error('Error fetching articles for home:', error);
  }

  try {
    const gamesRes = await fetch('http://localhost:5000/api/games', {
      next: { revalidate: 3600 }
    });
    if (gamesRes.ok) {
      const gamesData = await gamesRes.json();
      games = gamesData.games || [];
      if (games.length > 0) gameCount = games.length;
    }
  } catch (error) {
    console.error('Error fetching games for home:', error);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans select-none">
      {/* 1. Global Navbar with Home, Back button & Search UX */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="relative px-6 py-16 md:py-24 flex flex-col items-center text-center overflow-hidden border-b border-zinc-800/50">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-400 uppercase">
            <Sparkles size={14} className="text-cyan-400" /> NỀN TẢNG BÁCH KHOA TRÒ CHƠI WIGAKI
          </span>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white uppercase">
            TRA CỨU THÔNG TIN CỦA NHIỀU TỰA GAME
          </h1>

          <p className="max-w-2xl mx-auto text-xs md:text-sm text-zinc-400 leading-relaxed font-sans">
            Tra cứu thông tin của nhiều tựa game: chỉ số 170+ tướng Riot, thông số vật phẩm, hướng dẫn chơi và bách khoa toàn thư game với giao diện ứng dụng tối giản.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/wiki"
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-cyan-500/25 hover:scale-105 hover:shadow-cyan-500/40 transition duration-300 uppercase tracking-wider"
            >
              <Smartphone size={16} /> Mở Thư Viện Tra Cứu
            </Link>

            <Link
              href="/wiki/elden-ring"
              className="flex items-center gap-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-6 py-3.5 text-xs font-bold text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/40 transition duration-200 uppercase tracking-wider"
            >
              <Compass size={16} /> Elden Ring Hub
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Smartphone App Icon Grid */}
      <section className="max-w-5xl mx-auto w-full px-6 py-12">
        <div className="rounded-3xl bg-zinc-950/60 border border-zinc-800/80 p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gradient-to-br from-purple-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Dock Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/60">
            <div className="flex items-center gap-2">
              <Sparkles className="text-cyan-400" size={18} />
              <h2 className="text-sm font-extrabold text-zinc-200 uppercase tracking-widest">
                DOCK ỨNG DỤNG TRA CỨU GAME
              </h2>
            </div>
            <span className="text-[11px] font-medium text-zinc-500">Chạm Icon để Mở</span>
          </div>

          {/* Minimalist Phone Launcher Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
            {GAME_APP_DOCK.map((app) => (
              <Link
                key={app.id}
                href={`/wiki/${app.slug}`}
                className="group flex flex-col items-center text-center w-full max-w-[130px] transition-transform duration-200 active:scale-95"
              >
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[24%] bg-zinc-900 border border-zinc-700/70 shadow-lg shadow-black/60 overflow-hidden group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center">
                    <img
                      src={app.iconUrl}
                      alt={app.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-rose-600 text-[10px] font-black text-white flex items-center justify-center border-2 border-zinc-950 shadow-md">
                    {app.stat}
                  </span>
                </div>

                <span className="mt-2.5 text-[13px] font-semibold text-zinc-200 group-hover:text-cyan-400 line-clamp-1 leading-tight tracking-tight transition-colors">
                  {app.name}
                </span>

                <span className={`mt-1 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${app.color}`}>
                  {app.tag}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Stats Bar */}
      <section className="border-y border-zinc-800/60 bg-zinc-950/40 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-2xl md:text-3xl font-black text-cyan-400">1,726+</span>
            <p className="text-xs text-zinc-400 font-medium">Vật Phẩm & Tướng Supabase</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl md:text-3xl font-black text-cyan-400">170+</span>
            <p className="text-xs text-zinc-400 font-medium">Tướng League of Legends</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl md:text-3xl font-black text-cyan-400">815+</span>
            <p className="text-xs text-zinc-400 font-medium">Vật Phẩm Elden Ring DLC</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl md:text-3xl font-black text-cyan-400">100%</span>
            <p className="text-xs text-zinc-400 font-medium">Bản Quyền Dữ Liệu Việt Hóa</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-8 px-6 text-center text-xs text-zinc-500 bg-zinc-950">
        <p className="font-bold tracking-wider text-zinc-400 uppercase">WIGAKI - Tra cứu thông tin của nhiều tựa game</p>
        <p className="pt-1 text-zinc-600">&copy; 2026 Wigaki Việt Nam. All rights reserved.</p>
      </footer>
    </div>
  );
}
