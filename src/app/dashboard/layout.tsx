'use client';

import React from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#03060d] text-slate-100 font-sans">
      <DashboardNavbar />
      <div className="md:pl-64 pt-16">
        <main className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
