"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";

interface PageBannerProps {
  title: string;
  showBackButton?: boolean;
  variant?: "gradient" | "white";
  size?: "normal" | "compact";
  className?: string;
  titleClassName?: string;
  backButtonClassName?: string;
  scrollThreshold?: number; // Threshold untuk memulai transisi sticky
}

export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  showBackButton = true,
  variant = "gradient",
  size = "normal",
  className = "",
  titleClassName = "",
  backButtonClassName = "",
  scrollThreshold = 0
}) => {

  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setScrollY(scrollPosition);

          // Menggunakan threshold untuk mencegah flickering pada scroll kecil
          setIsScrolled(scrollPosition > scrollThreshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollThreshold]);

  const handleBackClick = () => {
    router.back();
  };

  // Background styles based on variant
  const backgroundStyles = {
    gradient: "bg-gradient-to-r from-mainColor from-10% to-mainDark to-110%",
    white: "bg-white dark:bg-black"
  };

  // Height styles based on size
  const heightStyles = {
    normal: "h-[147px]",
    compact: "h-[80px]"
  };

  // Text color based on variant
  const textColor = variant === "gradient" ? "text-white" : "text-gray-900";

  // Back button styles based on variant
  const backButtonStyles = variant === "gradient"
    ? "bg-white/80 text-mainColor"
    : "bg-mainColor/50 text-mainDark";

  // Calculate dynamic height dengan smooth transition
  const dynamicHeight = isScrolled
    ? "80px"
    : size === "normal" ? "147px" : "80px";

  // Calculate opacity untuk smooth fade effect
  const backgroundOpacity = Math.min(1, Math.max(0.8, (scrollThreshold - scrollY) / scrollThreshold));

  return (
    <main
      className={`${isScrolled ? "sticky top-0 z-40 backdrop-blur-lg" : ""} w-screen`}
    >
      <section
        className={`
          w-screen 
          ${backgroundStyles[variant]} 
          rounded-b-2xl 
          flex 
          items-center 
          relative 
          transition-all 
          duration-300 
          ease-out
          ${className}
        `}
        style={{
          height: dynamicHeight,
          opacity: isScrolled ? backgroundOpacity : 1,
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
        }}
      >
        <div className="mx-5 w-full flex justify-center">
          <div>
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className={`
                  w-[30px] 
                  h-[30px] 
                  ${backButtonStyles} 
                  rounded-lg 
                  flex 
                  justify-center 
                  items-center 
                  transition-all 
                  duration-200 
                  ease-out
                  hover:scale-105
                  active:scale-95
                  ${backButtonClassName}
                `}
              >
                <BsArrowLeft size={20} />
              </button>
            )}
          </div>
          <div className="flex flex-1 justify-center">
            <p
              className={`
                text-[20px] 
                font-medium 
                ${textColor} 
                text-center 
                transition-all 
                duration-200 
                ease-out
                ${titleClassName}
              `}
              style={{
                fontSize: isScrolled ? '18px' : '20px',
                transform: `translateY(${isScrolled ? '0px' : '0px'})`,
              }}
            >
              {title}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};