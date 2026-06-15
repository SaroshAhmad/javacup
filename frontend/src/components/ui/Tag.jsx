import { cn } from '../../lib/cn';

const tones = {
  switcher: 'bg-tag-switcher-bg text-tag-switcher',
  grad: 'bg-tag-grad-bg text-tag-grad',
  self: 'bg-tag-self-bg text-tag-self',
  student: 'bg-tag-student-bg text-tag-student',
  pro: 'bg-tag-pro-bg text-tag-pro',
};

const labels = {
  switcher: 'career_switcher',
  grad: 'cs_graduate',
  self: 'self_taught',
  student: 'student',
  pro: 'professional',
};

export default function Tag({ tone = 'switcher', label, className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border border-border-subtle px-2 py-0.5 font-mono text-body-sm',
        tones[tone],
        className,
      )}
      {...props}
    >
      {label ?? labels[tone]}
    </span>
  );
}
