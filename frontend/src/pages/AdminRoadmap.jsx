import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Button from '../components/ui/Button';
import SortableTopicRow from '../components/admin/SortableTopicRow';
import TopicEditorModal from '../components/admin/TopicEditorModal';
import { apiFetch } from '../lib/api';

/**
 * Admin roadmap topic manager (/admin/roadmap). Lists the 5 stages, each with its topics,
 * and lets an admin add / edit / delete / drag-reorder topics. Every mutation calls the
 * admin API and then reflects the result locally. Reorder is optimistic within a stage,
 * then persisted; on failure we refetch to resync.
 *
 * Access is gated by RequireAdmin at the route level (and enforced again server-side).
 */
export default function AdminRoadmap() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editor, setEditor] = useState({ open: false, stageId: null, topic: null });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // Reloads the roadmap from the API. Safe to call any time (after mutations). State is
  // only set after the await boundary, so it is not a synchronous effect setState.
  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch('/api/v1/roadmap');
      setStages(data ?? []);
      setError(null);
    } catch {
      setError('Could not load the roadmap.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await apiFetch('/api/v1/roadmap');
        if (!active) return;
        setStages(data ?? []);
        setError(null);
      } catch {
        if (active) setError('Could not load the roadmap.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function handleSave(payload) {
    const isEdit = !!editor.topic;
    if (isEdit) {
      await apiFetch(`/api/v1/admin/roadmap/topics/${editor.topic.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } else {
      await apiFetch('/api/v1/admin/roadmap/topics', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }
    setEditor({ open: false, stageId: null, topic: null });
    await refresh();
  }

  async function handleDelete(topic) {
    if (!window.confirm(`Delete "${topic.title}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/api/v1/admin/roadmap/topics/${topic.id}`, { method: 'DELETE' });
      await refresh();
    } catch {
      setError('Could not delete the topic.');
    }
  }

  async function handleDragEnd(stage, event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stage.topics.findIndex((t) => t.id === active.id);
    const newIndex = stage.topics.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(stage.topics, oldIndex, newIndex);

    setStages((prev) =>
      prev.map((s) => (s.id === stage.id ? { ...s, topics: reordered } : s)),
    );

    try {
      await apiFetch('/api/v1/admin/roadmap/topics/reorder', {
        method: 'PUT',
        body: JSON.stringify({
          stageId: stage.id,
          orderedTopicIds: reordered.map((t) => t.id),
        }),
      });
    } catch {
      setError('Could not save the new order.');
      await refresh();
    }
  }

  if (loading) {
    return <div className="p-8 text-body-md text-text-secondary">Loading roadmap…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="font-mono text-mono-label text-text-muted">// admin · roadmap</div>
      <h1 className="mt-2 font-display text-heading-1 text-text-primary">Manage topics</h1>
      <p className="mt-2 text-body-md text-text-secondary">
        Add, edit, reorder, and remove topics for each roadmap stage. Changes are live
        immediately on the public roadmap.
      </p>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-900 bg-red-950/30 px-3 py-2 text-body-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-8">
        {stages.map((stage) => (
          <section key={stage.id}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-heading-3 text-text-primary">
                  {stage.orderIndex}. {stage.title}
                </h2>
                <p className="text-body-sm text-text-muted">
                  {stage.topics.length} topic{stage.topics.length === 1 ? '' : 's'}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setEditor({ open: true, stageId: stage.id, topic: null })}
              >
                + Add topic
              </Button>
            </div>

            {stage.topics.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border-strong p-4 text-body-sm text-text-muted">
                No topics yet.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(stage, event)}
              >
                <SortableContext
                  items={stage.topics.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2">
                    {stage.topics.map((topic) => (
                      <SortableTopicRow
                        key={topic.id}
                        topic={topic}
                        onEdit={(t) => setEditor({ open: true, stageId: stage.id, topic: t })}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </section>
        ))}
      </div>

      {editor.open ? (
        <TopicEditorModal
          key={editor.topic ? `edit-${editor.topic.id}` : `new-${editor.stageId}`}
          stageId={editor.stageId}
          topic={editor.topic}
          onClose={() => setEditor({ open: false, stageId: null, topic: null })}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
