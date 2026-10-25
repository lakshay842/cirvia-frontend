import Link from "next/link";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/core/button";
import { cn } from "@/lib/utils";

interface LinkButtonProps
  extends VariantProps<typeof buttonVariants>,
    React.ComponentPropsWithoutRef<typeof Link> {}

export function LinkButton({
  className,
  variant,
  size,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </Link>
  );
}
