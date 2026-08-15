"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartDrawer } from "../cart/cart-drawer";
import { useAuthStore } from "../../store/auth.store";
import { AuthModal } from "../auth/auth-modal";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout: storeLogout } = useAuthStore();
  const pathname = usePathname();

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/v1/customers/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // Ignore
    }
    storeLogout();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tighter sm:text-2xl">
            KREVVY
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-foreground/80 ${
                pathname === link.href ? "text-foreground" : "text-foreground/60"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {mounted && (
            isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/account" className="text-sm font-medium hover:text-foreground/80">
                  {user?.name || user?.email || 'Account'}
                </Link>
                <button onClick={logout} className="text-sm font-medium text-red-600 hover:text-red-700">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:block text-sm font-medium hover:text-foreground/80"
              >
                Login
              </button>
            )
          )}

          {/* Cart Drawer */}
          <CartDrawer />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background px-4 py-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  pathname === link.href ? "text-foreground" : "text-foreground/60"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {mounted && (
              isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    className="text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    className="text-left text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="text-left text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
              )
            )}
          </nav>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}
