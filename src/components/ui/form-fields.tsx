import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label: string;
  optional?: boolean;
  error?: { message?: string };
  children: React.ReactNode;
  className?: string;
}

function FieldWrapper({
  label,
  optional,
  error,
  children,
  className,
}: FieldWrapperProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-muted-foreground">
          {label}
        </label>
        {optional && (
          <span className="text-[11px] text-muted-foreground">optional</span>
        )}
      </div>
      {children}
      {error?.message && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  );
}

export interface AppInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  optional?: boolean;
  error?: { message?: string };
  wrapperClassName?: string;
}

export const AppInputField = React.forwardRef<
  HTMLInputElement,
  AppInputFieldProps
>(({ label, optional, error, wrapperClassName, className, ...props }, ref) => {
  return (
    <FieldWrapper
      label={label}
      optional={optional}
      error={error}
      className={wrapperClassName}
    >
      <Input
        ref={ref}
        className={cn(
          "h-10 rounded-lg bg-background border px-3 text-sm",
          className,
        )}
        {...props}
      />
    </FieldWrapper>
  );
});
AppInputField.displayName = "AppInputField";

export interface AppTextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  optional?: boolean;
  error?: { message?: string };
  wrapperClassName?: string;
}

export const AppTextareaField = React.forwardRef<
  HTMLTextAreaElement,
  AppTextareaFieldProps
>(({ label, optional, error, wrapperClassName, className, ...props }, ref) => {
  return (
    <FieldWrapper
      label={label}
      optional={optional}
      error={error}
      className={wrapperClassName}
    >
      <Textarea
        ref={ref}
        className={cn(
          "resize-none rounded-lg bg-background border px-3 text-sm leading-relaxed",
          className,
        )}
        {...props}
      />
    </FieldWrapper>
  );
});
AppTextareaField.displayName = "AppTextareaField";

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isPending: boolean;
  loadingText?: string;
}

export const SubmitButton = React.forwardRef<
  HTMLButtonElement,
  SubmitButtonProps
>(
  (
    { isPending, loadingText = "Saving...", children, className, ...props },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        type="submit"
        disabled={isPending || props.disabled}
        className={cn(className)}
        {...props}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </Button>
    );
  },
);
SubmitButton.displayName = "SubmitButton";
