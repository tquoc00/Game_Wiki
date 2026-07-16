'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Loader2, ArrowLeft, Gamepad2 } from 'lucide-react';

export default function LoginPage() {
  const { user, login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/wiki');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ địa chỉ email và mật khẩu.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/wiki');
    } else {
      setError(result.error || 'Xác thực thất bại, xin vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#09090b] text-zinc-100 relative font-sans">
      {/* Absolute Back Button */}
      <Link
        href="/wiki"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-cyan-400 transition duration-200"
      >
        <ArrowLeft size={15} />
        Thư viện Wiki
      </Link>

      <div className="w-full max-w-md space-y-8 text-left">
        {/* Branding header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
              <Gamepad2 size={20} />
            </div>
            <span className="text-3xl font-extrabold tracking-wider text-white uppercase font-sans">
              WI<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">GAKI</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Đăng Nhập Tài Khoản</p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Địa chỉ Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
                  required
                />
                <Mail size={15} className="absolute left-3.5 top-3.5 text-zinc-500" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Mật khẩu</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
                  required
                />
                <Lock size={15} className="absolute left-3.5 top-3.5 text-zinc-500" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 py-3 text-xs font-bold uppercase tracking-wider text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Đang tiến vào...
                </>
              ) : (
                'Đăng Nhập Wigaki'
              )}
            </button>
          </form>

          {/* Prompt */}
          <div className="text-center text-xs text-zinc-400">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-bold text-cyan-400 hover:underline transition duration-200">
              Đăng ký ngay
            </Link>
          </div>
        </div>

        {/* Demo credentials tip */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-[11px] text-zinc-400 text-center leading-relaxed">
          💡 Tài khoản thử nghiệm sẵn có:<br />
          Email: <span className="font-mono text-cyan-400 font-semibold">admin@gamewiki.vn</span> | Mật khẩu: <span className="font-mono text-cyan-400 font-semibold">admin123</span> (Quyền Admin)
        </div>
      </div>
    </div>
  );
}
