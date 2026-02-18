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
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-toss-sm group-hover:scale-105 transition-transform duration-200">
            <FileSearch className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-[16px] text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors">과제판단</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 group
                ${active
                  ? 'bg-primary-50 text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`w-5 h-5 transition-colors ${active ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile (New Feature) */}
      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left group">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 group-hover:border-gray-300 transition-colors">
            <span className="text-sm font-semibold text-gray-600">김</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-gray-900 truncate">김세용님</p>
            <p className="text-[12px] text-gray-500 truncate">sey.kim@adoc.im</p>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4"
        style={{ height: 'var(--mobile-header-height)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center shadow-sm">
            <FileSearch className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[15px] text-gray-900">과제판단</span>
        </div>
        <button
          onClick={toggle}
          className="p-2 -mr-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors active:scale-95 duration-200"
          aria-label="메뉴"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 bottom-0 z-50 bg-white flex flex-col shadow-toss-xl
          transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ width: 'var(--sidebar-width)' }}
      >
        {nav}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed top-0 left-0 bottom-0 bg-white border-r border-gray-100 flex-col z-30 shadow-[1px_0_0_0_rgba(0,0,0,0.02)]"
        style={{ width: 'var(--sidebar-width)' }}
      >
        {nav}
      </aside>
    </>
  );
}
