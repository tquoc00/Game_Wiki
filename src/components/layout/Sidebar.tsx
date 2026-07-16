'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useParams } from 'next/navigation';
import { BookOpen, Sword, Compass, Sparkles, ChevronRight, List } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeParams = useParams();
  
  const gameSlug = (routeParams['game-slug'] as string) || '';
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    async function fetchCategories() {
      if (!gameSlug) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/categories?gameSlug=${gameSlug}`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [gameSlug]);

  // Icon mapping helper based on slug
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'vu-khi':
      case 'vu-khi-trang-bi':
      case 'trang-bi':
        return <Sword size={16} className="text-cyan-400" />;
      case 'nhan-vat':
      case 'tuong':
      case 'champions':
        return <Sparkles size={16} className="text-cyan-400" />;
      case 'ban-do-cot-truyen':
      case 'nhiem-vu-cot-truyen':
      case 'ban-do':
      case 'maps':
        return <Compass size={16} className="text-cyan-400" />;
      default:
        return <BookOpen size={16} className="text-cyan-400" />;
    }
  };

  if (!gameSlug) return null;

  const sidebarContent = (
    <div className="flex h-full flex-col p-4 text-left font-sans">
      {/* Header Info */}
      <div className="mb-6 px-2">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-zinc-400">
          <List size={14} className="text-cyan-400" />
          Danh Mục Tra Cứu
        </h3>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 font-sans">
        {/* Riot Data Dragon Champions Special Banner Link */}
        {gameSlug === 'lien-minh-huyen-thoai' && (
          <Link
            href="/wiki/lien-minh-huyen-thoai/champions"
            onClick={onClose}
            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 mb-3 ${
              pathname === '/wiki/lien-minh-huyen-thoai/champions'
                ? 'bg-amber-500/20 text-amber-400 border-l-2 border-amber-400 pl-3'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-amber-400 animate-pulse" />
              <span>170+ Tướng Riot Data</span>
            </div>
            <ChevronRight size={12} className="text-amber-400" />
          </Link>
        )}

        <Link
          href={`/wiki/${gameSlug}`}
          onClick={onClose}
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
            pathname === `/wiki/${gameSlug}` && !activeCategory
              ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400 pl-3'
              : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <BookOpen size={16} className="text-cyan-400" />
            <span>Tất Cả Bài Viết</span>
          </div>
          <ChevronRight size={12} className="text-zinc-600" />
        </Link>

        {loading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-full animate-pulse rounded-xl bg-zinc-900/60" />
            ))}
          </div>
        ) : (
          categories.map((category) => {
            const isTuongCategory = category.slug === 'tuong' && gameSlug === 'lien-minh-huyen-thoai';
            const isTrangBiCategory = category.slug === 'trang-bi' && gameSlug === 'lien-minh-huyen-thoai';

            let targetHref = `/wiki/${gameSlug}?category=${category.slug}`;
            if (isTuongCategory) targetHref = '/wiki/lien-minh-huyen-thoai/champions';
            if (isTrangBiCategory) targetHref = '/wiki/lien-minh-huyen-thoai/items';

            const isActive =
              activeCategory === category.slug ||
              (isTuongCategory && pathname === '/wiki/lien-minh-huyen-thoai/champions') ||
              (isTrangBiCategory && pathname === '/wiki/lien-minh-huyen-thoai/items');

            return (
              <Link
                key={category.id}
                href={targetHref}
                onClick={onClose}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400 pl-3'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getCategoryIcon(category.slug)}
                  <span>{category.name}</span>
                </div>
                <ChevronRight size={12} className="text-zinc-600" />
              </Link>
            );
          })
        )}
      </nav>

      {/* Quick Footer inside sidebar */}
      <div className="mt-auto border-t border-zinc-800/60 pt-4 text-center text-[11px] text-zinc-500 font-sans">
        <p>&copy; 2026 Wigaki Việt Nam</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Sticky left) */}
      <aside className="hidden w-64 border-r border-zinc-800/80 bg-zinc-950/40 backdrop-blur-xl md:block sticky top-[65px] h-[calc(100vh-65px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay mask */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <aside className="relative flex w-full max-w-xs flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-300 shadow-2xl transition-transform duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
