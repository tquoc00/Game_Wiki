'use client';

import React from 'react';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import WikiForm from '@/components/editor/WikiForm';

export default function CreateWikiPage() {
  return (
    <WikiLayoutShell>
      <WikiForm mode="create" />
    </WikiLayoutShell>
  );
}
