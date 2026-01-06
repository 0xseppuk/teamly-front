'use client';

import { LoginForm } from '@/feature/Login';
import { RegisterForm } from '@/feature/Register';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

type AuthMode = 'login' | 'register';

export function AuthWidget() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative" style={{ perspective: '1000px' }}>
          <AnimatePresence mode="wait" initial={false}>
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <LoginForm onSwitchToRegister={() => setMode('register')} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <RegisterForm onSwitchToLogin={() => setMode('login')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
