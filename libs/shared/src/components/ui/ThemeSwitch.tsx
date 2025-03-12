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

      {/* Minimize mode */}
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className={`${isExpanded && "hidden"} flex flex-col items-center h-[35px] p-1 rounded-xl bg-neutral-100/40 dark:bg-neutral-500/20 relative overflow-hidden`}>
        <div
          className={`${theme === "light" ? "-translate-y-[200%]" : "translate-y-[1.5px]"} ease-in-out duration-700 w-fit h-fit z-20 flex items-center justify-center py-1 rounded-lg ${theme === 'light' ? 'bg-mainColor/0' : ''}`}
        >
        <TbMoonFilled className="text-md" />
        </div>
        <div
          className={`${theme === "dark" ? "translate-y-[200%]" : "-translate-y-[23px]"} ease-in-out duration-700 w-fit h-fit z-20 flex items-center justify-center py-1 rounded-lg ${theme === 'dark' ? 'bg-mainColor/0' : ''}`}
        >
          <TbSunFilled className="text-md" />
        </div>
      </button>

      {/* Expand Mode */}
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