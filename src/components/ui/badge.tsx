import * as React from "react"
import { cn } from "@/lib/utils"

// Simple variant implementation without class-variance-authority
type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

const badgeVariants = (variant: BadgeVariant = "default") => {
  const baseClasses = "inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  
  const variantClasses = {
    default: "border-transparent bg-primary text-primary-foreground shadow",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow",
    outline: "border-primary text-primary",
  }
  
  return `${baseClasses} ${variantClasses[variant]}`
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants(variant), className)} {...props} />
  )
}

export { Badge, badgeVariants }
