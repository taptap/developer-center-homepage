import { onBeforeUnmount, onMounted, type Ref } from 'vue';
import { createContext } from './context';
import { useHero } from './use-hero';
import { useTopBar } from './use-top-bar';
import { useReveal } from './use-reveal';
import { useCounters } from './use-counters';
import { useSectionNav } from './use-section-nav';
import { useFormats } from './use-formats';
import { useChain } from './use-chain';
import { useRhythm } from './use-rhythm';
import { useCases } from './use-cases';
import { usePublish } from './use-publish';
import { useTraffic } from './use-traffic';

/**
 * The page's imperative DOM behaviour: one composable per behaviour concern.
 *
 * They share a single context (page root, reduced-motion flag, cleanup list)
 * and mount in a fixed order. Concerns do not map 1:1 to `sections/` components: reveal,
 * scroll spy and anchor scrolling span the whole page, and the publish chain lives inside
 * another section's markup.
 */
export function usePageBehavior(rootRef: Ref<HTMLElement | null>): void {
  let destroy = function destroy() {};

  onMounted(function () {
    const root = rootRef.value;
    if (!root) return;
    const ctx = createContext(root);
    useHero(ctx);
    useTopBar(ctx);
    useReveal(ctx);
    useCounters(ctx);
    useSectionNav(ctx);
    useFormats(ctx);
    useChain(ctx);
    useRhythm(ctx);
    useCases(ctx);
    usePublish(ctx);
    useTraffic(ctx);
    destroy = function destroyPageBehavior() {
      for (const cleanup of ctx.cleanups) cleanup();
    };
  });

  onBeforeUnmount(function () {
    destroy();
  });
}
