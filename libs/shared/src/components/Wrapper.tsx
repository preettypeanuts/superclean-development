import { ReactNode } from "react";

type WrapperProps = {
    children: ReactNode;
    className?: string;
};

export const Wrapper = ({ children, className = "" }: WrapperProps) => {
    return (
        <div
            className={`bg-lightColor dark:bg-darkColor rounded-3xl p-5 min-h-[91.5lvh] space-y-5 ${className}`}
        >
            {children}
        </div>
    );
};
