import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * One draggable topic row inside a stage (admin). Shows the title, a draft/live status
 * badge, a priority pill, and publish / edit / delete actions. The drag handle is the grip
 * icon, so clicking a button doesn't start a drag.
 */
const PRIORITY_STYLES = {
  ESSENTIAL: { color: '#F0A52E', backgroundColor: '#1E1809', label: 'Essential' },
  IMPORTANT: { color: '#E0A93C', backgroundColor: '#1E1809', label: 'Important' },
  OPTIONAL: { color: '#8E8A80', backgroundColor: '#1C1A15', label: 'Optional' },
};

export default function SortableTopicRow({ topic, onEdit, onDelete, onTogglePublish }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const pri = PRIORITY_STYLES[topic.priority] ?? PRIORITY_STYLES.IMPORTANT;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-border-subtle bg-raised p-3"
    >
      <button
        type="button"
        className="cursor-grab touch-none text-text-muted hover:text-text-secondary active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="3" r="1.3" /><circle cx="11" cy="3" r="1.3" />
          <circle cx="5" cy="8" r="1.3" /><circle cx="11" cy="8" r="1.3" />
          <circle cx="5" cy="13" r="1.3" /><circle cx="11" cy="13" r="1.3" />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-body-md text-text-primary">{topic.title}</span>
          {topic.published ? (
            <span className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase" style={{ color: '#34D399', backgroundColor: '#0E2620' }}>
              Live
            </span>
          ) : (
            <span className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase" style={{ color: '#8E8A80', backgroundColor: '#1C1A15' }}>
              Draft
            </span>
          )}
        </div>
        {topic.description ? (
          <div className="truncate text-body-sm text-text-muted">{topic.description}</div>
        ) : null}
      </div>

      <span
        className="shrink-0 rounded px-2 py-0.5 font-mono text-mono-label"
        style={{ color: pri.color, backgroundColor: pri.backgroundColor }}
      >
        {pri.label}
      </span>

      <button
        type="button"
        onClick={() => onTogglePublish(topic)}
        className={
          'shrink-0 rounded-md border px-2.5 py-1 text-body-sm ' +
          (topic.published
            ? 'border-border-strong text-text-muted hover:text-text-secondary'
            : 'border-amber-700 text-amber-400 hover:text-amber-400')
        }
      >
        {topic.published ? 'Unpublish' : 'Publish'}
      </button>
      <button
        type="button"
        onClick={() => onEdit(topic)}
        className="shrink-0 rounded-md border border-border-strong px-2.5 py-1 text-body-sm text-text-secondary hover:text-text-primary"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(topic)}
        className="shrink-0 rounded-md border border-border-strong px-2.5 py-1 text-body-sm text-text-muted hover:text-red-400"
      >
        Delete
      </button>
    </div>
  );
}
