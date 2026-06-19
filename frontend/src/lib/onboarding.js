/**
 * Onboarding constants: the five background tags, their display copy, and the roadmap
 * stage each is recommended to start at. Tag keys match the backend BackgroundTag enum
 * and the profiles.background_tag CHECK constraint exactly.
 *
 * Stage recommendations are intentionally simple, sensible defaults — not a science.
 * They give a new user a confident starting point rather than a blank roadmap.
 */
export const BACKGROUND_TAGS = [
  {
    key: 'career_switcher',
    label: 'Career Switcher',
    blurb: 'Moving into software from another field.',
    accent: '#E0A93C',
    accentBg: '#1E1809',
    startStage: 1,
    startStageName: 'Foundations',
    why: 'Starting from the ground up gives you the solid base a switch needs.',
  },
  {
    key: 'student',
    label: 'Student',
    blurb: 'Studying CS or a related field right now.',
    accent: '#7C93F0',
    accentBg: '#11162E',
    startStage: 2,
    startStageName: 'Core Java',
    why: 'You have the basics — Core Java builds real fluency on top of them.',
  },
  {
    key: 'self_taught',
    label: 'Self-Taught',
    blurb: 'Learning to code on your own.',
    accent: '#A78BFA',
    accentBg: '#1E1633',
    startStage: 1,
    startStageName: 'Foundations',
    why: 'A structured base fills the gaps self-teaching often leaves.',
  },
  {
    key: 'cs_graduate',
    label: 'CS Graduate',
    blurb: 'Have a CS degree, sharpening for work.',
    accent: '#34D399',
    accentBg: '#0E2620',
    startStage: 3,
    startStageName: 'OOP & Design',
    why: 'You know the theory — focus on design and real-world structure.',
  },
  {
    key: 'professional',
    label: 'Professional',
    blurb: 'Working dev adding or deepening Java.',
    accent: '#B0ABA0',
    accentBg: '#1C1A15',
    startStage: 4,
    startStageName: 'Java Ecosystem',
    why: 'Skip the basics — go straight to the tools teams ship with.',
  },
];

export function tagByKey(key) {
  return BACKGROUND_TAGS.find((t) => t.key === key) ?? null;
}
