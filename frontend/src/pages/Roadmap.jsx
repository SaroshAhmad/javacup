import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

/**
 * Public roadmap (/roadmap) — F-01, the core content surface. A vertical "journey": the
 * five stages sit on a connecting spine, numbered, each collapsible. Clicking a stage
 * smoothly reveals its published topics in a "connected drawer" — indented under the stage
 * with a left amber spine that echoes the journey line. Fully public; only published topics
 * are returned by the API, so drafts never appear here.
 *
 * The expand animation uses a CSS grid-rows transition (0fr -> 1fr), which animates to the
 * content's natural height without measuring it in JS; the inner content fades and slides
 * in slightly on top.
 */
const PRIORITY = {
  ESSENTIAL: { color: '#F0A52E', bg: '#1E1809', label: 'Essential' },
  IMPORTANT: { color: '#E0A93C', bg: '#1E1809', label: 'Important' },
  OPTIONAL: { color: '#8E8A80', bg: '#1C1A15', label: 'Optional' },
};

function Chevron({ open }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function TopicCard({ topic }) {
  const pri = PRIORITY[topic.priority] ?? PRIORITY.IMPORTANT;
  return (
    <div className="rounded-lg border border-border-subtle bg-raised p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-body-md text-text-primary">{topic.title}</span>
        <span
          className="shrink-0 rounded px-2 py-0.5 font-mono text-mono-label"
          style={{ color: pri.color, backgroundColor: pri.bg }}
        >
          {pri.label}
        </span>
      </div>
      {topic.description ? (
        <p className="mt-1.5 text-body-sm text-text-secondary">{topic.description}</p>
      ) : null}
    </div>
  );
}

function StageNode({ stage, isLast, open, onToggle }) {
  const topicCount = stage.topics.length;

  return (
    <div className="relative pl-14">
      {/* Journey spine (hidden on the last node) */}
      {!isLast ? (
        <span className="absolute left-[22px] top-11 bottom-0 w-px bg-border-strong" aria-hidden="true" />
      ) : null}

      {/* Node circle */}
      <span
        className="absolute left-0 top-1 flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-surface font-display text-heading-3 text-amber-400"
        aria-hidden="true"
      >
        {stage.orderIndex}
      </span>

      {/* Stage header — clickable */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 rounded-xl border border-border-subtle bg-surface p-5 text-left transition-colors hover:border-border-strong"
        aria-expanded={open}
      >
        <span className="min-w-0">
          <span className="block font-display text-heading-3 text-text-primary">{stage.title}</span>
          <span className="mt-1 block text-body-md text-text-secondary">{stage.description}</span>
          <span className="mt-2 block font-mono text-mono-label text-text-muted">
            {topicCount === 0 ? 'coming soon' : `${topicCount} topic${topicCount === 1 ? '' : 's'}`}
          </span>
        </span>
        <span className="mt-1 shrink-0 text-text-muted">
          <Chevron open={open} />
        </span>
      </button>

      {/* Connected drawer — animates open via grid-rows 0fr -> 1fr */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div
            className="ml-3 mt-3 border-l-2 border-amber-700 pl-4"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(-4px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            <div className="flex flex-col gap-2 pb-8">
              {topicCount === 0 ? (
                <div className="rounded-lg border border-dashed border-border-strong p-4 text-body-sm text-text-muted">
                  Topics for this stage are being prepared.
                </div>
              ) : (
                stage.topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacing when collapsed so nodes don't crowd */}
      {open ? null : <div className="pb-8" />}
    </div>
  );
}

export default function Roadmap() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await apiFetch('/api/v1/roadmap');
        if (!active) return;
        setStages(data ?? []);
        setError(false);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-dot-grid mask-fade-b" />
      <div className="relative mx-auto max-w-2xl px-4 py-16">
        <div className="font-mono text-mono-label text-amber-400">// the java roadmap</div>
        <h1 className="mt-2 font-display text-display text-text-primary">
          From first line to <span className="text-amber-400">first job</span>.
        </h1>
        <p className="mt-3 max-w-lg text-body-lg text-text-secondary">
          A community-validated path through Java — five stages, from the absolute basics to
          interview-ready. Start anywhere, but this is the order we'd walk it.
        </p>

        <div className="mt-12">
          {loading ? (
            <p className="text-body-md text-text-secondary">Loading the roadmap…</p>
          ) : error ? (
            <p className="text-body-md text-text-secondary">
              Couldn't load the roadmap right now. Please try again shortly.
            </p>
          ) : (
            stages.map((stage, i) => (
              <StageNode
                key={stage.id}
                stage={stage}
                isLast={i === stages.length - 1}
                open={openId === stage.id}
                onToggle={() => setOpenId((cur) => (cur === stage.id ? null : stage.id))}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
