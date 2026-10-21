<script setup lang="ts">
import { onMounted } from 'vue';
import DeveloperHome from '@/pages/DeveloperHome/index.vue';

defineOptions({ name: 'App' });

onMounted(() => {
  // Remove the first-paint skeleton declared in index.html once Vue has taken over.
  const loading = document.querySelector('.landing-loading');
  if (loading && loading.parentNode) loading.parentNode.removeChild(loading);
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
