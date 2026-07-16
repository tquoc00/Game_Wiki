import React from 'react';
import Link from 'next/link';
import { BookOpen, Layers, Gamepad2, Sparkles } from 'lucide-react';

export const revalidate = 3600;

interface Game {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  description: string | null;
  _count: {
    articles: number;
    categories: number;
  };
}

const DEFAULT_GAMES: Game[] = [
  {
    id: 'lol',
    name: 'Liên Minh Huyền Thoại',
    slug: 'lien-minh-huyen-thoai',
    logoUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60',
    description: 'Thư viện dữ liệu 170+ tướng, trang bị, bản đồ và hướng dẫn meta Liên Minh Huyền Thoại.',
    _count: { articles: 170, categories: 5 },
  },
  {
    id: 'er',
    name: 'Elden Ring',
    slug: 'elden-ring',
    logoUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
    description: 'Bách khoa toàn thư tra cứu vũ khí, trùm, phép thuật và bản đồ The Lands Between trong Elden Ring.',
    _count: { articles: 45, categories: 6 },
  },
  {
    id: 'val',
    name: 'Valorant',
    slug: 'valorant',
    logoUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=60',
    bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=60',
    description: 'Thư viện Đặc Vụ, bộ kỹ năng, vũ khí và thiết lập tâm ngắm chuẩn thi đấu trong Valorant.',
    _count: { articles: 24, categories: 4 },
  },
];

export default async function WikiCatalogPage() {
  let games: Game[] = DEFAULT_GAMES;

  try {
    const res = await fetch('http://localhost:5000/api/games', {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.games && data.games.length > 0) {
        games = data.games;
      }
    }
  } catch (error) {
    console.error('Error fetching games catalog, using static fallback:', error);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
              <Gamepad2 size={18} />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-white uppercase md:text-2xl font-sans">
              WI<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">GAKI</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-zinc-400 hover:text-cyan-400 transition-colors duration-200 text-xs font-semibold uppercase tracking-wider">
              Trang Chủ
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Hero Header */}
      <section className="relative px-6 py-16 md:py-24 flex flex-col items-center text-center overflow-hidden border-b border-zinc-800/50">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-5 relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold tracking-wide text-cyan-400 uppercase">
            <Sparkles size={13} /> CƠ SỞ DỮ LIỆU GAME ĐA THỂ LOẠI
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white uppercase">
            THƯ VIỆN TRÒ CHƠI WIGAKI
          </h1>
          <p className="max-w-xl mx-auto text-xs md:text-sm text-zinc-400 leading-relaxed">
            Chào mừng bạn đến với trung tâm kiến thức trò chơi. Lựa chọn một tựa game bên dưới để tra cứu chỉ số, hướng dẫn chơi và danh mục cập nhật.
          </p>
        </div>

        {/* Decorative divider */}
        <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mt-12" />
      </section>

      {/* 3. Catalog Grid */}
      <main className="max-w-5xl mx-auto w-full px-6 py-16 flex-1">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/wiki/${game.slug}`}
              className="glass-card glass-card-hover group rounded-2xl flex flex-col overflow-hidden"
            >
              {/* Banner image or placeholder */}
              {game.bannerUrl ? (
                <div className="h-36 w-full overflow-hidden bg-zinc-950 border-b border-zinc-800/80 relative">
                  <img
                    src={game.bannerUrl}
                    alt={game.name}
                    className="h-full w-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent" />
                </div>
              ) : (
                <div className="h-36 w-full bg-zinc-900/80 border-b border-zinc-800/80 flex items-center justify-center text-zinc-700 relative">
                  <Gamepad2 size={38} className="stroke-1 opacity-30 text-zinc-400" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent" />
                </div>
              )}

              {/* Game Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    {game.logoUrl && (
                      <img src={game.logoUrl} alt={game.name} className="w-7 h-7 rounded-lg object-cover border border-zinc-700" />
                    )}
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">
                      {game.name}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-sans">
                    {game.description || 'Không có mô tả ngắn về tựa game này.'}
                  </p>
                </div>

                <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Layers size={12} className="text-cyan-400" />
                    {game._count.categories} danh mục
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={12} className="text-indigo-400" />
                    {game._count.articles} bài viết
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-zinc-800/60 py-8 px-6 text-center text-[11px] text-zinc-500 bg-zinc-950">
        <p className="font-bold tracking-wider text-zinc-400">WIGAKI - NỀN TẢNG WIKI TRÒ CHƠI ĐA THỂ LOẠI</p>
        <p className="pt-2">&copy; 2026 Wigaki Việt Nam. All rights reserved.</p>
      </footer>
    </div>
  );
}
