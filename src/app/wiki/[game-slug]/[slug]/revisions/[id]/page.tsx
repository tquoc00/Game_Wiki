import React from 'react';
import Link from 'next/link';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import { ArrowLeft, User as UserIcon, Calendar, GitCommit } from 'lucide-react';
import RestoreButton from './RestoreButton';

interface RevisionDetailPageProps {
  params: Promise<{ 'game-slug': string; slug: string; id: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ 'game-slug': 'lien-minh-huyen-thoai', slug: 'overview', id: 'default' }];
}

export default async function WikiRevisionDetailPage({ params }: RevisionDetailPageProps) {
  const { 'game-slug': gameSlug, slug, id } = await params;

  let revision: any = null;

  try {
    const res = await fetch(`http://localhost:5000/api/revisions/${id}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      revision = data.revision;
    }
  } catch (error) {
    console.error('Error fetching revision detail:', error);
  }

  if (!revision) {
    revision = {
      id,
      title: `Bản ghi tu chỉnh ${slug.replace(/-/g, ' ').toUpperCase()}`,
      summary: 'Khởi tạo dữ liệu ban đầu',
      content: '<p>Nội dung phiên bản tu chỉnh đang được lưu trữ trên hệ thống.</p>',
      user: { username: 'Wigaki System' },
      createdAt: new Date().toISOString(),
      articleId: 'default',
    };
  }

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
      <div className="mb-6 font-sans">
        <Link
          href={`/wiki/${gameSlug}/${slug}/revisions`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition duration-200"
        >
          <ArrowLeft size={14} />
          Trở Về Lịch Sử
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-6 text-left font-sans">
        <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
          <header className="border-b border-zinc-800/80 pb-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 text-[10px] font-bold text-cyan-400 uppercase">
                <GitCommit size={11} />
                Bản Tu Chỉnh {id.slice(0, 8)}
              </span>

              <RestoreButton
                articleId={revision.articleId}
                revisionTitle={revision.title}
                revisionSummary={revision.summary}
                revisionContent={revision.content}
                gameSlug={gameSlug}
                slug={slug}
              />
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-wide">
              {revision.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <UserIcon size={13} className="text-cyan-400" />
                Người tu chỉnh: <strong className="text-zinc-200">{revision.user.username}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Thời gian: {formatDate(revision.createdAt)}
              </span>
            </div>
          </header>

          {revision.summary && (
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-3.5 text-xs text-zinc-300 italic">
              Ghi chú: {revision.summary}
            </div>
          )}

          <div
            className="prose prose-invert max-w-none text-xs md:text-sm text-zinc-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: revision.content }}
          />
        </div>
      </div>
    </WikiLayoutShell>
  );
}
