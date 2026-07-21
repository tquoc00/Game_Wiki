import React from 'react';
import Link from 'next/link';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import { Calendar, User as UserIcon, Tag, ArrowLeft, ArrowRight, ShieldAlert, Gamepad2, Sparkles } from 'lucide-react';

interface SearchParams {
  search?: string;
  category?: string;
  page?: string;
}

export const revalidate = 3600; // Static pre-render with hourly revalidation

export async function generateStaticParams() {
  return [
    { 'game-slug': 'lien-minh-huyen-thoai' },
    { 'game-slug': 'elden-ring' },
    { 'game-slug': 'black-myth-wukong' },
    { 'game-slug': 'tft' },
  ];
}

export default async function GameWikiListPage({
  params,
}: {
  params: Promise<{ 'game-slug': string }>;
}) {
  const { 'game-slug': gameSlug } = await params;
  const search = '';
  const category = '';
  const currentPage = 1;
  const limit = 6;

  let gameInfo: any = null;
  let articles: any[] = [];
  let totalCount = 0;
  let totalPages = 0;
  let activeCategory: any = null;
  let errorMsg = '';

  const DEFAULT_GAMES: Record<string, any> = {
    'lien-minh-huyen-thoai': {
      id: 'lol',
      name: 'Liên Minh Huyền Thoại',
      slug: 'lien-minh-huyen-thoai',
      description: 'Thư viện dữ liệu tướng, trang bị, bản đồ và hướng dẫn meta Liên Minh Huyền Thoại.',
    },
    'elden-ring': {
      id: 'er',
      name: 'Elden Ring',
      slug: 'elden-ring',
      description: 'Bách khoa toàn thư về trùm, vũ khí, phép thuật và nhiệm vụ trong Elden Ring.',
    },
    'black-myth-wukong': {
      id: 'wukong',
      name: 'Black Myth: Wukong',
      slug: 'black-myth-wukong',
      description: 'Cẩm nang tra cứu Như Ý Kim Cô Bổng, Pháp Bảo, Linh Hồn Trảm Sát và Trùm Chương 1-6.',
    },
    'tft': {
      id: 'tft',
      name: 'Đấu Trường Chân Lý (TFT)',
      slug: 'tft',
      description: 'Bảng xếp hạng đội hình Meta, Tộc/Hệ, Tướng và Công thức ghép đồ TFT mới nhất.',
    },
  };

  try {
    const gameRes = await fetch(`http://localhost:5000/api/games/${gameSlug}`, {
      next: { revalidate: 3600 },
    });

    if (gameRes.ok) {
      const gameData = await gameRes.json();
      gameInfo = gameData.game;
    } else {
      gameInfo = DEFAULT_GAMES[gameSlug] || null;
    }

    if (gameInfo) {
      try {
        const articlesQuery = new URLSearchParams({
          gameSlug,
          page: String(currentPage),
          limit: String(limit),
        });

        const articlesRes = await fetch(`http://localhost:5000/api/articles?${articlesQuery.toString()}`, {
          next: { revalidate: 3600 },
        });

        if (articlesRes.ok) {
          const data = await articlesRes.json();
          articles = data.articles || [];
          totalCount = data.pagination?.total || 0;
          totalPages = data.pagination?.pages || 0;
        }
      } catch {
        // Fallback
      }

      try {
        const categoriesRes = await fetch(`http://localhost:5000/api/categories?gameSlug=${gameSlug}`, {
          next: { revalidate: 3600 },
        });

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          const categoriesList = categoriesData.categories || [];
        }
      } catch {
        // Fallback
      }
    }
  } catch (error) {
    console.error('Error fetching data from API for game wiki:', error);
    gameInfo = DEFAULT_GAMES[gameSlug] || null;
  }

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
              <Gamepad2 size={14} /> {totalCount || 'Supabase Data'} bài viết tra cứu
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

      {/* Featured Banner for Elden Ring Questlines Hub */}
      {gameSlug === 'elden-ring' && (
        <div className="mb-8 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Bách Khoa Questlines
                </span>
                <span className="text-xs text-amber-300 font-semibold">&bull; 16+ Chuỗi Nhiệm Vụ & Kết Thúc</span>
              </div>
              <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">⚔️ Tra Cứu Tất Cả Questline Elden Ring</h2>
              <p className="text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
                Hướng dẫn từng bước tất cả nhiệm vụ NPC (Ranni, Millicent, Alexander, Fia, Varré, Hyetta...) và các kết thúc game với tính năng lưu tiến trình cá nhân.
              </p>
            </div>
            <Link
              href="/wiki/elden-ring/quests"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-lg shadow-amber-500/20 transition duration-300 shrink-0"
            >
              <Sparkles size={15} /> MỞ THƯ VIỆN QUESTLINE
            </Link>
          </div>
        </div>
      )}

      {/* Featured Banner for Black Myth: Wukong */}
      {gameSlug === 'black-myth-wukong' && (
        <div className="mb-8 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Cẩm Nang Tây Du
                </span>
                <span className="text-xs text-amber-300 font-semibold">&bull; 29+ Bổng Pháp, Bảo Vật & Trùm</span>
              </div>
              <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">🐒 Kho Dữ Liệu Black Myth: Wukong</h2>
              <p className="text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
                Tra cứu chỉ số Như Ý Kim Cô Bổng, Tam Mũi Lưỡng Nhận Đao, Giáp Đại Thánh, Bảo Vật Hạt Châu Tránh Lửa và kỹ năng biến hình.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Featured Banner for TFT */}
      {gameSlug === 'tft' && (
        <div className="mb-8 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-950 p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2.5 py-0.5 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Meta Tier List
                </span>
                <span className="text-xs text-purple-300 font-semibold">&bull; Set 13 / Set 14</span>
              </div>
              <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">📊 Đội Hình Meta & Công Thức Đồ TFT</h2>
              <p className="text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
                Tra cứu các đội hình leo rank Tier S (Jinx Nổi Loạn, Lux Học Viện...), công thức ghép đồ chuẩn và Tộc/Hệ mới nhất.
              </p>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:border-cyan-500/40 transition duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    <Tag size={12} />
                    {article.category?.name || 'Tổng quan'}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {formatDate(article.updatedAt || article.createdAt)}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition duration-200 line-clamp-2 uppercase">
                  {article.title}
                </h3>

                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-sans">
                  {article.summary || article.content.replace(/<[^>]*>?/gm, '')}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <UserIcon size={13} className="text-cyan-400" />
                  {article.author?.username || 'Wigaki'}
                </span>

                <Link
                  href={`/wiki/${gameSlug}/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition duration-200 uppercase tracking-wider"
                >
                  Đọc tiếp <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </WikiLayoutShell>
  );
}
