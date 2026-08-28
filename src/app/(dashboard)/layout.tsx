'use client';

import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 pt-28 px-4 pb-6 lg:pt-8 lg:px-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
