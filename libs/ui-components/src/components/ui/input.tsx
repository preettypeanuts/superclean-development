import * as React from "react";
import { cn } from "../../utils";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  error?: string;
  validation?: RegExp;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, validation, label, ...props }, ref) => {
    const isFile = type === "file";
    const [touched, setTouched] = React.useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      if (props.onBlur) props.onBlur(e);
    };

    const isError = React.useMemo(() => {
      if (error) return true;
      if (validation && props.value) return !validation.test(props.value as string);
      if (props.required && !props.value) return true;
      if (props.value && typeof props.value === "string" && props.value.trim() === "")
        return true;
      if (type == 'date' && props.value && isNaN(Date.parse(props.value as string)))
        return true;
    }, [error, validation, props]);

    const errorMessage = React.useMemo(() => {
      if (error) return error;
      if (validation && props.value && !validation.test(props.value as string))
        return `${label || "Input"} tidak valid`;
      if (props.required && !props.value) return "Input ini wajib diisi";
      if (props.value && typeof props.value === "string" && props.value.trim() === "")
        return "Input tidak boleh kosong";
      return "";
    }, [error, validation, props]);

    return (
      <div className="relative w-full">
        {icon && !isFile && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {icon}
          </span>
        )}
        <input
          onBlur={handleBlur}
          type={type}
          className={cn(
            icon && !isFile ? "pl-10 pr-3" : "px-3",
            isFile
              ? "!px-0 file:text-white file-input file:cursor-pointer file:rounded-l-lg file:border-none file:bg-neutral-500 file:text-sm file:font-medium flex h-9 w-full rounded-lg border border-neutral-00 bg-transparent py-0 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              : "flex h-9 w-full rounded-lg border border-neutral-200 placeholder:capitalize dark:border-neutral-700 bg-transparent py-1 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-200 dark:disabled:bg-neutral-700 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {isError && touched && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
