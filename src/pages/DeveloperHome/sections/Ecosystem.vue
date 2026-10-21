<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import ecoCaseAchievement from '@/assets/cases/eco-case-achievement.webp';
import ecoCaseCloudSave from '@/assets/cases/eco-case-cloud-save.webp';
import ecoCaseEmbeddedMoments from '@/assets/cases/eco-case-embedded-moments.webp';
import ecoCaseIap from '@/assets/cases/eco-case-iap.webp';
import ecoCaseLeaderboard from '@/assets/cases/eco-case-leaderboard.webp';
import ecoCaseTapLogin from '@/assets/cases/eco-case-tap-login.webp';
import { ECOSYSTEM_SERVICES } from '../ecosystem';

defineOptions({ name: 'Ecosystem' });

/** Case art per capability; kept here so `ecosystem.ts` stays importable from the build config. */
const CASE_IMAGES: Record<string, string> = {
  'cloud-save': ecoCaseCloudSave,
  iap: ecoCaseIap,
  achievement: ecoCaseAchievement,
  leaderboard: ecoCaseLeaderboard,
  'tap-login': ecoCaseTapLogin,
  'embedded-moments': ecoCaseEmbeddedMoments,
};

const SERVICES = ECOSYSTEM_SERVICES.map(function (item) {
  return { ...item, caseImage: CASE_IMAGES[item.key] };
});

const openKey = ref('');
const sectionRef = ref<HTMLElement | null>(null);

// FLIP morph between a grid card and the expanded panel: remember the source rect on the
// way in, replay it as a transform on the way out.
let morphAnimation: Animation | null = null;
let pendingExpandRect: DOMRect | null = null;
let pendingShrinkRect: DOMRect | null = null;
let pendingShrinkIndex = -1;

function prefersReducedMotion(): boolean {
  return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function serviceIndex(key: string): number {
  return SERVICES.findIndex(function (item) {
    return item.key === key;
  });
}

function morphKeyframes(from: DOMRect, to: DOMRect): Keyframe[] {
  return [
    {
      transform:
        'translate(' +
        (from.left - to.left) +
        'px, ' +
        (from.top - to.top) +
        'px) scale(' +
        from.width / to.width +
        ', ' +
        from.height / to.height +
        ')',
      opacity: 0.35,
    },
    { transform: 'translate(0, 0) scale(1, 1)', opacity: 1 },
  ];
}

function playMorph(el: Element | null | undefined, from: DOMRect | null): void {
  if (!from || !el) return;
  const target = el as HTMLElement;
  if (typeof target.animate !== 'function' || prefersReducedMotion()) return;
  const to = target.getBoundingClientRect();
  if (!to.width || !to.height) return;

  if (morphAnimation) morphAnimation.cancel();
  target.style.transformOrigin = 'top left';
  morphAnimation = target.animate(morphKeyframes(from, to), {
    duration: 420,
    easing: 'cubic-bezier(0.22, 0.9, 0.24, 1)',
  });
  morphAnimation.onfinish = function () {
    target.style.transformOrigin = '';
  };
}

function captureMorphSource(event: MouseEvent): void {
  const target = event.currentTarget as HTMLElement | null;
  const card = target && target.closest ? target.closest('.eco-card') : null;
  pendingExpandRect = card ? card.getBoundingClientRect() : null;
}

// Enter hook of the swap transition: expand grows the panel from the clicked card, collapse
// shrinks the selected card back into its slot in the grid.
function onSwapEnter(el: Element): void {
  if (el.classList.contains('eco-grid')) {
    const fromCard = pendingShrinkRect;
    const index = pendingShrinkIndex;
    pendingShrinkRect = null;
    pendingShrinkIndex = -1;
    const card = index >= 0 ? el.querySelectorAll('.eco-card')[index] : null;
    playMorph(card, fromCard);
    return;
  }
  const fromPanel = pendingExpandRect;
  pendingExpandRect = null;
  playMorph(el.querySelector('.eco-detail-card'), fromPanel);
}

function toggleService(key: string, event: MouseEvent): void {
  // Clicking the open card again returns to the grid, shrinking the panel back into place.
  if (openKey.value === key) {
    const panelCard = sectionRef.value ? sectionRef.value.querySelector('.eco-detail-card') : null;
    const canShrink = Boolean(panelCard) && !prefersReducedMotion();
    pendingExpandRect = null;
    pendingShrinkRect = canShrink && panelCard ? panelCard.getBoundingClientRect() : null;
    pendingShrinkIndex = canShrink ? serviceIndex(key) : -1;
    if (canShrink && sectionRef.value) {
      // Kill the leave fade, otherwise the panel fades out before it shrinks and flickers.
      const wrap = sectionRef.value.querySelector('.eco-panel') as HTMLElement | null;
      if (wrap) wrap.style.transition = 'none';
    }
    openKey.value = '';
    return;
  }

  // Only the grid -> panel hop animates; switching between pills just swaps the panel.
  if (openKey.value) {
    pendingExpandRect = null;
  } else {
    captureMorphSource(event);
  }
  openKey.value = key;
}

const STRUCTURED_DATA_ID = 'dc-ecosystem-structured-data';

/**
 * The page is prerendered, so this JSON-LD ends up in the static HTML and search engines /
 * AI crawlers can read the capability list without running the app.
 */
function injectStructuredData(): void {
  if (document.getElementById(STRUCTURED_DATA_ID)) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = STRUCTURED_DATA_ID;
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TapTap 游戏服务',
    description: 'TapTap 游戏服务的能力介绍与开发指南。',
    itemListElement: SERVICES.map(function (item, index) {
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        description: item.desc,
        url: item.introHref,
      };
    }),
  });
  document.head.appendChild(script);
}

