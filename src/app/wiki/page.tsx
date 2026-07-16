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
    description: 'Bách khoa toàn thư chỉ số 170+ tướng, trang bị Riot, ngọc bổ trợ và hướng dẫn meta 5 vị trí.',
    accentColor: 'from-amber-500/20 to-amber-700/20 border-amber-500/40 text-amber-400',
    _count: { articles: 170, categories: 5 },
  },
  {
    id: 'er',
    name: 'Elden Ring',
    slug: 'elden-ring',
    categoryTag: 'Action RPG',
    badgeText: '45+ Trùm & Phép Thuật',
    iconUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
    description: 'Tra cứu trùm, bản đồ The Lands Between, danh sách vũ khí huyền thoại và xây dựng chỉ số Tarnished.',
    accentColor: 'from-orange-500/20 to-amber-700/20 border-orange-500/40 text-orange-400',
    _count: { articles: 45, categories: 6 },
  },
  {
    id: 'val',
    name: 'Valorant',
    slug: 'valorant',
    categoryTag: 'Tactical FPS',
    badgeText: '24+ Đặc Vụ & Tâm Ngắm',
    iconUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=60',
    description: 'Thư viện kỹ năng Đặc Vụ, thông số sát thương súng, góc kê line-up và mã định dạng tâm ngắm thi đấu.',
    accentColor: 'from-rose-500/20 to-red-700/20 border-rose-500/40 text-rose-400',
    _count: { articles: 24, categories: 4 },
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    slug: 'genshin-impact',
    categoryTag: 'Open-World RPG',
    badgeText: '80+ Nhân Vật & Thánh Di Vật',
    iconUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=60',
    description: 'Hướng dẫn build nhân vật Teyvat, nguyên tố phản ứng, thánh di vật tối ưu và nguyên liệu đột phá.',
    accentColor: 'from-cyan-500/20 to-blue-700/20 border-cyan-500/40 text-cyan-400',
    _count: { articles: 80, categories: 7 },
  },
  {
    id: 'wukong',
    name: 'Black Myth: Wukong',
    slug: 'black-myth-wukong',
    categoryTag: 'Action Soulslike',
    badgeText: '80+ Yêu Quái & Pháp Bảo',
    iconUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60',
    description: 'Hành trình Tây Du tra cứu 81 kiếp nạn, biến thân thần thông, vị trí các loại tửu dược và trùm ẩn.',
    accentColor: 'from-amber-600/20 to-yellow-800/20 border-amber-600/40 text-amber-300',
    _count: { articles: 52, categories: 5 },
  },
  {
    id: 'tft',
    name: 'Đấu Trường Chân Lý (TFT)',
    slug: 'tft',
    categoryTag: 'Auto Chess',
    badgeText: 'Đội Hình Meta Mới Nhất',
    iconUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7cfc?w=400&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7cfc?w=800&auto=format&fit=crop&q=60',
    description: 'Top đội hình S-Tier leo rank, công thức ghép trang bị chuẩn, lõi công nghệ và tỉ lệ roll tướng theo cấp.',
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
            iconUrl: g.logoUrl || fallback.iconUrl,
            bannerUrl: g.bannerUrl || fallback.bannerUrl,
            description: g.description || fallback.description,
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

      {/* 2. Hero Header - Mobile App Launcher Styling */}
      <section className="relative px-6 py-12 md:py-20 flex flex-col items-center text-center overflow-hidden border-b border-zinc-800/50">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-400 uppercase">
            <Smartphone size={14} className="text-cyan-400 animate-pulse" /> WIGAKI GAME APP STORE & LAUNCHER
          </span>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white uppercase">
            ỨNG DỤNG TRA CỨU GAME <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              GIAO DIỆN APP ĐIỆN THOẠI
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-xs md:text-sm text-zinc-400 leading-relaxed font-sans">
            Chạm vào Icon của bất kỳ ứng dụng game nào bên dưới để mở ngay thư viện dữ liệu, hướng dẫn chơi và thông số tướng/vật phẩm chuẩn xác.
          </p>
        </div>
      </section>

      {/* 3. Mobile App Icons Grid (Smartphone Home Screen / App Launcher Layout) */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="text-cyan-400" size={20} />
              DANH SÁCH APP GAME TRA CỨU
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans">Được thiết kế dạng App Icon trực quan trên Smartphone</p>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-xl">
            <Star size={14} className="text-amber-400 fill-amber-400" /> {gameApps.length} Tựa Game Hàng Đầu
          </span>
        </div>

        {/* Smartphone Grid - 2 columns on mobile, 3 on tablet, 6 on desktop or 3 per row rich app tiles */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gameApps.map((app) => (
            <Link
              key={app.id}
              href={`/wiki/${app.slug}`}
              className="group glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden border border-zinc-800/80 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              {/* Top Banner Glow Background */}
              <div className="absolute top-0 right-0 left-0 h-24 bg-gradient-to-b from-zinc-800/20 to-transparent pointer-events-none" />

              <div>
                {/* App Row: Icon Badge + Main App Information */}
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  {/* Smartphone App Icon (Squircle shape 1:1 ratio) */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 md:w-22 md:h-22 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-700/80 shadow-xl group-hover:scale-105 group-hover:shadow-cyan-500/20 transition-all duration-300">
                      <img
                        src={app.iconUrl}
                        alt={app.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    {/* Tiny neon notification dot */}
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-zinc-950"></span>
                    </span>
                  </div>

                  {/* App Details */}
                  <div className="flex-1 space-y-1">
                    <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${app.accentColor}`}>
                      {app.categoryTag}
                    </span>

                    <h3 className="text-base font-extrabold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wide leading-snug">
                      {app.name}
                    </h3>

                    <span className="text-[11px] font-semibold text-zinc-400 block">
                      {app.badgeText}
                    </span>
                  </div>
                </div>

                {/* App Short Description */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans mb-4 relative z-10">
                  {app.description}
                </p>
              </div>

              {/* Bottom Launch Button Bar */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs relative z-10">
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-sans">
                  <Layers size={13} className="text-cyan-400" />
                  {app._count.categories} Danh Mục Tra Cứu
                </span>

                <span className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 group-hover:from-cyan-400 group-hover:to-indigo-500 px-3.5 py-1.5 text-[11px] font-bold text-white uppercase tracking-wider shadow-md shadow-cyan-500/20 transition duration-300">
                  <Play size={12} className="fill-white" /> MỞ APP
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-zinc-800/60 py-8 px-6 text-center text-xs text-zinc-500 bg-zinc-950">
        <p className="font-bold tracking-wider text-zinc-400 uppercase">WIGAKI MOBILE GAME LAUNCHER & HUB</p>
        <p className="pt-2 text-zinc-600">&copy; 2026 Wigaki Việt Nam. All rights reserved.</p>
      </footer>
    </div>
  );
}
