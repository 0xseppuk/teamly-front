'use client';

import { link as linkStyles } from '@heroui/theme';
import clsx from 'clsx';
import NextLink from 'next/link';

import { ThemeSwitch } from '@/components/theme-switch';
import { siteConfig } from '@/config/site';

import { ProfileDropdown } from '../ProfileDropdown/ProfileDropdown';

export const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 w-full pt-4 max-w-[80rem] mx-auto">
      <nav className="rounded-2xl border border-default-200 bg-content1/80 px-6 py-3 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <NextLink
              className="flex items-center gap-2 font-bold text-lg tracking-tight transition-opacity hover:opacity-80"
              href="/games"
            >
              TEAMLY
            </NextLink>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-6">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <NextLink
                    className={clsx(
                      linkStyles({ color: 'foreground' }),
                      'text-sm font-medium text-default-500 transition-colors hover:text-foreground',
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
      </nav>
    </div>
  );
};
