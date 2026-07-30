import dynamic from 'next/dynamic';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Hero } from '@/components/sections/Hero';

/**
 * The narrative order is the argument (see docs/01-narrativa-es-sitemap.md):
 * recognition → cause → method → conclusion → decision.
 *
 * Only the hero ships in the first chunk. Everything below the fold is split
 * out, which keeps the initial payload inside the performance budget while the
 * heaviest interactive islands load as the reader approaches them.
 */
const Problem = dynamic(() => import('@/components/sections/Problem').then((m) => m.Problem));
const ModelLayers = dynamic(() =>
  import('@/components/sections/ModelLayers').then((m) => m.ModelLayers),
);
const Assessment = dynamic(() =>
  import('@/components/sections/Assessment').then((m) => m.Assessment),
);
const Analysis = dynamic(() => import('@/components/sections/Analysis').then((m) => m.Analysis));
const CostRoi = dynamic(() => import('@/components/sections/CostRoi').then((m) => m.CostRoi));
const DecisionSupport = dynamic(() =>
  import('@/components/sections/DecisionSupport').then((m) => m.DecisionSupport),
);
const Outcome = dynamic(() => import('@/components/sections/Outcome').then((m) => m.Outcome));
const Methodology = dynamic(() =>
  import('@/components/sections/Methodology').then((m) => m.Methodology),
);
const ClosingCta = dynamic(() =>
  import('@/components/sections/ClosingCta').then((m) => m.ClosingCta),
);

/** Hairline divider between major sections. */
function Rule() {
  return (
    <div className="container-content">
      <hr className="rule-fade" />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main id="tartalom">
        <Hero />
        <Problem />
        <Rule />
        <ModelLayers />
        <Rule />
        <Assessment />
        <Rule />
        <Analysis />
        <Rule />
        <CostRoi />
        <Rule />
        <DecisionSupport />
        <Rule />
        <Outcome />
        <Rule />
        <Methodology />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
