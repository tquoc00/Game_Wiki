import React from 'react';
import Link from 'next/link';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import WikiForm from '@/components/editor/WikiForm';
import { ArrowLeft } from 'lucide-react';

interface EditPageProps {
  params: Promise<{ 'game-slug': string; slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ 'game-slug': 'lien-minh-huyen-thoai', slug: 'overview' }];
}

export default async function WikiArticleEditPage({ params }: EditPageProps) {
  const { 'game-slug': gameSlug, slug } = await params;

  let article: any = null;

  try {
    const res = await fetch(`http://localhost:5000/api/articles/${slug}?gameSlug=${gameSlug}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      article = data.article;
    }
  } catch (error) {
    console.error('Error fetching article for editing:', error);
  }

  if (!article) {
    article = {
      id: 'default',
      title: `Hướng dẫn tra cứu ${slug.replace(/-/g, ' ').toUpperCase()}`,
      summary: 'Thông tin dữ liệu tổng quan cho tựa game.',
      content: '<p>Nội dung chi tiết đang được cập nhật từ hệ thống Wigaki Hub.</p>',
      categoryId: '',
    };
  }

  return (
    <WikiLayoutShell>
      <div className="mb-6 font-sans">
        <Link
          href={`/wiki/${gameSlug}/${slug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition duration-200"
        >
          <ArrowLeft size={14} />
          Trở Về Bài Viết
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-6 text-left">
        <div>
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            Hiệu Chỉnh Dữ Liệu
          </span>
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
            Chỉnh Sửa Bài Viết
          </h1>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          <WikiForm
            mode="edit"
            slug={slug}
            initialData={{
              title: article.title,
              summary: article.summary,
              content: article.content,
              categoryId: article.categoryId || '',
              featuredImg: article.featuredImg || '',
              published: article.published ?? true,
            }}
          />
        </div>
      </div>
    </WikiLayoutShell>
  );
}
