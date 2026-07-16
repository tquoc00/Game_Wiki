'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useAuth } from '@/context/AuthContext';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List as ListIcon,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Save,
  ArrowLeft,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface WikiFormProps {
  mode: 'create' | 'edit';
  slug?: string;
  initialData?: {
    title: string;
    content: string;
    summary: string;
    featuredImg: string;
    categoryId: string;
    published: boolean;
  };
}

export default function WikiForm({ mode, slug, initialData }: WikiFormProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const routeParams = useParams();
  
  const gameSlug = (routeParams['game-slug'] as string) || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [gameId, setGameId] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields State
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [featuredImg, setFeaturedImg] = useState(initialData?.featuredImg || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [editSummary, setEditSummary] = useState('');

  // Initialize TipTap Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.content || '<p>Ghi chép chi tiết tài liệu...</p>',
    editorProps: {
      attributes: {
        class: 'bg-[#111115] rounded-b border border-[#2c2921] p-4 min-h-[300px] max-h-[600px] overflow-y-auto text-zinc-300 outline-none focus:border-[#c5a059] transition-all',
      },
    },
  });

  // Fetch Game info & Categories
  useEffect(() => {
    async function fetchGameAndCategories() {
      if (!gameSlug) return;
      try {
        // Fetch game details to get gameId
        const gameRes = await fetch(`/api/games/${gameSlug}`);
        if (gameRes.ok) {
          const gameData = await gameRes.json();
          setGameId(gameData.game.id);
        }

        // Fetch categories scoped by game
        const catRes = await fetch(`/api/categories?gameSlug=${gameSlug}`);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }
      } catch (err) {
        console.error('Failed to load game metadata:', err);
      }
    }
    fetchGameAndCategories();
  }, [gameSlug]);

  // Protect page (requires EDITOR or ADMIN)
  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'EDITOR' && user.role !== 'ADMIN'))) {
      router.push(gameSlug ? `/wiki/${gameSlug}` : '/wiki');
    }
  }, [user, authLoading, router, gameSlug]);

  if (authLoading || !user || (user.role !== 'EDITOR' && user.role !== 'ADMIN')) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#c5a059]" size={32} />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Tiêu đề bài viết không được để trống.');
      return;
    }
    if (!categoryId) {
      setFormError('Vui lòng chọn một danh mục.');
      return;
    }
    if (mode === 'create' && !gameId) {
      setFormError('Lỗi hệ thống: Không thể liên kết bài viết với ID trò chơi.');
      return;
    }

    const content = editor?.getHTML() || '';
    if (content === '<p></p>' || content === '') {
      setFormError('Nội dung bài viết không được để trống.');
      return;
    }

    if (mode === 'edit' && !editSummary.trim()) {
      setFormError('Vui lòng nhập tóm tắt chỉnh sửa để ghi vào lịch sử cổ thư.');
      return;
    }

    setLoading(true);

    try {
      const url = mode === 'create' ? '/api/articles' : `/api/articles/${slug}?gameSlug=${gameSlug}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const bodyData = {
        title,
        content,
        summary,
        featuredImg,
        categoryId,
        published,
        gameId,
        ...(mode === 'edit' && { editSummary }),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to single article view
        const targetSlug = mode === 'create' ? data.article.slug : slug;
        router.push(`/wiki/${gameSlug}/${targetSlug}`);
        router.refresh();
      } else {
        setFormError(data.error || 'Đã có lỗi xảy ra.');
      }
    } catch (err) {
      setFormError('Lỗi kết nối mạng, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Editor Toolbar
  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="flex flex-wrap gap-1.5 rounded-t border border-b-0 border-[#2c2921] bg-[#17171c] p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-1.5 transition hover:bg-[#c5a059]/10 hover:text-[#c5a059] ${editor.isActive('bold') ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'text-zinc-500'}`}
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-1.5 transition hover:bg-[#c5a059]/10 hover:text-[#c5a059] ${editor.isActive('italic') ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'text-zinc-500'}`}
        >
          <Italic size={15} />
        </button>

        <span className="w-px bg-[#2c2921] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`rounded p-1.5 transition hover:bg-[#c5a059]/10 hover:text-[#c5a059] ${editor.isActive('heading', { level: 1 }) ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'text-zinc-500'}`}
        >
          <Heading1 size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded p-1.5 transition hover:bg-[#c5a059]/10 hover:text-[#c5a059] ${editor.isActive('heading', { level: 2 }) ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'text-zinc-500'}`}
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`rounded p-1.5 transition hover:bg-[#c5a059]/10 hover:text-[#c5a059] ${editor.isActive('heading', { level: 3 }) ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'text-zinc-500'}`}
        >
          <Heading3 size={15} />
        </button>

        <span className="w-px bg-[#2c2921] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-1.5 transition hover:bg-[#c5a059]/10 hover:text-[#c5a059] ${editor.isActive('bulletList') ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'text-zinc-500'}`}
        >
          <ListIcon size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-1.5 transition hover:bg-[#c5a059]/10 hover:text-[#c5a059] ${editor.isActive('orderedList') ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'text-zinc-500'}`}
        >
          <ListOrdered size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded p-1.5 transition hover:bg-[#c5a059]/10 hover:text-[#c5a059] ${editor.isActive('blockquote') ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'text-zinc-500'}`}
        >
          <Quote size={15} />
        </button>

        <span className="w-px bg-[#2c2921] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="rounded p-1.5 text-zinc-500 transition hover:bg-[#c5a059]/10 hover:text-[#c5a059] disabled:opacity-20 disabled:hover:bg-transparent"
        >
          <Undo size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="rounded p-1.5 text-zinc-500 transition hover:bg-[#c5a059]/10 hover:text-[#c5a059] disabled:opacity-20 disabled:hover:bg-transparent"
        >
          <Redo size={15} />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-4 text-left">
      {/* Header back navigation */}
      <div className="mb-8 flex items-center justify-between border-b border-[#2c2921]/30 pb-4">
        <Link
          href={mode === 'edit' ? `/wiki/${gameSlug}/${slug}` : `/wiki/${gameSlug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a059] hover:text-[#f4edd9] transition font-serif"
        >
          <ArrowLeft size={14} />
          Trở Về
        </Link>
        <h1 className="text-xl md:text-2xl font-bold font-serif text-[#f4edd9] tracking-wider uppercase">
          {mode === 'create' ? 'Tạo Ghi Chép Mới' : 'Hiệu Đột Phá Cổ Thư'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <div className="rounded border border-[#991b1b]/20 bg-[#991b1b]/5 p-4 text-xs font-sans text-[#f4edd9] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#991b1b] shrink-0" />
            {formError}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Article Title */}
          <div className="space-y-2">
            <label className="text-xs font-serif font-bold text-[#c5a059] uppercase tracking-wide">Tiêu đề bài viết *</label>
            <input
              type="text"
              placeholder="Ví dụ: Chỉ số Kiếm Đơn Thần Sa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded bg-[#111115] border border-[#2c2921] px-4 py-2.5 text-sm text-zinc-300 outline-none transition focus:border-[#c5a059]"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-serif font-bold text-[#c5a059] uppercase tracking-wide">Danh mục Wiki *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded bg-[#111115] border border-[#2c2921] px-4 py-2.5 text-sm text-zinc-300 outline-none transition focus:border-[#c5a059]"
              required
            >
              <option value="" className="bg-[#0f172a]">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0a0a0c]">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Short Summary */}
        <div className="space-y-2">
          <label className="text-xs font-serif font-bold text-[#c5a059] uppercase tracking-wide">Tóm lược ngắn (SEO & Thẻ bài) *</label>
          <textarea
            placeholder="Tóm tắt ngắn nội dung bài viết này (tối đa 500 ký tự)..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            maxLength={500}
            className="w-full rounded bg-[#111115] border border-[#2c2921] px-4 py-2.5 text-sm text-zinc-300 outline-none transition focus:border-[#c5a059]"
            required
          />
        </div>

        {/* Featured Image URL */}
        <div className="space-y-2">
          <label className="text-xs font-serif font-bold text-[#c5a059] uppercase tracking-wide flex items-center gap-1.5">
            <ImageIcon size={14} className="text-[#c5a059]" />
            Liên kết ảnh bìa (Featured Image URL)
          </label>
          <input
            type="url"
            placeholder="Link hình ảnh (Unsplash, Cloudinary, v.v.)"
            value={featuredImg}
            onChange={(e) => setFeaturedImg(e.target.value)}
            className="w-full rounded bg-[#111115] border border-[#2c2921] px-4 py-2.5 text-sm text-zinc-300 outline-none transition focus:border-[#c5a059]"
          />
        </div>

        {/* Content Section with TipTap Editor */}
        <div className="space-y-2">
          <label className="text-xs font-serif font-bold text-[#c5a059] uppercase tracking-wide">Chi tiết thư mục *</label>
          <MenuBar />
          <EditorContent editor={editor} />
        </div>

        {/* Edit Summary (Only visible in Edit mode) */}
        {mode === 'edit' && (
          <div className="space-y-2 rounded border border-[#c5a059]/20 bg-[#161511] p-4">
            <label className="text-xs font-serif font-bold text-[#c5a059] uppercase tracking-wider block">
              Mô tả tu chỉnh (Revision Summary) *
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Cập nhật chỉ số tấn công vật lý của Boss tại bản v1.2"
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
              className="w-full rounded bg-[#0a0a0c] border border-[#2c2921] px-4 py-2 text-sm text-zinc-300 outline-none transition focus:border-[#c5a059]"
              required={mode === 'edit'}
            />
          </div>
        )}

        {/* Publish Checkbox & Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#2c2921]/50">
          <label className="flex items-center gap-2 text-xs font-serif text-zinc-400 cursor-pointer uppercase tracking-wider">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-[#2c2921] bg-[#111115] text-[#c5a059] focus:ring-[#c5a059] accent-[#c5a059]"
            />
            Công khai ghi chép lập tức
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded bg-[#c5a059] hover:bg-[#b58d47] border border-[#c5a059] px-6 py-3 text-xs font-serif font-bold uppercase tracking-widest text-[#0a0a0c] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                Đang lưu thư viện...
              </>
            ) : (
              <>
                <Save size={14} />
                {mode === 'create' ? 'Lưu Ghi Chép' : 'Tu Bản Ghi'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
