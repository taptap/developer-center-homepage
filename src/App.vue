<script setup lang="ts">
import { onMounted } from 'vue';
import { resolveConsoleEntry } from '@/boot/console-entry';
import DeveloperHome from '@/pages/DeveloperHome/index.vue';

defineOptions({ name: 'App' });

/**
 * Drop the first-paint gate declared in index.html.
 *
 * The gate ships in the prerendered artifact too: the markup is the whole homepage, so
 * without it a signed-in developer would see the page flash before the redirect.
 */
function revealHomepage() {
  const gate = document.querySelector('.entry-gate');
  if (gate && gate.parentNode) gate.parentNode.removeChild(gate);
}

onMounted(() => {
  void resolveConsoleEntry().then(function (target) {
    if (target) {
      // Push, not replace: the SPA behaved the same way, so "back" returns to the homepage.
      // The gate stays up until the navigation commits, so the flash never happens.
      window.location.assign(target);
      return;
    }
    revealHomepage();
  });
});

// Back/forward cache: the page comes back exactly as it was left — usually mid-decision
// with the gate still up, and `onMounted` does not run again on restore.
window.addEventListener('pageshow', function (event) {
  if (event.persisted) revealHomepage();
});
</script>

<template>
  <!--
    `.home` is the scroll container: index.html hides the body overflow, so the page
    scrolls here and the scrollbar stays out of the way. `composables/context.ts` does not
    rely on this class name — it finds the scroll container through computed overflow.
  -->
  <div class="home">
    <DeveloperHome />
  </div>
</template>

<style>
.home {
  /* `100dvh` follows the mobile browser toolbars; the `100vh` line is the fallback for
     engines without dynamic viewport units. */
  max-height: 100vh;
  max-height: 100dvh;
  /* `auto` instead of the deprecated `overflow-y: overlay`, which behaved the same here. */
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  scrollbar-width: none;
}

.home::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
