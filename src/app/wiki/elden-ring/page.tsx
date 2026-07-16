import React from 'react';
import { getEldenRingFullWikiData } from '@/lib/dataService';
import { EldenRingWikiView } from '@/components/elden-ring/EldenRingWikiView';

export const revalidate = 3600; // Next.js ISR: 1 hour

export default async function EldenRingWikiPage() {
  const fullWikiData = await getEldenRingFullWikiData();

  return <EldenRingWikiView initialData={fullWikiData} />;
}
