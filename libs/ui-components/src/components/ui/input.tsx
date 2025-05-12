import * as React from "react";
import { cn } from "../../utils";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    const isFile = type === "file";

    return (
      <div className="relative w-full">
        {icon && !isFile && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            icon && !isFile ? "pl-10 pr-3" : "px-3",
            isFile
              ? "!px-0 file:text-white file-input file:cursor-pointer file:rounded-l-lg file:border-none file:bg-neutral-500 file:text-sm file:font-medium flex h-9 w-full rounded-lg border border-neutral-00 bg-transparent py-0 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              : "flex h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent py-1 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-200 dark:disabled:bg-neutral-700 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
