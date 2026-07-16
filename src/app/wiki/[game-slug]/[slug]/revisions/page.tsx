import React from 'react';
import Link from 'next/link';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import { ArrowLeft, GitCommit, User as UserIcon, Calendar, Eye } from 'lucide-react';

interface RevisionsPageProps {
  params: Promise<{ 'game-slug': string; slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ 'game-slug': 'lien-minh-huyen-thoai', slug: 'overview' }];
}

export default async function WikiRevisionsPage({ params }: RevisionsPageProps) {
  const { 'game-slug': gameSlug, slug } = await params;

  let article: any = null;
  let revisions: any[] = [];

  try {
    const articleRes = await fetch(`http://localhost:5000/api/articles/${slug}?gameSlug=${gameSlug}`, {
      next: { revalidate: 3600 },
    });

    if (articleRes.ok) {
      const data = await articleRes.json();
      article = data.article;
    }

    const revisionsRes = await fetch(`http://localhost:5000/api/articles/${slug}/revisions?gameSlug=${gameSlug}`, {
      next: { revalidate: 3600 },
    });

    if (revisionsRes.ok) {
      const data = await revisionsRes.json();
      revisions = data.revisions || [];
    }
  } catch (error) {
    console.error('Error fetching revisions list:', error);
  }

  if (!article) {
    article = {
      title: `Lịch sử tu chỉnh ${slug.replace(/-/g, ' ').toUpperCase()}`,
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
          href={`/wiki/${gameSlug}/${slug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition duration-200"
        >
          <ArrowLeft size={14} />
          Trở Về
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-left font-sans">
        <div>
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">Lịch sử thay đổi</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
            {article.title}
          </h1>
          <p className="text-xs text-zinc-400 mt-2">
            Xem lại tất cả các bản chỉnh sửa và lịch sử cập nhật.
          </p>
        </div>

        {revisions.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center text-zinc-400">
            Chưa tìm thấy bản sửa đổi nào của bài viết này.
          </div>
        ) : (
          <div className="relative border-l border-zinc-800 pl-6 ml-3 space-y-8 py-2">
            {revisions.map((rev, idx) => (
              <div key={rev.id} className="relative">
                <span className="absolute -left-[35px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950 border border-cyan-400 text-cyan-400">
                  <GitCommit size={12} />
                </span>

                <div className="glass-card rounded-2xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-zinc-800/80 pb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                        Phiên bản {revisions.length - idx}
                      </span>
                      <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                        {rev.summary || 'Khởi tạo dữ liệu ban đầu'}
                      </h3>
                    </div>

                    <Link
                      href={`/wiki/${gameSlug}/${slug}/revisions/${rev.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-cyan-400 transition duration-300"
                    >
                      <Eye size={10} />
                      Xem phiên bản
                    </Link>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <UserIcon size={12} className="text-cyan-400" />
                      Người cập nhật: <strong className="text-zinc-200">{rev.user.username}</strong>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      Thời gian: {formatDate(rev.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WikiLayoutShell>
  );
}
