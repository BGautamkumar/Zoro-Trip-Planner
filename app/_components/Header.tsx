"use client"
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { UserButton, useUser, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { List, Settings, LogOut, Plane, ArrowRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const menuOptions = [
  {
    name: "Home",
    path: '/'
  },
  {
    name: 'Pricing',
    path: '/pricing'
  },
  {
    name: 'About us',
    path: '/about-us'
  }
];

function Header() {
  const { user } = useUser();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect scroll position for header style transition
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = path === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isLanding
          ? 'bg-white/85 dark:bg-gray-950/85 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/logo-v2.png"
                alt="Zoro Trip Planner"
                width={52}
                height={52}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="font-bold text-2xl md:text-3xl tracking-tight text-transparent bg-clip-text bg-linear-to-r from-deep to-ocean">
              Zoro
            </span>
          </Link>

          {/* ── Navigation ── */}
          <nav className="hidden md:flex items-center gap-2">
            {menuOptions.map((menu) => (
              <Link key={menu.path} href={menu.path}>
                <span
                  className={`nav-link px-4 py-2 text-base md:text-lg font-semibold rounded-lg transition-colors duration-200 ${
                    path === menu.path
                      ? 'text-deep dark:text-ocean'
                      : 'text-gray-600 dark:text-gray-400 hover:text-deep dark:hover:text-ocean'
                  }`}
                >
                  {menu.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* ── Actions & Mobile Toggle ── */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-deep"
                >
                  Sign in
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button className="bg-linear-to-r from-deep to-ocean hover:from-deep-light hover:to-ocean-light text-white rounded-full px-6 py-5 text-base font-semibold shadow-lg shadow-ocean/20 hover:shadow-xl hover:shadow-ocean/30 transition-all duration-300 hover:-translate-y-0.5">
                  Get Started
                  <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Button
                className="bg-linear-to-r from-deep to-ocean hover:from-deep-light hover:to-ocean-light text-white rounded-full px-6 py-5 text-base font-semibold shadow-lg shadow-ocean/20 hover:shadow-xl hover:shadow-ocean/30 transition-all duration-300 hover:-translate-y-0.5"
                asChild
              >
                <Link href={'/create-new-trip?mode=create'}>
                  Create New Trip
                  <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>

              {/* Enhanced UserButton with My Trips in dropdown */}
              <UserButton
                appearance={{
                  elements: {
                    userButtonBox: "flex items-center",
                    avatarBox: "w-8 h-8",
                  },
                }}
              >
                <UserButton.MenuItems>
                  {/* My Trips - Use UserButton.Link for navigation */}
                  <UserButton.Link
                    label="My Trips"
                    labelIcon={<Plane className="w-4 h-4" />}
                    href="/my-trips"
                  />

                  {/* Manage Account - Use Clerk built-in action without custom children */}
                  <UserButton.Action label="manageAccount" />

                  {/* Sign Out - Use Clerk built-in action without custom children */}
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-deep dark:text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu Overlay & Drawer ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-3xl flex flex-col pt-24 px-6 animate-reveal-up">
          <nav className="flex flex-col gap-6 text-center">
            {menuOptions.map((menu) => (
              <Link key={menu.path} href={menu.path} onClick={() => setIsMobileMenuOpen(false)}>
                <span
                  className={`block text-2xl font-bold transition-colors duration-200 ${
                    path === menu.path
                      ? 'text-ocean'
                      : 'text-deep dark:text-white hover:text-ocean'
                  }`}
                >
                  {menu.name}
                </span>
              </Link>
            ))}
            <SignedIn>
              <Link href="/my-trips" onClick={() => setIsMobileMenuOpen(false)}>
                <span className={`block text-2xl font-bold transition-colors duration-200 ${
                  path === '/my-trips' ? 'text-ocean' : 'text-deep dark:text-white hover:text-ocean'
                }`}>
                  My Trips
                </span>
              </Link>
            </SignedIn>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header