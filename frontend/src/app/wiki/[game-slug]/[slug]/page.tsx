import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import { Calendar, User as UserIcon, Tag, History, ArrowLeft, Gamepad2, Compass, ShieldCheck } from 'lucide-react';

interface PageProps {
  params: Promise<{ 'game-slug': string; slug: string }>;
}

export const revalidate = 0; // Live updates

export default async function WikiArticlePage({ params }: PageProps) {
  const { 'game-slug': gameSlug, slug } = await params;

  let article: any = null;

  try {
    const res = await fetch(`http://localhost:5000/api/articles/${slug}?gameSlug=${gameSlug}`, {
      cache: 'no-store',
    });

    if (res.status === 404) {
      notFound();
    }

    if (res.ok) {
      const data = await res.json();
      article = data.article;
    }
  } catch (error) {
    console.error('Error fetching article details from API:', error);
  }

  if (!article) {
    notFound();
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <WikiLayoutShell>
      {/* Back to Library Navigation Link */}
      <div className="mb-6 font-sans">
        <Link
          href={`/wiki/${gameSlug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-cyan-400 transition duration-200"
        >
          <ArrowLeft size={15} />
          Trở về Thư viện {article.game.name}
        </Link>
      </div>

      {/* Main Grid: Left is Content (large), Right is Metadata Widget (small) */}
      <div className="grid gap-8 lg:grid-cols-4">
        
        {/* Left Column: Article Body (Takes up 3/4 space) */}
        <article className="lg:col-span-3 space-y-6 text-left font-sans">
          {/* Category Badge & Title */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 px-3 py-1 text-[11px] font-bold text-cyan-400 uppercase">
              <Tag size={12} />
              {article.category.name}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Metadata Banner */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 border-b border-zinc-800/80 pb-4 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <UserIcon size={13} className="text-cyan-400" />
              Biên soạn: <strong className="text-zinc-200 font-semibold">{article.author.username}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              Cập nhật: {formatDate(article.updatedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              Thông tin đã xác thực
            </span>
          </div>

          {/* Featured Image Banner */}
          {article.featuredImg && (
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 aspect-[21/9] w-full bg-zinc-950 shadow-xl">
              <img
                src={article.featuredImg}
                alt={article.title}
                className="h-full w-full object-cover opacity-90"
              />
            </div>
          )}

          {/* Render HTML Content */}
          <div 
            className="wiki-content prose prose-invert max-w-none pt-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Right Column: Sidebar Article Quick Info Widget */}
        <aside className="lg:col-span-1 space-y-6 text-left font-sans">
          {/* Information Summary Box */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-300 border-b border-zinc-800/80 pb-2 flex items-center gap-2">
              <Gamepad2 size={15} className="text-cyan-400" />
              THÔNG TIN TRÒ CHƠI
            </h3>

            <div className="space-y-3 font-sans text-xs">
              <div>
                <span className="text-zinc-500 uppercase text-[10px] font-bold block mb-0.5">Trò chơi</span>
                <span className="text-zinc-200 font-medium">{article.game.name}</span>
              </div>

              <div>
                <span className="text-zinc-500 uppercase text-[10px] font-bold block mb-0.5">Phân loại</span>
                <Link 
                  href={`/wiki/${gameSlug}?category=${article.category.slug}`}
                  className="text-cyan-400 hover:underline font-medium"
                >
                  {article.category.name}
                </Link>
              </div>

              <div className="pt-2 border-t border-zinc-800/60">
                <Link
                  href={`/wiki/${gameSlug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-200 transition duration-300"
                >
                  <Compass size={14} className="text-cyan-400" />
                  XEM TẤT CẢ BÀI VIẾT
                </Link>
              </div>
            </div>
          </div>

          {/* Page Info Box */}
          <div className="glass-card rounded-2xl p-5 text-xs text-zinc-400 space-y-3 leading-relaxed">
            <h4 className="font-bold text-zinc-200 tracking-wide">Trang tra cứu Wigaki:</h4>
            <p>
              Tất cả tài nguyên thông tin trên Wigaki được biên soạn trực tuyến và cung cấp hoàn toàn miễn phí cho cộng đồng người chơi.
            </p>
          </div>
        </aside>

      </div>
    </WikiLayoutShell>
  );
}
