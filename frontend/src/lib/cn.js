/**
 * cn — join conditional class names, dropping falsy values.
 * Keeps component class logic readable without pulling in a dependency.
 *
 *   cn('base', isActive && 'active', className)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
