import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, ShieldCheck, Database, Users, Sparkles, Gamepad2, Cpu, Compass } from 'lucide-react';

export const revalidate = 0; // Fresh updates on visit

export default async function HomePage() {
  // Fetch recent articles & count from backend API
  let recentArticles = [];
  let articleCount = 0;
  let gameCount = 0;

  try {
    const articlesRes = await fetch('http://localhost:5000/api/articles?limit=3', {
      cache: 'no-store'
    });
    if (articlesRes.ok) {
      const articlesData = await articlesRes.json();
      recentArticles = articlesData.articles || [];
      articleCount = articlesData.pagination?.total || 0;
    }
  } catch (error) {
    console.error('Error fetching articles for home:', error);
  }

  try {
    const gamesRes = await fetch('http://localhost:5000/api/games', {
      cache: 'no-store'
    });
    if (gamesRes.ok) {
      const gamesData = await gamesRes.json();
      gameCount = (gamesData.games || []).length;
    }
  } catch (error) {
    console.error('Error fetching games for home:', error);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
              <Gamepad2 size={18} />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-white uppercase md:text-2xl font-sans">
              WI<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">GAKI</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/wiki"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white hover:from-cyan-400 hover:to-indigo-500 transition-all duration-200 shadow-md shadow-cyan-500/20"
            >
              <Compass size={15} />
              TRA CỨU THƯ VIỆN WIKI
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Hero Landing Section */}
      <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden border-b border-zinc-800/50">
        {/* Ambient Neon Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-400">
            <Sparkles size={14} className="animate-pulse" /> NỀN TẢNG TRA CỨU GAME MIỄN PHÍ & KHÔNG CẦN ĐĂNG NHẬP
          </span>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white uppercase">
            Tra Cứu Dữ Liệu & Hướng Dẫn<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              Wigaki Multi-Game Hub
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-zinc-400 leading-relaxed font-sans">
            Truy cập tức thì thông số vật phẩm, tướng, trang bị, bản đồ và hướng dẫn chơi của Elden Ring, Genshin Impact, Liên Minh Huyền Thoại và nhiều trò chơi hấp dẫn khác.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/wiki"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition duration-300 shadow-lg shadow-cyan-500/25"
            >
              Tra Cứu Ngay
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Subtle Decorative Line */}
        <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mt-16" />
      </section>

      {/* 3. Core Features Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">TÍNH NĂNG TRA CỨU HÀNG ĐẦU</h2>
          <p className="text-xs text-zinc-400 mt-1">Nhanh chóng, trực quan và luôn cập nhật</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col space-y-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Gamepad2 className="text-cyan-400" size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white tracking-wide uppercase">ĐA THỂ LOẠI TRÒ CHƠI</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tích hợp linh hoạt dữ liệu các tựa game MOBA, FPS, Open-World RPG, Tactical Strategy, Fighting và Sports.
              </p>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col space-y-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <ShieldCheck className="text-indigo-400" size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white tracking-wide uppercase">DỮ LIỆU ĐÃ XÁC THỰC</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tất cả thông số vật phẩm và bộ kỹ năng được biên soạn chuẩn xác từ dữ liệu chính thức của nhà phát hành.
              </p>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col space-y-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Cpu className="text-purple-400" size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white tracking-wide uppercase">TRA CỨU TỐC ĐỘ CAO</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tải trang mượt mà trên cả thiết bị di động và máy tính mà không cần phải thực hiện các bước đăng nhập phức tạp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Recent Article Updates Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 border-t border-zinc-800/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase text-left">BÀI VIẾT MỚI CẬP NHẬT</h2>
            <p className="text-xs text-zinc-400 mt-1">Những bài hướng dẫn và thông số vừa được đăng tải</p>
          </div>
          <Link href="/wiki" className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition duration-200">
            Xem tất cả bài viết 
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-zinc-500 text-sm">
            Hiện chưa có bài viết nào trong hệ thống.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {recentArticles.map((article: any) => (
              <Link
                key={article.id}
                href={`/wiki/${article.game.slug}/${article.slug}`}
                className="glass-card glass-card-hover rounded-2xl flex flex-col overflow-hidden"
              >
                {/* Feature image */}
                {article.featuredImg ? (
                  <div className="h-44 w-full overflow-hidden bg-zinc-950 border-b border-zinc-800/80">
                    <img
                      src={article.featuredImg}
                      alt={article.title}
                      className="h-full w-full object-cover opacity-85 hover:scale-105 transition-all duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="h-44 w-full bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-center text-zinc-700">
                    <BookOpen size={40} className="stroke-1 opacity-40 text-zinc-500" />
                  </div>
                )}
                
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                      {article.game.name} &bull; {article.category.name}
                    </span>
                    <h3 className="text-base font-bold text-zinc-100 line-clamp-1 leading-snug hover:text-cyan-400 transition-colors uppercase">
                      {article.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                      {article.summary || 'Không có mô tả ngắn.'}
                    </p>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Biên soạn: {article.author.username}</span>
                    <span>{new Date(article.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 5. App Stats Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 border-t border-zinc-800/50 mb-12">
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Gamepad2 className="text-cyan-400" size={22} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white">{gameCount}</h4>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Tựa Game Tra Cứu</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Database className="text-indigo-400" size={22} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white">{articleCount}</h4>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Bài Viết & Dữ Liệu</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Users className="text-purple-400" size={22} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white">100%</h4>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Miễn Phí & Tự Do</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto border-t border-zinc-800/60 py-10 px-6 text-center text-xs text-zinc-500 bg-zinc-950">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="font-bold text-zinc-400 tracking-wider">WIGAKI - TRANG TRA CỨU THÔNG TIN TRÒ CHƠI HOÀN TOÀN MIỄN PHÍ</p>
          <p className="max-w-md mx-auto leading-relaxed">Hệ thống tra cứu thông tin game mượt mà, trực quan trên điện thoại và máy tính.</p>
          <p className="pt-2 text-zinc-600">&copy; 2026 Wigaki. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
