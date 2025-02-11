'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { TbMoonFilled, TbSunFilled, TbAdjustmentsFilled } from "react-icons/tb";
interface ThemeSwitchProps {
  isExpanded: boolean,

}
export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ isExpanded }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;


  const getIcon = () => {
    if (theme === "dark") return <TbMoonFilled />;
    if (theme === "light") return <TbSunFilled />;
    return <TbAdjustmentsFilled />;
  };
  return (
    <div className="flex gap-2 w-full">
      <div className="dropdown dropdown-right dropdown-top w-full">
        <div
          onClick={() => setIsOpen(!isOpen)}
          tabIndex={0} 
          role="button" 
          className={`rounded-xl hover:bg-mainColor/50 duration-150 flex items-center gap-2 ${!isExpanded ? "justify-center w-9 h-9 p-5 mx-auto" : "w-full py-2 px-3 "}`}
          >
            <span className='text-xl'>
          {getIcon()}
            </span>
          {isExpanded && (
            <p>
              Theme
            </p>
          )}
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-baseLight dark:bg-baseDark rounded-box z-[999] w-56 p-2 shadow">
          <li>

            <button
              onClick={() => setTheme('system')}
              className={`${theme === 'system' && 'bg-mainColor'} z-20 duration-300 active:scale-90`}>
              <TbAdjustmentsFilled /> System
            </button>
          </li>
          <li>

            <button
              onClick={() => setTheme('light')}
              className={`${theme === 'light' && 'bg-mainColor'} z-20 duration-300 active:scale-90`}>
              <TbSunFilled /> Light Mode
            </button>
          </li>
          <li>

            <button
              onClick={() => setTheme('dark')}
              className={`${theme === 'dark' && 'bg-mainColor'} z-20 duration-300 active:scale-90`}>
              <TbMoonFilled /> Dark Mode
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
