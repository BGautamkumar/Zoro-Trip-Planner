import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Globe2, Twitter, Github, Instagram } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Create Trip', href: '/create-new-trip' },
    { name: 'My Trips', href: '/my-trips' },
    { name: 'Pricing', href: '/pricing' },
  ],
  company: [
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact', href: '/about-us' },
    { name: 'Careers', href: '/about-us' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

const socials = [
  { icon: <Twitter className="h-4 w-4" />, href: '#', label: 'Twitter' },
  { icon: <Github className="h-4 w-4" />, href: '#', label: 'GitHub' },
  { icon: <Instagram className="h-4 w-4" />, href: '#', label: 'Instagram' },
]

function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-deep-dark to-deep" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-ocean/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo-v2.png" alt="Zoro" width={36} height={36} />
              <span className="font-bold text-xl text-white">Zoro</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your AI-powered compass to the world. Crafting personalized travel experiences in seconds.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-ocean hover:border-ocean/30 hover:bg-ocean/10 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-ocean transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-ocean transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-ocean transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Zoro Trip Planner. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Globe2 className="h-3.5 w-3.5" />
            <span>Crafted for explorers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
