import { cn } from '../../lib/cn';

/**
 * Badge — priority labels on roadmap topics and resources (Brand Identity v2.0, §7.3).
 *
 * Tones express priority through restraint: only "essential" carries the amber accent,
 * so it reads as the one thing that matters most. Recommended and optional step down
 * in weight rather than introducing new colours.
 *
 *  - essential    amber tint — must-do topics, approved resources
 *  - recommended  neutral raised — worth doing
 *  - optional     faint outline — nice to have
 */
const tones = {
  essential: 'bg-amber-surface text-amber-400 border border-amber-700/40',
  recommended: 'bg-raised text-text-secondary border border-border-strong',
  optional: 'bg-transparent text-text-muted border border-border-subtle',
};

export default function Badge({ tone = 'essential', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-body-sm font-medium',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
