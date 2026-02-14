import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ActionButtonProps = React.ComponentProps<"button"> & {
  children: React.ReactNode;
};

export function NoteActionButton({ children, className, "aria-label": ariaLabel, ...props }: ActionButtonProps) {
  const button = (
    <Button
      className={cn("[&_svg]:size-4!", className)}
      aria-label={ariaLabel}
      variant="ghost"
      size="icon-xs"
      {...props}
    >
      {children}
    </Button>
  );

  if (!ariaLabel) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{ariaLabel}</TooltipContent>
    </Tooltip>
  );
}
