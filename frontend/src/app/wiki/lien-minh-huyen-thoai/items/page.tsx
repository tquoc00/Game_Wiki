import React from 'react';
import Link from 'next/link';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import { ArrowLeft, Search, Shield, Swords, Coins, Sparkles } from 'lucide-react';

export const revalidate = 3600;

interface Item {
  id: string;
  name: string;
  description: string;
  plaintext: string;
  gold: {
    base: number;
    purchasable: boolean;
    total: number;
    sell: number;
  };
  tags: string[];
  image: string;
}

// Helper to strip HTML tags from DDragon item descriptions
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; tag?: string }>;
}) {
  const { search = '', tag = '' } = await searchParams;

  let items: Item[] = [];
  let version = '';
  let errorMsg = '';

  try {
    const res = await fetch('http://localhost:5000/api/ddragon/items', {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      // Filter out non-purchasable or map-specific placeholders if needed
      items = (data.items || []).filter((item: Item) => item.gold?.purchasable && item.name);
      version = data.version || '';
    } else {
      errorMsg = 'Không thể tải danh sách trang bị từ Data Dragon.';
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    errorMsg = 'Lỗi kết nối đến máy chủ dữ liệu.';
  }

  // Filter items by search query
  let filtered = items;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.plaintext.toLowerCase().includes(q)
    );
  }

  // Filter by tag
  if (tag) {
    filtered = filtered.filter((item) => item.tags?.includes(tag));
  }

  // Get unique tags for filter
  const allTags = [...new Set(items.flatMap((i) => i.tags || []))].sort();

  return (
    <WikiLayoutShell>
      {/* Header */}
      <div className="mb-8 border-b border-zinc-800/80 pb-6 font-sans">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href="/wiki/lien-minh-huyen-thoai"
            className="text-xs tracking-wider font-bold text-zinc-400 uppercase hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={12} />
            LIÊN MINH HUYỀN THOẠI
          </Link>
          <span className="text-zinc-600">&bull;</span>
          <span className="text-xs tracking-wider font-bold text-cyan-400 uppercase">
            RIOT DATA DRAGON
          </span>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight uppercase mt-3">
          🛡️ Bách Khoa Trang Bị Đấu Trường
        </h1>
        <p className="mt-2 text-xs text-zinc-400 max-w-3xl font-sans leading-relaxed">
          Tra cứu thông số, chi phí vàng và hiệu ứng của <strong className="text-cyan-400">{items.length}</strong> trang bị LMHT được cập nhật tự động từ server Riot Games (Patch {version}).
        </p>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 mt-5">
          <Link
            href="/wiki/lien-minh-huyen-thoai/items"
            className={`rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              !tag
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            Tất cả
          </Link>
          {allTags.slice(0, 12).map((t) => (
            <Link
              key={t}
              href={`/wiki/lien-minh-huyen-thoai/items?tag=${t}${search ? `&search=${search}` : ''}`}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                tag === t
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      </div>

      {/* Search Field */}
      <div className="max-w-md mb-8 font-sans">
        <form action="/wiki/lien-minh-huyen-thoai/items" method="GET" className="relative">
          {tag && <input type="hidden" name="tag" value={tag} />}
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Tìm trang bị theo tên hoặc công dụng..."
            className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800/80 focus:border-cyan-500/60 py-3 pl-4 pr-12 text-zinc-200 placeholder-zinc-500 outline-none transition duration-300 text-xs tracking-wide"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 rounded-lg bg-cyan-500 p-1.5 text-zinc-950 hover:bg-cyan-400 transition duration-200 cursor-pointer"
          >
            <Search size={15} />
          </button>
        </form>
      </div>

      {/* Error / Items Grid */}
      {errorMsg ? (
        <div className="glass-card rounded-2xl p-12 text-center text-rose-400 border-rose-950 font-sans">
          {errorMsg}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center border-zinc-800 font-sans">
          <p className="text-sm text-zinc-400">Không tìm thấy trang bị phù hợp.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 font-sans">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-card glass-card-hover rounded-2xl p-4 border border-zinc-800/80 flex gap-4 items-start"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-xl border border-cyan-500/30 object-cover shrink-0"
                loading="lazy"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-400 shrink-0 ml-2">
                    <Coins size={12} />
                    {item.gold?.total || 0} G
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed line-clamp-2">
                  {stripHtml(item.plaintext || item.description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </WikiLayoutShell>
  );
}
