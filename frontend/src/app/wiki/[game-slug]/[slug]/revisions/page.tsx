import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import { ArrowLeft, GitCommit, User as UserIcon, Calendar, Eye } from 'lucide-react';

interface RevisionsPageProps {
  params: Promise<{ 'game-slug': string; slug: string }>;
}

export const revalidate = 0; // Disable cache for history pages

export default async function WikiRevisionsPage({ params }: RevisionsPageProps) {
  const { 'game-slug': gameSlug, slug } = await params;

  let article: any = null;
  let revisions: any[] = [];

  try {
    // 1. Fetch main article details
    const articleRes = await fetch(`http://localhost:5000/api/articles/${slug}?gameSlug=${gameSlug}`, {
      cache: 'no-store',
    });

    if (articleRes.status === 404) {
      notFound();
    }

    if (articleRes.ok) {
      const data = await articleRes.json();
      article = data.article;
    }

    // 2. Fetch article revisions list
    const revisionsRes = await fetch(`http://localhost:5000/api/articles/${slug}/revisions?gameSlug=${gameSlug}`, {
      cache: 'no-store',
    });

    if (revisionsRes.ok) {
      const data = await revisionsRes.json();
      revisions = data.revisions || [];
    }
  } catch (error) {
    console.error('Error fetching revisions list:', error);
  }

  if (!article) {
    notFound();
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
      {/* Back button */}
      <div className="mb-6 font-serif">
        <Link
          href={`/wiki/${gameSlug}/${slug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a059] hover:text-[#f4edd9] transition duration-200"
        >
          <ArrowLeft size={14} />
          Trở Về
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-8 text-left">
        <div>
          <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest font-serif block mb-1">Cổ thư tu chỉnh</span>
          <h1 className="text-3xl font-bold font-serif text-[#f4edd9] tracking-wider">
            {article.title}
          </h1>
          <p className="text-xs text-zinc-400 mt-2">
            Xem lại tất cả các bản chép cũ, các vết đổi thông số vũ khí, nhân vật của cựu binh.
          </p>
        </div>

        {revisions.length === 0 ? (
          <div className="soul-card rounded p-10 text-center text-zinc-500 border-[#2c2921] font-serif">
            Chưa tìm thấy bản sửa đổi nào của bài viết này.
          </div>
        ) : (
          <div className="relative border-l border-[#2c2921] pl-6 ml-3 space-y-8 py-2">
            {revisions.map((rev, idx) => (
              <div key={rev.id} className="relative">
                {/* Timeline node icon */}
                <span className="absolute -left-[35px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#0a0a0c] border border-[#c5a059] text-[#c5a059] shadow-[0_0_8px_rgba(197,160,89,0.25)]">
                  <GitCommit size={12} />
                </span>

                {/* Revision Card */}
                <div className="soul-card rounded p-5 border-[#2c2921]">
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#2c2921] pb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 font-serif uppercase tracking-wider block">
                        Phiên bản {revisions.length - idx}
                      </span>
                      <h3 className="text-sm font-serif font-bold text-[#f4edd9] tracking-wide">
                        {rev.summary || 'Khởi tạo dữ liệu ban đầu'}
                      </h3>
                    </div>

                    <Link
                      href={`/wiki/${gameSlug}/${slug}/revisions/${rev.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#111115] hover:bg-[#c5a059]/5 border border-[#c5a059]/40 hover:border-[#c5a059] text-[10px] font-bold font-serif uppercase tracking-widest text-[#c5a059] transition duration-300"
                    >
                      <Eye size={10} />
                      Đọc Cổ Thư
                    </Link>
                  </div>

                  {/* Editor Info */}
                  <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-zinc-500 font-serif">
                    <span className="flex items-center gap-1.5">
                      <UserIcon size={12} className="text-[#c5a059]" />
                      Người chép: <strong className="text-[#c5a059] font-medium">{rev.user.username}</strong>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      Tu chỉnh vào: {formatDate(rev.createdAt)}
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
