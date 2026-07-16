'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Menu, X, Search, Gamepad2, Compass } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const routeParams = useParams();
  
  const gameSlug = (routeParams['game-slug'] as string) || '';

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
    <nav className="sticky top-0 z-50 w-full px-4 py-3.5 md:px-8 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Left Side: Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-cyan-400 transition-colors md:hidden"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <Gamepad2 size={18} />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-white uppercase md:text-2xl font-sans">
              WI<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">GAKI</span>
            </span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden max-w-md flex-1 px-4 md:flex"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder={gameSlug ? "Tra cứu trong thư viện trò chơi..." : "Tra cứu tất cả các trò chơi..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800/80 py-2 pl-4 pr-10 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 text-zinc-500 hover:text-cyan-400 cursor-pointer transition-colors"
            >
              <Search size={16} />
            </button>
          </div>
        </form>

        {/* Right Side: Quick Navigation Link & Mobile Search */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button 
            onClick={() => router.push(gameSlug ? `/wiki/${gameSlug}` : '/wiki')}
            className="rounded-lg p-2 text-zinc-400 hover:text-cyan-400 md:hidden transition-colors"
          >
            <Search size={20} />
          </button>

          <Link
            href="/wiki"
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs font-semibold text-zinc-200 hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-pointer"
          >
            <Compass size={15} className="text-cyan-400" />
            <span>KHÁM PHÁ THƯ VIỆN</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}
