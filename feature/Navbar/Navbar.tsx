'use client';

import { ThemeSwitch } from '@/components/theme-switch';
import { siteConfig } from '@/config/site';
import { Button } from '@heroui/button';
import { link as linkStyles } from '@heroui/theme';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import NextLink from 'next/link';
import { useState } from 'react';

import { useAuth } from '@/shared';
import { Logo } from '@/shared/components/Logo/Logo';
import { ProfileDropdown } from '../ProfileDropdown/ProfileDropdown';

export const Navbar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Анимация для контейнера меню
  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.05,
      },
    },
  };

  // Анимация для элементов списка
  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const allNavItems = [
    ...siteConfig.publicNavItems,
    ...(user ? siteConfig.privateNavItems : []),
  ];

  return (
    <div className="sticky top-0 z-50 w-full px-4 pt-4 max-w-[80rem] mx-auto">
      <nav className="rounded-2xl border border-default-200/50 bg-content1/50 px-4 sm:px-6 py-3 shadow-sm backdrop-blur-lg">
        <div className="flex items-center justify-between">
          {/* Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <NextLink
              className="flex items-center gap-2 font-bold text-lg tracking-tight transition-opacity hover:opacity-80"
              href="/games"
            >
              <Logo height={32} width={32} />
              TEAMLY
            </NextLink>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-6">
              {siteConfig.publicNavItems.map((item) => (
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

              {user &&
                siteConfig.privateNavItems.map((item) => (
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
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitch />

            {/* Mobile menu button */}
            <Button
              isIconOnly
              className="md:hidden"
              size="sm"
              variant="light"
              onPress={toggleMobileMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                ) : (
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                )}
              </svg>
            </Button>

            <ProfileDropdown />
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              animate="visible"
              className="md:hidden overflow-hidden"
              exit="hidden"
              initial="hidden"
              variants={menuVariants}
            >
              <div className="mt-4 pt-4 border-t border-default-200">
                <ul className="flex flex-col gap-1">
                  {allNavItems.map((item) => (
                    <motion.li key={item.href} variants={itemVariants}>
                      <NextLink
                        className={clsx(
                          'block py-2.5 px-3 rounded-lg text-sm font-medium text-default-500 transition-colors hover:text-foreground hover:bg-default-100',
                        )}
                        href={item.href}
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </NextLink>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};
