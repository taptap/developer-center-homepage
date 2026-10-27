<script setup lang="ts">
import { onMounted } from 'vue';
import { resolveConsoleEntry } from '@/boot/console-entry';
import DeveloperHome from '@/pages/DeveloperHome/index.vue';

defineOptions({ name: 'App' });

function removeFirstPaintSkeleton() {
  const loading = document.querySelector('.landing-loading');
  if (loading && loading.parentNode) loading.parentNode.removeChild(loading);
}

onMounted(() => {
  // The skeleton declared in index.html stays up until Vue has taken over *and* the
  // console-entry question is settled: a signed-in developer should never see the marketing
  // page flash before the redirect, and everyone else should not see it at all.
  void resolveConsoleEntry().then(function (target) {
    if (target) {
      // Push, not replace: the SPA behaved the same way, so "back" returns to the homepage.
      window.location.assign(target);
      return;
    }
    removeFirstPaintSkeleton();
  });
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
