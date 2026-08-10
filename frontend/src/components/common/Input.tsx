import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full rounded-xs border border-input bg-card px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none";

interface FieldWrapperProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FieldWrapper({ id, label, hint, error, required, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="rule-label text-muted-foreground">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className, id, ...props }: InputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
      {...(props.required ? { required: true } : {})}
    >
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldClasses, error && "border-destructive", className)}
        {...props}
      />
    </FieldWrapper>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, className, id, ...props }: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
      {...(props.required ? { required: true } : {})}
    >
      <textarea
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldClasses, "min-h-36 resize-y leading-relaxed", error && "border-destructive", className)}
        {...props}
      />
    </FieldWrapper>
  );
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function SelectField({ label, hint, error, className, id, children, ...props }: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
      {...(props.required ? { required: true } : {})}
    >
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={cn(fieldClasses, "appearance-none pr-8", error && "border-destructive", className)}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}