import { ReactNode } from "react";

type WrapperProps = {
    children: ReactNode;
    className?: string;
};

export const Wrapper = ({ children, className = "" }: WrapperProps) => {
    return (
        <div
            className={`bg-white dark:bg-black rounded-3xl p-7 space-y-5 h-full flex flex-col shadow-mainShadow ${className}`}
        >
            {children}
        </div>
    );
};
