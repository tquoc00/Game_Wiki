import React from 'react';
import Link from 'next/link';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import { Calendar, User as UserIcon, Tag, ArrowLeft, ArrowRight, ShieldAlert, Gamepad2, Sparkles } from 'lucide-react';

interface SearchParams {
  search?: string;
  category?: string;
  page?: string;
}

export const revalidate = 0; // Disable caching to fetch live updates

export default async function GameWikiListPage({
  params,
  searchParams,
}: {
  params: Promise<{ 'game-slug': string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { 'game-slug': gameSlug } = await params;
  const { search = '', category = '', page = '1' } = await searchParams;

  const currentPage = parseInt(page, 10) || 1;
  const limit = 6;

  let gameInfo: any = null;
  let articles: any[] = [];
  let totalCount = 0;
  let totalPages = 0;
  let activeCategory: any = null;
  let errorMsg = '';

  try {
    // 1. Fetch game details
    const gameRes = await fetch(`http://localhost:5000/api/games/${gameSlug}`, {
      cache: 'no-store',
    });

    if (gameRes.ok) {
      const gameData = await gameRes.json();
      gameInfo = gameData.game;
    } else {
      errorMsg = 'Không tìm thấy trò chơi yêu cầu.';
    }

    if (gameInfo) {
      // 2. Fetch scoped articles from backend
      const articlesQuery = new URLSearchParams({
        gameSlug,
        page: String(currentPage),
        limit: String(limit),
        ...(search && { search }),
        ...(category && { category }),
      });

      const articlesRes = await fetch(`http://localhost:5000/api/articles?${articlesQuery.toString()}`, {
        cache: 'no-store',
      });

      if (articlesRes.ok) {
        const data = await articlesRes.json();
        articles = data.articles || [];
        totalCount = data.pagination?.total || 0;
        totalPages = data.pagination?.pages || 0;
      }

      // 3. Fetch categories to identify active category
      const categoriesRes = await fetch(`http://localhost:5000/api/categories?gameSlug=${gameSlug}`, {
        cache: 'no-store',
      });

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        const categoriesList = categoriesData.categories || [];
        if (category) {
          activeCategory = categoriesList.find((cat: any) => cat.slug === category) || null;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching data from API for game wiki:', error);
    errorMsg = 'Lỗi kết nối đến máy chủ dữ liệu.';
  }

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (errorMsg || !gameInfo) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-400 flex flex-col items-center justify-center font-sans p-6">
        <div className="glass-card rounded-2xl p-12 max-w-md text-center border-rose-500/20">
          <ShieldAlert className="mx-auto text-rose-400 mb-4 stroke-1" size={48} />
          <p className="text-base text-zinc-300 mb-6">{errorMsg || 'Không tìm thấy thông tin trò chơi này.'}</p>
          <Link href="/wiki" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition duration-300">
            Quay lại trang danh mục
          </Link>
        </div>
      </div>
    );
  }

  return (
    <WikiLayoutShell>
      {/* Game Banner Header */}
      <div className="mb-8 border-b border-zinc-800/80 pb-6 relative">
        <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-wider text-cyan-400 uppercase">WIGAKI WIKI HUB</span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">{gameInfo.name}</span>
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
              {activeCategory ? activeCategory.name : search ? `Tìm kiếm: "${search}"` : `Thư viện ${gameInfo.name}`}
            </h1>
            <p className="mt-2 text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
              {activeCategory ? activeCategory.description : search ? `Tìm thấy ${totalCount} bài viết kết quả.` : gameInfo.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 text-xs font-medium text-cyan-400">
              <Gamepad2 size={14} /> {totalCount} bài viết tra cứu
            </span>
          </div>
        </div>
      </div>

      {/* Featured Banner for League of Legends (Live Data Dragon Champions) */}
      {gameSlug === 'lien-minh-huyen-thoai' && (
        <div className="mb-8 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Riot Games Data Dragon
                </span>
                <span className="text-xs text-amber-300 font-semibold">&bull; Cập nhật tự động</span>
              </div>
              <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">📖 Bách Khoa Toàn Thư 170+ Tướng LMHT</h2>
              <p className="text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
                Tra cứu chỉ số máu, sát thương, giáp, chiêu thức và hình ảnh chính thức của 170+ tướng Liên Minh Huyền Thoại từ server Riot.
              </p>
            </div>
            <Link
              href="/wiki/lien-minh-huyen-thoai/champions"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-lg shadow-amber-500/20 transition duration-300 shrink-0"
            >
              <Sparkles size={15} /> XEM 170+ TƯỚNG RIOT
            </Link>
          </div>
        </div>
      )}

      {/* Search Input for Game Wiki */}
      <div className="max-w-md mb-8">
        <form action={`/wiki/${gameSlug}`} method="GET" className="relative">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder={`Tìm kiếm trong thư viện ${gameInfo.name}...`}
            className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800/80 focus:border-cyan-500/60 py-3 pl-4 pr-12 text-zinc-200 placeholder-zinc-500 outline-none transition duration-300 text-xs font-sans tracking-wide"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 rounded-lg bg-cyan-500 p-1.5 text-zinc-950 hover:bg-cyan-400 transition duration-200 cursor-pointer"
          >
            <Gamepad2 size={15} />
          </button>
        </form>
      </div>

      {/* Grid List of Scoped Articles */}
      {articles.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <ShieldAlert className="mx-auto text-zinc-600 mb-4 stroke-1" size={48} />
          <p className="text-base text-zinc-400 font-sans">Chưa có bài viết nào phù hợp tại đây.</p>
          {(search || category) && (
            <Link
              href={`/wiki/${gameSlug}`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-200 transition duration-300"
            >
              Quay lại thư viện game
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="glass-card glass-card-hover group flex flex-col overflow-hidden rounded-2xl h-full"
            >
              {/* Featured Image */}
              <div className="relative h-44 w-full overflow-hidden bg-zinc-950 border-b border-zinc-800/80">
                <img
                  src={article.featuredImg || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60'}
                  alt={article.title}
                  className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-95"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="flex items-center gap-1 rounded-lg bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-cyan-400 border border-cyan-500/20 uppercase">
                    <Tag size={10} />
                    {article.category.name}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-5 justify-between">
                <div className="space-y-2">
                  <h2 className="line-clamp-2 text-sm font-bold text-zinc-100 hover:text-cyan-400 transition-colors leading-snug uppercase tracking-wide">
                    <Link href={`/wiki/${gameSlug}/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className="line-clamp-3 text-xs text-zinc-400 leading-relaxed font-sans">
                    {article.summary || 'Không có mô tả ngắn.'}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <UserIcon size={11} className="text-cyan-400" />
                    {article.author.username}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} />
                    {formatDate(article.updatedAt)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-6 font-sans">
          <Link
            href={`/wiki/${gameSlug}?${new URLSearchParams({
              ...(search && { search }),
              ...(category && { category }),
              page: String(currentPage - 1),
            }).toString()}`}
            className={`flex items-center gap-1.5 rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition duration-300 ${
              currentPage === 1
                ? 'pointer-events-none text-zinc-700 bg-transparent border-zinc-800/40 cursor-not-allowed'
                : 'text-zinc-200 hover:text-cyan-400 bg-zinc-900/80 hover:border-cyan-500/50'
            }`}
          >
            <ArrowLeft size={13} />
            Trước
          </Link>

          <span className="text-xs text-zinc-400">
            Trang <strong className="text-cyan-400">{currentPage}</strong> / {totalPages}
          </span>

          <Link
            href={`/wiki/${gameSlug}?${new URLSearchParams({
              ...(search && { search }),
              ...(category && { category }),
              page: String(currentPage + 1),
            }).toString()}`}
            className={`flex items-center gap-1.5 rounded-xl border border-zinc-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition duration-300 ${
              currentPage === totalPages
                ? 'pointer-events-none text-zinc-700 bg-transparent border-zinc-800/40 cursor-not-allowed'
                : 'text-zinc-200 hover:text-cyan-400 bg-zinc-900/80 hover:border-cyan-500/50'
            }`}
          >
            Sau
            <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </WikiLayoutShell>
  );
}
