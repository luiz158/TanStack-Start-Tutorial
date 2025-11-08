import * as React from "react";
import { cn } from "~/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline";
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const styles = {
    default:
      "inline-flex items-center rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white dark:bg-gray-100 dark:text-gray-900",
    secondary:
      "inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-200",
    outline:
      "inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-900 dark:border-gray-700 dark:text-gray-200",
  } as const;
  return <span className={cn(styles[variant], className)} {...props} />;
}
