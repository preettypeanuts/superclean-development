import { ReactNode } from "react";

type WrapperProps = {
    children: ReactNode;
    className?: string;
};

export const Wrapper = ({ children, className = "" }: WrapperProps) => {
    return (
        <div
            className={`bg-white dark:bg-black rounded-3xl p-7 space-y-5 max-h-[92.2lvh] flex-grow overflow-y-scroll flex flex-col shadow-mainShadow ${className}`}
        >
            {children}
        </div>
    );
};
