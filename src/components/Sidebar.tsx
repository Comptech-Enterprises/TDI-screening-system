'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileSearch, Trophy, Clock, Shield, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/screen', label: 'Screen Resume', icon: FileSearch },
  { href: '/top5', label: 'Top 5', icon: Trophy },
  { href: '/history', label: 'History', icon: Clock },
  { href: '/admin', label: 'Admin', icon: Shield, adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className={clsx(
          'fixed left-0 top-0 h-full bg-surface border-r border-border z-40 transition-all duration-300 flex flex-col',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-border shrink-0 p-1 shadow-sm">
                <Image
                  src="/TDI.webp"
                  alt="TDI Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain scale-110"
                  priority
                />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground leading-tight">TDI Infratech</h1>
                <p className="text-[10px] text-text-muted leading-tight">AI Screening</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center mx-auto shrink-0 bg-white border border-border p-1 shadow-sm">
              <Image
                src="/TDI.webp"
                alt="TDI Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain scale-110"
                priority
              />
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-foreground'
                )}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:bg-surface-hover hover:text-foreground transition-all duration-200 w-full"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:bg-danger-bg hover:text-danger transition-all duration-200 mt-1"
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span>Log out</span>}
          </Link>
        </div>
      </aside>
      <div className={clsx('transition-all duration-300', collapsed ? 'ml-[72px]' : 'ml-[260px]')} />
    </>
  );
}
