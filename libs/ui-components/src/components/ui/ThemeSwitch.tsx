'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { TbMoonFilled, TbSunFilled } from "react-icons/tb";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex gap-2">
      <div className="flex items-center space-x-4">
        {/* DaisyUI Theme Switch */}
        <label className="swap swap-rotate group">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hidden"
          />
          {/* Sun icon for light mode */}
          <div className="swap-on">
            <TbSunFilled className="text-xl text-neutral-500 dark:text-neutral-300 group-hover:rotate-90 duration-300" />
          </div>
          {/* Moon icon for dark mode */}
          <div className="swap-off">
            <TbMoonFilled className="text-xl text-neutral-500 dark:text-neutral-300 group-hover:rotate-90 duration-300" />
          </div>
        </label>
      </div>
    </div>
  );
}
