'use client';
import { useTheme } from 'next-themes';
import { TbMoonFilled, TbSunFilled } from "react-icons/tb";

interface ThemeSwitchProps {
  isExpanded: boolean;
}

export const ThemeSwitch = ({ isExpanded }: ThemeSwitchProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      data-tip={'Theme'}
      className="flex flex-col gap-2 w-full tooltip tooltip-right">
        
      <div className={`${isExpanded && "hidden"} flex items-center gap-1 p-1 bg-neutral-100/40 dark:bg-neutral-500/20 rounded-xl relative overflow-hidden`}>
        <button
          className={`${!isExpanded && theme === "light" ? "-translate-x-[200%]" : "translate-x-[9.5px]"} ease-in-out duration-300 w-full z-20 flex items-center justify-center py-1 rounded-lg ${theme === 'light' ? 'bg-mainColor/0' : ''}`}
          onClick={() => setTheme('light')}
        >
          <TbSunFilled className="text-md" />
        </button>
        <button
          className={`${!isExpanded && theme === "dark" ? "translate-x-[200%]" : "-translate-x-[9.5px]"} ease-in-out duration-300 w-full z-20 flex items-center justify-center py-1 rounded-lg ${theme === 'dark' ? 'bg-mainColor/0' : ''}`}
          onClick={() => setTheme('dark')}
        >
          <TbMoonFilled className="text-md" />
        </button>
        <div
        />
      </div>

      <div className={`${!isExpanded && "hidden"} flex items-center gap-1 p-1 bg-neutral-100/40 dark:bg-neutral-500/20 rounded-xl relative overflow-hidden`}>
        <button
          className={`duration-300 w-full z-20 flex items-center justify-center py-1 rounded-lg ${theme === 'light' ? 'bg-mainColor/0' : ''}`}
          onClick={() => setTheme('light')}
        >
          <TbSunFilled className="text-md" />
        </button>
        <button
          className={`duration-300 w-full z-20 flex items-center justify-center py-1 rounded-lg ${theme === 'dark' ? 'bg-mainColor/0' : ''}`}
          onClick={() => setTheme('dark')}
        >
          <TbMoonFilled className="text-md" />
        </button>
        <div
          className={`absolute z-10 h-6 w-[92px] bg-mainColor/50 rounded-lg transition-transform duration-300 ${theme === 'dark' ? 'translate-x-full' : ''}`}
        />
      </div>

    </div>
  );
}