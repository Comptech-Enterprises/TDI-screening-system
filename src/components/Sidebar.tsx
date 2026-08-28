'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileSearch, Clock, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/screen', label: 'Screen Resume', icon: FileSearch },
  { href: '/history', label: 'History', icon: Clock },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-surface border-b border-border z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-border shrink-0 p-1">
            <Image
              src="/TDI.webp"
              alt="TDI Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain scale-125"
              priority
            />
          </div>
          <span className="text-sm font-semibold text-foreground truncate">TDI Infratech</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover shrink-0"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed left-0 top-0 h-full bg-surface border-r border-border z-50 transition-all duration-300 flex flex-col w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'
        )}
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="flex items-center justify-between gap-3 px-4 h-20 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={clsx(
                'relative w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-border shrink-0 p-1 shadow-sm',
                collapsed && 'lg:mx-auto'
              )}
            >
              <Image
                src="/TDI.webp"
                alt="TDI Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain scale-125"
                priority
              />
            </div>
            <div className={clsx('min-w-0', collapsed && 'lg:hidden')}>
              <h1 className="text-sm font-semibold text-foreground leading-tight truncate">TDI Infratech</h1>
              <p className="text-[10px] text-text-muted leading-tight">AI Screening</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden p-1.5 rounded-lg text-text-muted hover:bg-surface-hover shrink-0"
          >
            <X size={20} />
          </button>
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
                <span className={clsx(collapsed && 'lg:hidden')}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:bg-surface-hover hover:text-foreground transition-all duration-200 w-full"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
            <span className={clsx(collapsed && 'lg:hidden')}>Collapse</span>
          </button>
        </div>
      </aside>

      <div
        className={clsx(
          'hidden lg:block transition-all duration-300',
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        )}
      />
    </>
  );
}
