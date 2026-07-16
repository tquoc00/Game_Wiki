'use client';

import React, { useState, Suspense } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface WikiLayoutShellProps {
  children: React.ReactNode;
}

export default function WikiLayoutShell({ children }: WikiLayoutShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#09090b] text-zinc-100 font-sans">
      {/* Global Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Responsive Sidebar wrapped in Suspense */}
        <Suspense fallback={<div className="hidden w-64 border-r border-zinc-800/80 bg-zinc-950/40 md:block sticky top-[65px] h-[calc(100vh-65px)]" />}>
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        </Suspense>

        {/* Content Area */}
        <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
