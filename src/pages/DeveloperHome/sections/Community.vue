<script setup lang="ts">
import type { LINKS } from '@/config/links';

defineProps<{
  links: typeof LINKS;
}>();
</script>

<template>
  <section class="section community" id="community">
    <div class="container">
      <header class="section-heading reveal">
        <span class="section-kicker">BUILD TOGETHER</span>
        <h2 class="section-heading__pair">
          <span class="section-heading__pair-lead">不止提供工具，</span
          ><span class="section-heading__pair-accent">也陪你一起解决问题</span>
        </h2>
        <p>查阅完整接入文档，或直接进入社区与其他开发者交流经验。</p>
      </header>
      <div class="community-links">
        <a class="community-card" :href="links.docs" target="_blank" rel="noopener noreferrer"
          ><span class="community-card__glyph ph ph-book-open" aria-hidden="true"></span
          ><span><small>DOCUMENTATION</small><b>开发者文档</b><em>详细了解服务的使用接入</em></span
          ><i class="ph ph-arrow-right" aria-hidden="true"></i
        ></a>
        <a class="community-card" :href="links.forum" target="_blank" rel="noopener noreferrer"
          ><span class="community-card__glyph ph ph-chats-circle" aria-hidden="true"></span
          ><span><small>COMMUNITY</small><b>开发者论坛</b><em>分享经验，获得同行与官方支持</em></span
          ><i class="ph ph-arrow-right" aria-hidden="true"></i
        ></a>
      </div>
    </div>
  </section>
</template>
