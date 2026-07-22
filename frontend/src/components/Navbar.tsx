'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import SearchModal from './SearchModal';
import { usePathname } from 'next/navigation';
import { Search, User, LogOut, Menu, X, LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Templates', href: '/templates' },
    { name: 'Industries', href: '/industries' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Estimator', href: '/estimator' },
    { name: 'Blog', href: '/blog' }
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center p-0 md:p-4 pointer-events-none transition-all duration-500">
        <header className={`w-full pointer-events-auto transition-all duration-500 ${
          scrolled 
            ? 'max-w-4xl md:rounded-full border border-gold/20 bg-navy-light/90 backdrop-blur-md py-2.5 px-6 md:px-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)]' 
            : 'max-w-7xl border-b border-transparent py-5 px-6 md:px-8 bg-transparent'
        }`}>
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link 
              href="/" 
              className="relative flex items-center shrink-0 px-2.5 py-1.5 rounded-xl hover:bg-navy-slate/5 transition-all duration-200"
            >
              <Image 
                src="/logo.png" 
                alt="OakPillar Studios Logo" 
                width={120} 
                height={38} 
                className={`object-contain transition-all duration-300 ${scrolled ? 'h-7 w-auto' : 'h-8.5 w-auto'}`}
                style={{ mixBlendMode: 'multiply' }}
                priority
              />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`px-3.5 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-200 ${
                      isActive 
                        ? 'text-gold bg-gold/10 border border-gold/10' 
                        : 'text-navy-slate hover:text-gold hover:bg-navy-slate/5 border border-transparent'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search Trigger */}
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl bg-navy-slate/5 border border-navy-slate/10 hover:border-gold/30 hover:bg-navy-light transition-all text-navy-slate hover:text-gold cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Account / Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full bg-navy-light/60 border border-gold/20 hover:border-gold/50 transition-all cursor-pointer"
                  >
                    {user.profilePhoto ? (
                      <img 
                        src={user.profilePhoto} 
                        alt={user.name} 
                        className="w-7 h-7 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-bold text-light-gray pr-2 max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gold/15 bg-navy-light shadow-xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-navy-slate/10 text-xs text-navy-slate mb-1">
                        Role: <span className="text-gold font-bold">{user.role}</span>
                        <span className="block text-[10px] text-navy-slate/75 mt-0.5">Score: {user.leadScore}</span>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-light-gray hover:bg-navy-dark hover:text-gold transition-colors text-left"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Client Dashboard
                      </Link>

                      {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-light-gray hover:bg-navy-dark hover:text-gold transition-colors text-left"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                          Admin CRM
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-navy-dark transition-colors text-left mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Secure Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="btn-gold px-5 py-2.5 text-xs uppercase tracking-widest cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>


          {/* Mobile Hamburguer */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Search Trigger (Mobile) */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-1.5 rounded-lg text-navy-slate hover:text-gold"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-navy-slate hover:text-gold"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-navy-light/95 backdrop-blur-lg border-b border-gold/10 p-6 flex flex-col gap-4 shadow-xl z-50">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-light-gray hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="pt-4 border-t border-navy-slate/10 flex flex-col gap-3">
                <span className="text-xs text-navy-slate">Logged in: <strong className="text-gold">{user.name}</strong></span>
                <Link 
                  href="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-light-gray hover:text-gold transition-colors"
                >
                  Client Dashboard
                </Link>
                {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                  <Link 
                    href="/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-gold hover:text-gold-hover transition-colors"
                  >
                    Admin CRM Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="text-left text-xs text-red-400 font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); setLoginOpen(true); }}
                className="w-full btn-gold py-2.5 text-xs text-center cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>
      </div>

      {/* Modals */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
