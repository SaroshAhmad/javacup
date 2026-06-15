import { cn } from '../../lib/cn';

/**
 * Card — the standard raised surface (Brand Identity v2.0, §7.2).
 *
 * Depth comes from a layered surface + 1px hairline border, never a shadow at rest.
 * When `interactive`, the border lightens on hover over 150ms — no lift, no scale.
 *
 *  - padding   none | sm | md (default) | lg
 *  - interactive  adds the hover-border treatment for clickable cards
 *  - as         render as a different element (e.g. "a", "button", "article")
 */
const padding = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export default function Card({
  as: Component = 'div',
  padding: pad = 'md',
  interactive = false,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'rounded-lg border border-border-subtle bg-surface',
        padding[pad],
        interactive && 'transition-colors duration-150 hover:border-border-strong',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
