import { ReactNode } from "react";

type WrapperProps = {
    children: ReactNode;
    className?: string;
};

export const Wrapper = ({ children, className = "" }: WrapperProps) => {
    return (
        <div
            className={`mx-2 bg-white dark:bg-black rounded-xl p-5 space-y-5 max-h-[90.5lvh] flex-grow overflow-y-scroll no-scrollbar flex flex-col shadow-mainShadow ${className}`}
        >
            {children}
        </div>
    );
};

export const WrapperMobile = ({ children, className = "" }: WrapperProps) => {
    return (
        <div
            className={`m-5 ${className}`}
        >
            {children}
        </div>
    );
};
