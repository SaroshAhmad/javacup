import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

/**
 * Button — the primary action atom (Brand Identity v2.0, §7.1).
 *
 * Variants:
 *  - primary   bright amber-500 fill, amber-900 text. The single most important
 *              action on a screen. Only one visible at a time.
 *  - secondary raised surface + hairline border. Alternative actions.
 *  - ghost     transparent. Tertiary / nav actions.
 *
 * Sizes: sm | md (default) | lg.
 *
 * Polymorphic: pass `as` to render a different element while keeping button styling —
 * e.g. `as={Link} to="/signup"` for a navigation action, or `as="a" href="…"`. Defaults
 * to a real <button>. The `type` attribute is only applied when rendering a <button>.
 *
 * Focus ring is provided globally by :focus-visible (amber-400) — never removed here.
 */
const base =
  'inline-flex items-center justify-center gap-2 font-sans font-medium ' +
  'rounded-md transition-colors duration-150 ' +
  'disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary:
    'bg-amber-500 text-amber-900 border border-amber-700 ' +
    'hover:bg-amber-700 hover:text-amber-950',
  secondary:
    'bg-raised text-text-primary border border-border-strong ' +
    'hover:border-amber-400',
  ghost:
    'bg-transparent text-text-secondary ' +
    'hover:bg-raised hover:text-text-primary',
};

const sizes = {
  sm: 'text-body-sm px-3 py-1.5',
  md: 'text-body-md px-5 py-2.5',
  lg: 'text-body-lg px-6 py-3',
};

const Button = forwardRef(function Button(
  { as: Component = 'button', variant = 'primary', size = 'md', type = 'button', className, children, ...props },
  ref,
) {
  const isNativeButton = Component === 'button';
  return (
    <Component
      ref={ref}
      type={isNativeButton ? type : undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Button;
