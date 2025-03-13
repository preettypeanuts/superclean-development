"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { TbMoonFilled, TbSunFilled } from "react-icons/tb";

interface ThemeSwitchProps {
  isExpanded: boolean;
}

export const ThemeSwitch = ({ isExpanded }: ThemeSwitchProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(resolvedTheme);

  // Update state saat tema berubah
  useEffect(() => {
    setCurrentTheme(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <div data-tip="Theme" className="flex flex-col gap-2 w-full tooltip tooltip-right">
      
      {/* Minimize Mode */}
      <button 
        onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")} 
        className={`${isExpanded && "hidden"} flex flex-col items-center h-[35px] p-1 rounded-xl bg-neutral-100/40 dark:bg-neutral-500/20 relative overflow-hidden`}
      >
        {/* Icon Dark Mode */}
        <div className={`${currentTheme === "light" ? "-translate-y-[200%]" : "translate-y-[1.5px]"} transition-transform duration-500 w-fit h-fit z-20 flex items-center justify-center py-1 rounded-lg`}>
          <TbMoonFilled className="text-md" />
        </div>

        {/* Icon Light Mode */}
        <div className={`${currentTheme === "dark" ? "translate-y-[200%]" : "-translate-y-[23px]"} transition-transform duration-500 w-fit h-fit z-20 flex items-center justify-center py-1 rounded-lg`}>
          <TbSunFilled className="text-md" />
        </div>
      </button>

      {/* Expand Mode */}
      <div className={`${!isExpanded && "hidden"} flex items-center gap-1 p-1 bg-neutral-100/40 dark:bg-neutral-500/20 rounded-xl relative overflow-hidden`}>
        <button
          className={`duration-300 w-full z-20 flex items-center justify-center py-1 rounded-lg ${currentTheme === 'light' ? 'bg-mainColor/0' : ''}`}
          onClick={() => setTheme("light")}
        >
          <TbSunFilled className="text-md" />
        </button>
        <button
          className={`duration-300 w-full z-20 flex items-center justify-center py-1 rounded-lg ${currentTheme === 'dark' ? 'bg-mainColor/0' : ''}`}
          onClick={() => setTheme("dark")}
        >
          <TbMoonFilled className="text-md" />
        </button>
        <div
          className={`absolute z-10 h-6 w-[92px] bg-mainColor/50 rounded-lg transition-transform duration-300 ${currentTheme === 'dark' ? 'translate-x-full' : ''}`}
        />
      </div>

    </div>
  );
};
