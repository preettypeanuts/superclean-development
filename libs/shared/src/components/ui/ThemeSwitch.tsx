'use client';
import { useTheme } from 'next-themes';
import { TbMoonFilled, TbSunFilled } from "react-icons/tb";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      data-tip={'Theme'}
      className="flex gap-2 w-full tooltip tooltip-left">
      <label className="swap swap-rotate group">
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="hidden"
        />
        {/* Sun icon for light mode */}
        <div className="swap-on p-2">
          <TbSunFilled className="text-xl text-neutral-500 dark:text-neutral-300 group-hover:rotate-90 duration-300" />
        </div>
        {/* Moon icon for dark mode */}
        <div className="swap-off p-2">
          <TbMoonFilled className="text-xl text-neutral-500 dark:text-neutral-300 group-hover:rotate-90 duration-300" />
        </div>
      </label>
    </div>
  );
}