onBeforeUnmount(function () {
  if (morphAnimation) {
    morphAnimation.cancel();
    morphAnimation = null;
  }
});
</script>

<template>
  <section ref="sectionRef" id="ecosystem" class="section ecosystem">
    <div class="eco-stars" aria-hidden="true">
      <span class="eco-stars__a"></span>
      <span class="eco-stars__b"></span>
      <span class="eco-stars__c"></span>
    </div>
    <div class="container">
      <header class="section-heading reveal">
        <span class="section-kicker">ECOSYSTEM</span>
        <h2>游戏常用的衍生服务，<span class="heading-line">开箱即用</span></h2>
      </header>

      <transition name="eco-swap" mode="out-in" @enter="onSwapEnter">
        <!-- Default state: six capability cards -->
        <div v-if="!openKey" key="grid" class="eco-grid">
          <article v-for="item in SERVICES" :key="item.key" class="eco-card">
            <div class="eco-card__summary">
              <h3>
                <button type="button" class="eco-card__toggle" @click="toggleService(item.key, $event)">
                  <span :class="['eco-icon', 'eco-icon--' + item.icon]"
                    ><i :class="['ph', item.glyph]" aria-hidden="true"></i></span
                  >{{ item.name }}
                </button>
              </h3>
              <p>{{ item.desc }}</p>
              <span class="eco-card__more">查看详情<i class="ph ph-arrow-right" aria-hidden="true"></i></span>
            </div>
          </article>
        </div>

        <!-- Expanded state: one detail card on top, capability pills below -->
        <div v-else key="panel" class="eco-panel">
          <template v-for="item in SERVICES" :key="item.key">
            <article
              v-if="openKey === item.key"
              :id="'eco-panel-' + item.key"
              class="eco-detail-card"
              role="tabpanel"
              :aria-labelledby="'eco-pill-' + item.key"
            >
              <header class="eco-detail-card__head">
                <div class="eco-detail-card__title">
                  <h3>
                    <span :class="['eco-icon', 'eco-icon--' + item.icon]"
                      ><i :class="['ph', item.glyph]" aria-hidden="true"></i></span
                    >{{ item.name }}
                  </h3>
                  <p>{{ item.desc }}</p>
                </div>
                <a class="eco-detail__doc" :href="item.introHref" target="_blank" rel="noopener noreferrer"
                  >查看功能介绍文档<i class="ph ph-arrow-up-right" aria-hidden="true"></i
                ></a>
              </header>

              <div class="eco-detail__cols">
                <section class="eco-detail__block">
                  <h4>接入案例</h4>
                  <div class="eco-detail-case">
                    <div class="eco-detail-case__media is-filled">
                      <img :src="item.caseImage" :alt="item.caseName + ' 接入案例配图'" />
                      <span class="eco-detail-case__badge">{{ item.caseName }}</span>
                    </div>
                  </div>
                </section>
                <section class="eco-detail__block eco-detail__block--case-info">
                  <div class="eco-detail__case-info">
                    <div class="eco-detail__case-info-row">
                      <span class="eco-detail__case-info-key">接入方式</span>
                      <span class="eco-detail__case-info-mode">{{ item.accessMode }}</span>
                    </div>
                    <div class="eco-detail__case-info-row eco-detail__case-info-row--stack">
                      <span class="eco-detail__case-info-key">功能实现</span>
                      <ul class="eco-detail__case-points">
                        <li v-for="point in item.casePoints" :key="point.title" class="eco-detail__case-point">
                          <span class="eco-detail__case-point-title">{{ point.title }}：</span>{{ point.desc }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
                <section class="eco-detail__block">
                  <h4>代码示例</h4>
                  <pre class="eco-detail__code"><code>{{ item.codeSample }}</code></pre>
                </section>
              </div>
            </article>
          </template>

          <div class="eco-pills" role="tablist" aria-label="游戏服务能力">
            <button
              v-for="item in SERVICES"
              :id="'eco-pill-' + item.key"
              :key="item.key"
              type="button"
              role="tab"
              class="eco-pill"
              :class="{ 'is-active': openKey === item.key }"
              :aria-selected="openKey === item.key ? 'true' : 'false'"
              :aria-controls="'eco-panel-' + item.key"
              @click="toggleService(item.key, $event)"
            >
              <span :class="['eco-icon', 'eco-icon--' + item.icon]"
                ><i :class="['ph', item.glyph]" aria-hidden="true"></i></span
              >{{ item.name }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>
