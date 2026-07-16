import React from 'react';
import Link from 'next/link';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import { Calendar, User as UserIcon, Tag, ArrowLeft, Edit3, History, ShieldAlert } from 'lucide-react';

interface WikiArticlePageProps {
  params: Promise<{ 'game-slug': string; slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ 'game-slug': 'lien-minh-huyen-thoai', slug: 'overview' }];
}

export default async function WikiArticleDetailPage({ params }: WikiArticlePageProps) {
  const { 'game-slug': gameSlug, slug } = await params;

  let article: any = null;
  let errorMsg = '';

  try {
    const res = await fetch(`http://localhost:5000/api/articles/${slug}?gameSlug=${gameSlug}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      article = data.article;
    }
  } catch (error) {
    console.error('Error fetching article details from API:', error);
  }

  if (!article) {
    article = {
      title: `Hướng dẫn tra cứu ${slug.replace(/-/g, ' ').toUpperCase()}`,
      summary: 'Thông tin dữ liệu tổng quan cho tựa game.',
      content: '<p>Nội dung chi tiết đang được cập nhật từ hệ thống Wigaki Hub.</p>',
      author: { username: 'Wigaki Team' },
      category: { name: 'Tổng quan' },
      game: { name: gameSlug.replace(/-/g, ' ').toUpperCase(), slug: gameSlug },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <WikiLayoutShell>
      <div className="mb-6 font-sans">
        <Link
          href={`/wiki/${gameSlug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition duration-200"
        >
          <ArrowLeft size={14} />
          Trở Về Thư Viện {gameSlug.replace(/-/g, ' ')}
        </Link>
      </div>

      <article className="glass-card rounded-2xl p-6 md:p-10 text-left space-y-8">
        <header className="space-y-4 border-b border-zinc-800/80 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 text-[11px] font-bold text-cyan-400 uppercase">
              <Tag size={12} />
              {article.category.name}
            </span>

            <div className="flex items-center gap-3">
              <Link
                href={`/wiki/${gameSlug}/${slug}/edit`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-cyan-400 transition duration-200"
              >
                <Edit3 size={13} />
                Sửa bài
              </Link>
              <Link
                href={`/wiki/${gameSlug}/${slug}/revisions`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-cyan-400 transition duration-200"
              >
                <History size={13} />
                Lịch sử
              </Link>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white uppercase leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 pt-2 font-sans">
            <span className="flex items-center gap-2">
              <UserIcon size={14} className="text-cyan-400" />
              Tác giả: <strong className="text-zinc-200">{article.author.username}</strong>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              Cập nhật: {formatDate(article.updatedAt)}
            </span>
          </div>
        </header>

        {article.summary && (
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-4 text-xs md:text-sm text-zinc-300 italic leading-relaxed">
            {article.summary}
          </div>
        )}

        <div
          className="prose prose-invert max-w-none text-xs md:text-sm text-zinc-300 leading-relaxed font-sans"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </WikiLayoutShell>
  );
}
