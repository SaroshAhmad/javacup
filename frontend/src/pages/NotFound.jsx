import { useNavigate } from 'react-router';
import Button from '../components/ui/Button';

/**
 * NotFound (*) — catch-all 404. Voice per the Brand Identity doc.
 */
export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-prose px-4 py-24 text-center">
      <div className="mb-3 font-mono text-mono-label text-text-muted">// 404</div>
      <h1 className="font-display text-heading-1 text-text-primary">
        That page doesn&rsquo;t exist.
      </h1>
      <p className="mt-3 text-body-lg text-text-secondary">
        But your Java roadmap does. Head back to the homepage.
      </p>
      <div className="mt-6 flex justify-center">
        <Button variant="primary" onClick={() => navigate('/')}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
