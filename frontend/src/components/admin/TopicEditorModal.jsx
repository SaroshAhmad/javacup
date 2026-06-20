import { useState } from 'react';
import Button from '../ui/Button';

/**
 * Add/edit topic modal. When `topic` is provided it edits; otherwise it creates a new
 * topic in `stageId`. Initial field values come straight from props at mount — the parent
 * remounts this with a fresh `key` each time it opens, so no effect-based syncing is
 * needed. Calls onSave with the payload; the parent performs the API call.
 */
const PRIORITIES = [
  { value: 'ESSENTIAL', label: 'Essential' },
  { value: 'IMPORTANT', label: 'Important' },
  { value: 'OPTIONAL', label: 'Optional' },
];

export default function TopicEditorModal({ stageId, topic, onClose, onSave }) {
  const [title, setTitle] = useState(topic?.title ?? '');
  const [description, setDescription] = useState(topic?.description ?? '');
  const [priority, setPriority] = useState(topic?.priority ?? 'IMPORTANT');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSave() {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        stageId,
        title: title.trim(),
        description: description.trim() || null,
        priority,
      });
    } catch {
      setError('Could not save. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(6,5,4,0.72)] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-form rounded-xl border border-border-subtle bg-raised p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-heading-3 text-text-primary">
          {topic ? 'Edit topic' : 'New topic'}
        </h2>

        <label className="mt-5 block text-body-sm text-text-secondary">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="mt-1 w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-body-md text-text-primary outline-none focus:border-amber-400"
          placeholder="e.g. Collections and Generics"
        />

        <label className="mt-4 block text-body-sm text-text-secondary">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full resize-none rounded-lg border border-border-strong bg-surface px-3 py-2 text-body-md text-text-primary outline-none focus:border-amber-400"
          placeholder="A short description of what this topic covers."
        />

        <label className="mt-4 block text-body-sm text-text-secondary">Priority</label>
        <div className="mt-1 flex gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={
                'flex-1 rounded-lg border px-3 py-2 text-body-sm transition-colors ' +
                (priority === p.value
                  ? 'border-amber-400 text-text-primary'
                  : 'border-border-strong text-text-secondary hover:border-border-strong')
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        {error ? <p className="mt-3 text-body-sm text-red-400" role="alert">{error}</p> : null}

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" disabled={saving} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : topic ? 'Save changes' : 'Add topic'}
          </Button>
        </div>
      </div>
    </div>
  );
}
