import React from 'react';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import WikiForm from '@/components/editor/WikiForm';

export function generateStaticParams() {
  return [
    { 'game-slug': 'lien-minh-huyen-thoai' },
    { 'game-slug': 'elden-ring' },
    { 'game-slug': 'valorant' },
  ];
}

export default function CreateWikiPage() {
  return (
    <WikiLayoutShell>
      <WikiForm mode="create" />
    </WikiLayoutShell>
  );
}

