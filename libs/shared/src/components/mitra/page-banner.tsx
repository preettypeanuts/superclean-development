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
}

export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  showBackButton = true,
  variant = "gradient",
  size = "normal",
  className = "",
  titleClassName = "",
  backButtonClassName = ""
}) => {

  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
  return (
    <main
      className={`${isScrolled ? "sticky top-0 z-40" : ""} w-screen`}
    >
      <section
        className={`w-screen ${isScrolled && "!max-h-[80px]"} ${heightStyles[size]} ${backgroundStyles[variant]} rounded-b-2xl flex items-center relative ${className}`}
      >
        <div className="mx-5 w-full  flex justify-center ">
          <div>
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className={`w-[30px] h-[30px] ${backButtonStyles} rounded-lg flex  justify-center items-center ${backButtonClassName}`}
              >
                <BsArrowLeft size={20} />
              </button>
            )}
          </div>
          <div className="flex flex-1  justify-center">
            <p className={`text-[20px] font-medium ${textColor} text-center ${titleClassName}`}>
              {title}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
