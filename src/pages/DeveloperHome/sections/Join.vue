<script setup lang="ts">
import type { LINKS } from '@/config/links';

defineProps<{
  links: typeof LINKS;
}>();
</script>

<template>
  <section class="join" id="join">
    <div class="join__overlay"></div>
    <div class="join__inner">
      <span>READY TO SHIP?</span>
      <h2>下一款被玩家看见的游戏<span class="heading-line">从这里开始</span></h2>
      <a class="button button--hero" :href="links.console"
        >立即成为开发者 <span class="ph ph-arrow-right" aria-hidden="true"></span
      ></a>
    </div>
  </section>
</template>
