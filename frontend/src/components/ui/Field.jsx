import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

/**
 * Form field primitives (Brand Identity v2.0).
 *
 * Field    — label + optional error/hint wrapper, used around any control.
 * Input    — single-line text/email/url input.
 * Textarea — multi-line input.
 * Select   — native select styled to match.
 *
 * Shared control styling: raised surface, hairline border that lightens to amber on
 * focus, body-md text. Error state swaps the border to the success-red... no — to a
 * clear error treatment. Focus ring is the global amber :focus-visible.
 */

const controlBase =
  'w-full rounded-md border bg-raised px-3 py-2.5 text-body-md text-text-primary ' +
  'placeholder:text-text-muted transition-colors duration-150 ' +
  'focus:outline-none focus:border-amber-400 ' +
  'disabled:opacity-50 disabled:pointer-events-none';

function controlBorder(invalid) {
  return invalid ? 'border-red-500/70' : 'border-border-strong';
}

/** Field — label + control + optional hint/error. */
export function Field({ label, htmlFor, error, hint, required, className, children }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? (
        <label htmlFor={htmlFor} className="text-body-sm font-medium text-text-secondary">
          {label}
          {required ? <span className="ml-0.5 text-amber-400">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <span className="text-body-sm text-red-400">{error}</span>
      ) : hint ? (
        <span className="text-body-sm text-text-muted">{hint}</span>
      ) : null}
    </div>
  );
}

export const Input = forwardRef(function Input(
  { invalid = false, className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(controlBase, controlBorder(invalid), className)}
      {...props}
    />
  );
});

export const Textarea = forwardRef(function Textarea(
  { invalid = false, rows = 4, className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(controlBase, controlBorder(invalid), 'resize-y', className)}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select(
  { invalid = false, className, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(controlBase, controlBorder(invalid), 'cursor-pointer', className)}
      {...props}
    >
      {children}
    </select>
  );
});
