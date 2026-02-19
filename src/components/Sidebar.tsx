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
      <div className="h-20 flex items-center gap-3 px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <FileSearch className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[18px] text-gray-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">과제판단</span>
            <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-md self-start mt-1">BETA</span>
          </div>
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
                flex items-center gap-3 px-4 py-3.5 mx-3 rounded-xl text-[15px] font-medium transition-all duration-200 group relative overflow-hidden
                ${active
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />}
              <Icon className={`w-5 h-5 transition-colors ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
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
