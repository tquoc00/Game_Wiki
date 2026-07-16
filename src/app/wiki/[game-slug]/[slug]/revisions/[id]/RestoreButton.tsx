'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw, Loader2 } from 'lucide-react';

interface RestoreButtonProps {
  slug: string;
  gameSlug: string;
  title: string;
  content: string;
  categoryId: string;
  revisionDate: string;
}

export default function RestoreButton({
  slug,
  gameSlug,
  title,
  content,
  categoryId,
  revisionDate,
}: RestoreButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRestore = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn khôi phục bài viết về phiên bản lưu ngày ${revisionDate} không?`)) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/articles/${slug}?gameSlug=${gameSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          categoryId,
          editSummary: `Khôi phục về phiên bản lưu ngày ${revisionDate}`,
          published: true,
        }),
      });

      if (res.ok) {
        alert('Khôi phục bài viết thành công!');
        router.push(`/wiki/${gameSlug}/${slug}`);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Khôi phục thất bại.');
      }
    } catch (err) {
      alert('Đã xảy ra lỗi mạng khi khôi phục bài viết.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRestore}
      disabled={loading}
      className="flex items-center gap-1.5 rounded bg-[#c5a059] border border-[#c5a059] px-4 py-2 text-[10px] font-bold font-serif uppercase tracking-widest text-[#0a0a0c] hover:bg-[#b58d47] hover:border-[#b58d47] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 size={13} className="animate-spin" />
          Đang phục hồi...
        </>
      ) : (
        <>
          <RotateCcw size={13} />
          Phục hồi bản này
        </>
      )}
    </button>
  );
}
