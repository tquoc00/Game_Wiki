import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/auth';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import RestoreButton from './RestoreButton';

interface RevisionDetailsPageProps {
  params: Promise<{ 'game-slug': string; slug: string; id: string }>;
}

export const revalidate = 0; // Disable cache for revision view

export default async function WikiRevisionDetailsPage({ params }: RevisionDetailsPageProps) {
  const { 'game-slug': gameSlug, slug, id } = await params;

  let revision: any = null;

  try {
    // 1. Fetch revision from Express backend
    const res = await fetch(`http://localhost:5000/api/revisions/${id}`, {
      cache: 'no-store',
    });

    if (res.status === 404) {
      notFound();
    }

    if (res.ok) {
      const data = await res.json();
      revision = data.revision;
    }
  } catch (error) {
    console.error('Error fetching revision detail:', error);
  }

  if (!revision || revision.article.slug !== slug || revision.article.game.slug !== gameSlug) {
    notFound();
  }

  // 2. Server-side auth check for Restore button (requires EDITOR or ADMIN)
  const currentUser = await getServerCurrentUser();
  const canRestore = currentUser && (currentUser.role === 'EDITOR' || currentUser.role === 'ADMIN');

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
      {/* Back to revisions list */}
      <div className="mb-6 font-serif">
        <Link
          href={`/wiki/${gameSlug}/${slug}/revisions`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a059] hover:text-[#f4edd9] transition duration-200"
        >
          <ArrowLeft size={14} />
          Trở Lại Lịch Sử
        </Link>
      </div>

      <div className="space-y-6 text-left">
        {/* Revision Warning Banner */}
        <div className="rounded border border-[#c5a059]/30 bg-[#161511] p-5 text-xs text-zinc-400 flex flex-wrap items-center justify-between gap-4 font-serif">
          <div className="space-y-1">
            <h4 className="font-bold flex items-center gap-2 text-sm text-[#c5a059] uppercase tracking-wide">
              <ShieldAlert className="text-[#c5a059]" size={16} />
              Bản ghi lịch sử lưu trữ
            </h4>
            <p className="text-zinc-300 font-sans">
              Đã sao lưu vào lúc <strong>{formatDate(revision.createdAt)}</strong> bởi thủ thư <strong>{revision.user.username}</strong>.
            </p>
            <p className="text-zinc-500 font-sans text-xs italic">
              Lý do ghi nhận: {revision.summary || 'Không ghi rõ lý do.'}
            </p>
          </div>

          {canRestore && (
            <RestoreButton
              slug={slug}
              gameSlug={gameSlug}
              title={revision.article.title}
              content={revision.fullContent}
              categoryId={revision.article.categoryId}
              revisionDate={formatDate(revision.createdAt)}
            />
          )}
        </div>

        {/* Article content container */}
        <article className="soul-card rounded p-6 md:p-8 space-y-6 max-w-4xl mx-auto border-[#2c2921]">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#f4edd9] tracking-wider border-b border-[#2c2921] pb-4">
            {revision.article.title} <span className="text-zinc-500 text-xs font-normal font-sans uppercase tracking-wider block mt-1">(Bản Cổ thư Lưu trữ)</span>
          </h1>

          <div 
            className="wiki-content prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: revision.fullContent }}
          />
        </article>
      </div>
    </WikiLayoutShell>
  );
}
