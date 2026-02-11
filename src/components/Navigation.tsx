'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Building2, FolderClock, FileSearch, LayoutDashboard } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: '/', label: '홈', icon: Home },
  { href: '/company', label: '회사정보', icon: Building2 },
  { href: '/history', label: '과제이력', icon: FolderClock },
  { href: '/assess', label: '과제판단', icon: FileSearch },
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Only the home page has a dark hero — use transparent nav there
  const isHomePage = pathname === '/';

  // Handle scroll for nav background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHomePage
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50'
          : 'bg-transparent'
          }`}
        role="navigation"
        aria-label="메인 네비게이션"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <FileSearch className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${(isScrolled || !isHomePage) ? 'text-slate-800' : 'text-slate-900 lg:text-white'
                }`}>
                정부과제 판단
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 group overflow-hidden
                      ${active
                        ? 'text-blue-600 bg-blue-50'
                        : (isScrolled || !isHomePage)
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          : 'text-slate-100 hover:text-white hover:bg-white/10 font-medium'
                      }
                    `}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-blue-500' : 'opacity-70 group-hover:opacity-100'
                      }`} />
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                    )}
                  </Link>
                );
              })}

              <div className="w-px h-4 bg-slate-200 mx-2" />

              <Link
                href="/login"
                className={`
                  ml-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5
                  ${(isScrolled || !isHomePage)
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-white text-slate-900 hover:bg-slate-50'
                  }
                `}
              >
                로그인
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={toggleMenu}
              className={`md:hidden p-2 rounded-lg transition-colors ${(isScrolled || !isHomePage)
                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'text-white hover:bg-white/10'
                }`}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        className={`
          fixed top-0 right-0 bottom-0 w-72 bg-white z-55 md:hidden
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-hidden={!isOpen}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <span className="text-lg font-semibold text-slate-800">메뉴</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="메뉴 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <nav className="p-4 space-y-1" role="menu">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium
                  transition-all duration-200 animate-fade-in-up
                  ${active
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-blue-500' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            &copy; 2024 정부과제 판단 서비스
          </p>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
