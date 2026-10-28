<script setup lang="ts">
import { onMounted } from 'vue';
import { resolveConsoleEntry } from '@/boot/console-entry';
import { isGateRevealed, revealHomepage } from '@/boot/entry-gate';
import DeveloperHome from '@/pages/DeveloperHome/index.vue';

defineOptions({ name: 'App' });

onMounted(() => {
  void resolveConsoleEntry().then(function (target) {
    // The safety net may have revealed the page while the check was still running (slow
    // network); redirecting now would show the homepage and then take it away again.
    if (target && !isGateRevealed()) {
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
