'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { Menu, X, Search, Gamepad2, Compass, Home, ArrowLeft, LayoutGrid, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const GAME_NAMES: Record<string, string> = {
  'lien-minh-huyen-thoai': 'Liên Minh Huyền Thoại',
  'elden-ring': 'Elden Ring',
  'black-myth-wukong': 'Black Myth: Wukong',
  'tft': 'Đấu Trường Chân Lý (TFT)',
};

export default function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const routeParams = useParams();
  const pathname = usePathname();

  const gameSlug = (routeParams['game-slug'] as string) || '';
  const gameName = GAME_NAMES[gameSlug] || gameSlug.replace(/-/g, ' ');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (gameSlug) {
        router.push(`/wiki/${gameSlug}?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push(`/wiki?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 shadow-xl">
      {/* Top Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        
        {/* Left Side: Mobile Menu, Back Button & Brand Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800/80 hover:text-cyan-400 transition-colors md:hidden"
              aria-label="Toggle Sidebar"
              title="Danh mục"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          {/* Quick Back Button (UX) */}
          {pathname !== '/' && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-zinc-800/60 transition duration-200 active:scale-95"
              title="Quay lại trang trước"
            >
              <ArrowLeft size={15} className="text-cyan-400" />
              <span className="hidden sm:inline">TRỞ VỀ</span>
            </button>
          )}

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group ml-1 sm:ml-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <Gamepad2 size={20} />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-white uppercase md:text-2xl font-sans">
              WI<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">GAKI</span>
            </span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden max-w-md flex-1 px-6 md:flex"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder={gameSlug ? `Tra cứu dữ liệu ${gameName}...` : "Tra cứu tất cả tựa game..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800/90 py-2 pl-4 pr-10 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 text-zinc-500 hover:text-cyan-400 cursor-pointer transition-colors"
              title="Tìm kiếm"
            >
              <Search size={16} />
            </button>
          </div>
        </form>

        {/* Right Side: Home, Catalog & Navigation UX Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Nút Home (Trang Chủ) */}
          <Link
            href="/"
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              pathname === '/'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-md shadow-cyan-500/10'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-zinc-800/80'
            }`}
            title="Về Trang Chủ"
          >
            <Home size={15} className="text-cyan-400" />
            <span className="hidden sm:inline">TRANG CHỦ</span>
          </Link>

          {/* Nút Thư Viện Wiki (Catalog) */}
          <Link
            href="/wiki"
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              pathname === '/wiki'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-md shadow-cyan-500/10'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-zinc-800/80'
            }`}
            title="Thư viện Game Wiki"
          >
            <LayoutGrid size={15} className="text-cyan-400" />
            <span className="hidden md:inline">THƯ VIỆN GAME</span>
          </Link>
        </div>

      </div>

      {/* Sub-header Breadcrumb Bar for Game Pages */}
      {gameSlug && (
        <div className="border-t border-zinc-800/50 bg-zinc-950/60 px-4 py-1.5 md:px-8 text-xs font-medium text-zinc-400 flex items-center justify-between overflow-x-auto">
          <div className="mx-auto flex max-w-7xl w-full items-center gap-2 whitespace-nowrap">
            <Link href="/" className="hover:text-cyan-400 transition flex items-center gap-1">
              <Home size={12} /> Trang Chủ
            </Link>
            <ChevronRight size={12} className="text-zinc-600" />
            <Link href="/wiki" className="hover:text-cyan-400 transition flex items-center gap-1">
              Thư Viện Wiki
            </Link>
            <ChevronRight size={12} className="text-zinc-600" />
            <span className="font-bold text-cyan-400 uppercase">{gameName}</span>
          </div>
        </div>
      )}
    </nav>
  );
}
