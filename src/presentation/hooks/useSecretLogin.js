// src/presentation/hooks/useSecretLogin.js
import { useState, useEffect, useCallback } from 'react';

const SECRET_CLICKS = 5;      // Clicks en logo
const SECRET_TIMEOUT = 3000;  // Reset en 3 seg
const SECRET_COMBO = ['Control', 'Shift', 'L']; // Ctrl+Shift+L

export const useSecretLogin = (onActivate) => {
  const [clickCount, setClickCount] = useState(0);
  const [keys, setKeys] = useState(new Set());

  // ✅ MÉTODO 1: 5 clicks en logo
  const handleLogoClick = useCallback(() => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= SECRET_CLICKS) {
        onActivate();
        return 0;
      }
      return next;
    });
  }, [onActivate]);

  // Reset clicks después de timeout
  useEffect(() => {
    if (clickCount === 0) return;
    const timer = setTimeout(() => setClickCount(0), SECRET_TIMEOUT);
    return () => clearTimeout(timer);
  }, [clickCount]);

  // ✅ MÉTODO 2: Ctrl+Shift+L
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => {
        const next = new Set(prev);
        next.add(e.key);

        const allPressed = SECRET_COMBO.every(k => next.has(k));
        if (allPressed) {
          onActivate();
          return new Set();
        }
        return next;
      });
    };

    const handleKeyUp = (e) => {
      setKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onActivate]);

  return { handleLogoClick, clickCount };
};