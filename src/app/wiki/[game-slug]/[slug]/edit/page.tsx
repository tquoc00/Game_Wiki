import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/auth';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import WikiForm from '@/components/editor/WikiForm';

interface EditPageProps {
  params: Promise<{ 'game-slug': string; slug: string }>;
}

export const revalidate = 0; // Disable cache for edit pages

export async function generateStaticParams() {
  return [];
}


export default async function EditWikiPage({ params }: EditPageProps) {
  const { 'game-slug': gameSlug, slug } = await params;

  let article: any = null;

  try {
    // 1. Fetch original article from Express backend
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
    console.error('Error fetching article for editing:', error);
  }

  if (!article) {
    notFound();
  }

  // 2. Server-side authorization check (requires EDITOR or ADMIN)
  const currentUser = await getServerCurrentUser();

  if (!currentUser || (currentUser.role !== 'EDITOR' && currentUser.role !== 'ADMIN')) {
    redirect(`/wiki/${gameSlug}/${slug}`);
  }

  const initialData = {
    title: article.title,
    content: article.content,
    summary: article.summary || '',
    featuredImg: article.featuredImg || '',
    categoryId: article.categoryId,
    published: article.published,
  };

  return (
    <WikiLayoutShell>
      <WikiForm mode="edit" slug={slug} initialData={initialData} />
    </WikiLayoutShell>
  );
}
