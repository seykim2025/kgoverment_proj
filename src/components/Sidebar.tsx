'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileSearch,
  Building2,
  FolderClock,
  Menu,
  X,
  Home,
} from 'lucide-react';

const navItems = [
  { href: '/', label: '홈', icon: Home },
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/assess', label: '과제 판단', icon: FileSearch },
  { href: '/company', label: '회사 정보', icon: Building2 },
  { href: '/history', label: '과제 이력', icon: FolderClock },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open]);

  const toggle = useCallback(() => setOpen(p => !p), []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/dashboard';
    if (href === '/dashboard' && pathname === '/') return true;
    return pathname.startsWith(href);
  };

  const nav = (
    <>
      {/* Logo */}
      <Link href="/" className="h-16 flex items-center gap-2.5 px-5 border-b border-[var(--gray-200)] hover:bg-[var(--gray-50)] transition-colors group">
        <div className="w-8 h-8 rounded-lg bg-[var(--blue-500)] flex items-center justify-center group-hover:scale-105 transition-transform">
          <FileSearch className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="font-bold text-[15px] text-[var(--gray-900)]">과제판단</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors
                ${active
                  ? 'bg-[var(--blue-50)] text-[var(--blue-600)]'
                  : 'text-[var(--gray-600)] hover:bg-[var(--gray-100)] hover:text-[var(--gray-900)]'
                }
              `}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[var(--gray-200)]">
        <p className="text-[12px] text-[var(--gray-500)]">정부과제 판단 서비스 v1.0</p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[var(--gray-200)] flex items-center px-4 gap-3"
        style={{ height: 'var(--mobile-header-height)' }}>
        <button
          onClick={toggle}
          className="p-2 -ml-2 rounded-lg text-[var(--gray-700)] hover:bg-[var(--gray-100)] transition-colors"
          aria-label="메뉴"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--blue-500)] flex items-center justify-center">
            <FileSearch className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-[14px] text-[var(--gray-900)]">과제판단</span>
        </div>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          style={{ animation: 'fadeOverlay 0.2s ease-out' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 bottom-0 z-50 bg-white flex flex-col
          transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ width: 'var(--sidebar-width)' }}
      >
        {nav}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed top-0 left-0 bottom-0 bg-white border-r border-[var(--gray-200)] flex-col z-30"
        style={{ width: 'var(--sidebar-width)' }}
      >
        {nav}
      </aside>
    </>
  );
}
