import { useMemo } from 'react';
import { Studio } from 'sanity';
import { getSanityConfig } from '../../sanity.config';

interface Props {
  projectId?: string;
  dataset?: string;
}

export default function SanityStudio({ projectId, dataset }: Props) {
  const config = useMemo(() => {
    return getSanityConfig(projectId, dataset, '/studio');
  }, [projectId, dataset]);

  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}>
      <Studio config={config} />
    </div>
  );
}
