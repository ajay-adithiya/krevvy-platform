import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Sun, Moon } from 'lucide-react';
import { ActiveView } from '../types';
import Logo from './Logo';
import { useGlobalContent } from '../contexts/GlobalContentContext';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onBuyClick: () => void;
}

export default function Header({
  activeView,
  setActiveView,
  darkMode,
  toggleDarkMode,
  onBuyClick
}: HeaderProps) {
  const { content, navigation } = useGlobalContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor page scroll to apply background blur styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: string) => {
    setActiveView(view as ActiveView);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ctaLabel = content?.globalAmazonButtonLabel;
  const logoUrl = content?.logoMedia?.url;

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 w-full z-[90] transition-all duration-300 ${scrolled
        ? 'bg-pure-white/95 dark:bg-pure-black/95 backdrop-blur-md py-4 shadow-sm border-b border-hairline dark:border-neutral-800'
        : 'bg-pure-white/80 dark:bg-pure-black/80 backdrop-blur-sm py-6 border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-copper/40 rounded-lg p-1"
          aria-label="Krevvy Home"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-16 w-auto" />
          ) : (
            <Logo className="h-16 w-auto" darkMode={darkMode} />
          )}
        </button>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => {
            const isActive = activeView === item.targetView;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.targetView)}
                  className={`relative py-2 text-sm font-semibold tracking-wider uppercase transition-colors duration-200 focus:outline-none focus:text-copper cursor-pointer ${isActive
                    ? 'text-copper dark:text-primary-fixed-dim font-bold'
                    : 'text-secondary hover:text-pure-black dark:text-neutral-400 dark:hover:text-pure-white'
                    }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-copper dark:bg-primary-fixed-dim rounded-full transition-all duration-300" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Trailing Actions (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full bg-surface-container-low dark:bg-neutral-800 text-secondary dark:text-neutral-400 hover:text-pure-black dark:hover:text-pure-white hover:bg-surface-container dark:hover:bg-neutral-700 transition-all cursor-pointer"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-4.5 h-4.5 animate-pulse-slow" />
            ) : (
              <Moon className="w-4.5 h-4.5" />
            )}
          </button>

          {ctaLabel && (
            <button
              onClick={onBuyClick}
              className="btn-secondary px-6 py-2.5 font-semibold text-sm inline-flex items-center gap-2 rounded-full cursor-pointer shadow-sm"
            >
              <span>{ctaLabel}</span>
              <ShoppingCart className="w-4 h-4 text-copper" />
            </button>
          )}
        </div>

        {/* Mobile Menu & Theme Toggles */}
        <div className="flex md:hidden items-center space-x-4">
          {/* Theme Toggle for Mobile */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-container-low dark:bg-neutral-800 text-secondary dark:text-neutral-300"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-pure-black dark:text-pure-white focus:outline-none focus:ring-2 focus:ring-copper/40 rounded-lg"
            aria-expanded={mobileMenuOpen}
            aria-label="Main menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-x-0 top-20 bg-pure-white dark:bg-pure-black border-b border-hairline dark:border-neutral-800 z-[80] transition-all duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <div className="px-6 py-8 flex flex-col space-y-5">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.targetView)}
              className={`w-full py-2.5 text-left text-base font-semibold tracking-wider uppercase border-b border-surface-container-low dark:border-neutral-800/50 pb-2 ${activeView === item.targetView
                ? 'text-copper dark:text-primary-fixed-dim pl-2 border-l-2 border-l-copper'
                : 'text-secondary dark:text-neutral-400'
                }`}
            >
              {item.label}
            </button>
          ))}
          {ctaLabel && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBuyClick();
              }}
              className="w-full btn-primary py-3 px-6 rounded-full font-semibold text-center flex items-center justify-center gap-2 text-sm mt-4 shadow-sm cursor-pointer"
            >
              <span>{ctaLabel}</span>
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
