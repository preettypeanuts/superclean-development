import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"
import * as React from "react"
import { cn } from "../../utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-thirdColor text-primary-foreground hover:bg-thirdColor/90",
        main: "bg-mainColor text-primary-foreground hover:bg-mainColor/90 text-white",
        submit: "bg-green-500 dark:bg-green-600 text-white hover:bg-green-600",
        destructive: "bg-destructive hover:bg-destructive/90 text-white",
        outline: "border border-input border-neutral-200 dark:border-neutral-700 hover:bg-accent hover:text-accent-foreground",
        outline2: "border border-thirdColor dark:border-thirdColor text-thirdColor hover:bg-thirdColor hover:text-white dark:hover:text-black",
        secondary: "bg-lightColor dark:bg-darkColor text-secondary-foreground hover:invert",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        disabled: "bg-neutral-300 text-neutral-600 cursor-not-allowed",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  loading?: boolean
}

const ButtonLoader = () => (
  <>
    <Loader2Icon className="animate-spin" />
  </>
)


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon, iconPosition = "left", children, loading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {loading && <ButtonLoader />}
        {icon && iconPosition === "left" && <span>{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span>{icon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

