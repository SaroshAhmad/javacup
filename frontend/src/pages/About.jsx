import { useNavigate } from 'react-router';
import Button from '../components/ui/Button';

/**
 * About (/about) — what JavaCup is, why it exists, who's behind it.
 * Voice and values straight from the Brand Identity doc.
 */
export default function About() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-prose px-4 py-16">
      <div className="mb-3 font-mono text-mono-label text-text-muted">// about</div>
      <h1 className="font-display text-heading-1 text-text-primary">
        Clarity for the <span className="text-amber-400">Java journey.</span>
      </h1>

      <p className="mt-6 text-body-lg text-text-secondary">
        There is no shortage of Java content online. There is a shortage of clarity. Most
        people learning Java aren&rsquo;t stuck because they can&rsquo;t find a tutorial —
        they&rsquo;re stuck because they can&rsquo;t tell which of the thousand tutorials
        is worth their time, what order to learn things in, or what actually matters for
        getting hired.
      </p>

      <p className="mt-4 text-body-lg text-text-secondary">
        JavaCup exists to fix that. It&rsquo;s not another content site. It&rsquo;s a
        community-validated map: roadmaps, advice, and curated free resources, ranked by
        the people who&rsquo;ve actually walked the path — career switchers, self-taught
        developers, CS graduates, and working professionals.
      </p>

      <h2 className="mt-12 font-display text-heading-2 text-text-primary">What we believe</h2>
      <div className="mt-4 flex flex-col gap-4">
        {[
          ['Clarity over content', 'We don\u2019t add more tutorials. We organise what already exists into trusted signal.'],
          ['Community over credentials', 'Lived experience beats view counts. The advice that helped someone get hired is worth more than a polished video.'],
          ['Honesty over comfort', 'We\u2019ll tell you what to skip. Not everything is worth learning, and pretending otherwise wastes your time.'],
          ['Free knowledge, always', 'The core guidance is free forever. No paywalls on the fundamentals.'],
        ].map(([title, body]) => (
          <div key={title} className="border-l-2 border-amber-700/40 pl-4">
            <div className="font-display text-heading-3 text-text-primary">{title}</div>
            <p className="mt-1 text-body-md text-text-secondary">{body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-heading-2 text-text-primary">Built in the open</h2>
      <p className="mt-4 text-body-lg text-text-secondary">
        JavaCup is being built openly, one commit at a time, by a small community of
        people who want real experience building a live product. If that&rsquo;s you,
        there&rsquo;s a place for you here.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => navigate('/contribute')}>
          Join the build
        </Button>
        <Button variant="secondary" onClick={() => navigate('/roadmap')}>
          See the roadmap →
        </Button>
      </div>
    </div>
  );
}
