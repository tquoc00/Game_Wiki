import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, ShieldCheck, Database, Users, Sparkles, Gamepad2, Cpu, Compass, Smartphone, Play, Star } from 'lucide-react';

export const revalidate = 3600; // Static pre-render with hourly revalidation

const GAME_APP_DOCK = [
  {
    id: 'lol',
    name: 'Liên Minh Huyền Thoại',
    slug: 'lien-minh-huyen-thoai',
    tag: 'MOBA 5v5',
    iconUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png',
    stat: '170+',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
  },
  {
    id: 'er',
    name: 'Elden Ring',
    slug: 'elden-ring',
    tag: 'Action RPG',
    iconUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop&q=80',
    stat: '45+',
    color: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
  },
  {
    id: 'wukong',
    name: 'Black Myth Wukong',
    slug: 'black-myth-wukong',
    tag: 'Soulslike',
    iconUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=300&fit=crop&q=80',
    stat: '80+',
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
              href="/wiki"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition duration-200"
            >
              <Smartphone size={15} /> MỞ THƯ VIỆN
            </Link>
          </nav>
        </div>
      </header>

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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-cyan-500/20 hover:scale-105 transition duration-300"
            >
              <Smartphone size={16} /> Mở Thư Viện Game
            </Link>
            <Link
              href="/wiki/elden-ring/quests"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-200 transition duration-300"
            >
              <Sparkles size={16} className="text-amber-400" /> Questlines Elden Ring
            </Link>
            <Link
              href="/wiki/lien-minh-huyen-thoai/champions"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-200 transition duration-300"
            >
              <Star size={16} className="text-amber-400" /> 170+ Tướng Riot
            </Link>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mt-16" />
      </section>

      {/* 3. Mobile Smartphone App Launcher Grid (App Store Dock) */}
      <section className="max-w-5xl mx-auto w-full px-6 py-12">
        <div className="rounded-3xl bg-zinc-950/60 border border-zinc-800/80 p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-zinc-800/60 gap-4">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                📱 MOBILE GAME LAUNCHER
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white uppercase text-left">
                Tra cứu thông tin của nhiều tựa game
              </h2>
            </div>
            <Link href="/wiki" className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition duration-200">
              Mở Thư Viện đầy đủ
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Minimalist Smartphone Icon Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-8 gap-x-4 md:gap-x-6 justify-items-center">
            {GAME_APP_DOCK.map((app) => (
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

                  {/* Smartphone Red Badge */}
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-rose-600 text-[10px] font-black text-white flex items-center justify-center border-2 border-zinc-950 shadow-md">
                    {app.stat}
                  </span>
                </div>

                {/* Smartphone App Label */}
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
        </div>
      </section>

      {/* 4. Core Features Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 border-t border-zinc-800/50">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">TÍNH NĂNG TRA CỨU HÀNG ĐẦU</h2>
          <p className="text-xs text-zinc-400 mt-1 font-sans">Trực quan như App điện thoại native, tốc độ cao trên mọi nền tảng</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col space-y-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Smartphone className="text-cyan-400" size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white tracking-wide uppercase">GIAO DIỆN APP DI ĐỘNG</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Các Icon ứng dụng dạng bo góc squircle chuẩn iOS/Android giúp truy cập các tựa game yêu thích tức thì.
              </p>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col space-y-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <ShieldCheck className="text-indigo-400" size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white tracking-wide uppercase">DỮ LIỆU ĐÃ XÁC THỰC</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Tất cả thông số vật phẩm và bộ kỹ năng được biên soạn chuẩn xác từ dữ liệu chính thức của Riot Games & nhà phát hành.
              </p>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col space-y-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Cpu className="text-purple-400" size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white tracking-wide uppercase">TRA CỨU TỐC ĐỘ CAO</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Tải trang mượt mà trên cả thiết bị di động và máy tính với kiến trúc tĩnh Static Generation tối ưu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. App Stats Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 border-t border-zinc-800/50 mb-12">
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Gamepad2 className="text-cyan-400" size={22} />
            </div>
            <div className="text-left">
              <h4 className="text-2xl font-black text-white">{gameCount}</h4>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">App Game Tra Cứu</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Database className="text-indigo-400" size={22} />
            </div>
            <div className="text-left">
              <h4 className="text-2xl font-black text-white">170+ Tướng</h4>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Chỉ Số & Bài Viết</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Users className="text-purple-400" size={22} />
            </div>
            <div className="text-left">
              <h4 className="text-2xl font-black text-white">100%</h4>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Miễn Phí & Tự Do</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto border-t border-zinc-800/60 py-10 px-6 text-center text-xs text-zinc-500 bg-zinc-950">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="font-bold text-zinc-400 tracking-wider">WIGAKI - NỀN TẢNG WIKI APP TRÒ CHƠI MULTI-PLATFORM</p>
          <p className="max-w-md mx-auto leading-relaxed">Hệ thống tra cứu thông tin game mượt mà như App di động trên mọi thiết bị.</p>
          <p className="pt-2 text-zinc-600">&copy; 2026 Wigaki. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
