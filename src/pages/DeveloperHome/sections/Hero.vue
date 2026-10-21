<script setup lang="ts">
import type { LINKS } from '@/config/links';

defineProps<{
  links: typeof LINKS;
}>();
</script>

<template>
  <section class="hero" id="top">
    <div class="hero__grid" aria-hidden="true"></div>
    <div class="hero__dot-grid" aria-hidden="true"></div>
    <div class="hero__dot-grid-highlight" aria-hidden="true"></div>
    <div class="hero__orb hero__orb--one" aria-hidden="true"></div>
    <div class="hero__orb hero__orb--two" aria-hidden="true"></div>
    <div class="hero__arc" aria-hidden="true"></div>
    <div class="hero__inner">
      <div class="hero__eyebrow">DEVELOPER SERVICES</div>
      <h1 class="hero__title">
        <span class="hero__title-line"
          ><span class="hero__title-brand"
            ><img decoding="async" class="hero__wordmark" src="@/assets/logo-wordmark.svg" alt="TapTap" /></span
          >为全球开发者</span
        >
        <span class="hero__title-line">提供专业的游戏发行服务</span>
      </h1>
      <p class="hero__lead">
        <span class="hero__lead-accent">游戏合规、增长变现、全球发行</span>
        <span class="hero__lead-rest">，一站式全链路支持</span>
      </p>
      <div class="hero__stats reveal-group" aria-label="平台数据">
        <div class="hero-stat reveal-item">
          <strong><span class="count" data-value="5000">0</span><em>万+</em></strong>
          <span>活跃玩家</span>
        </div>
        <div class="hero-stat reveal-item">
          <strong><span class="count" data-value="24">0</span><em>万+</em></strong>
          <span>入驻开发者</span>
        </div>
        <div class="hero-stat reveal-item">
          <strong><span class="count" data-value="30">0</span><em>万+</em></strong>
          <span>上线游戏</span>
        </div>
      </div>
      <div class="hero__actions reveal" data-delay="190">
        <a class="button button--hero" :href="links.console">进入控制台</a>
        <a class="button button--ghost" :href="links.cli" target="_blank" rel="noopener noreferrer"
          >查看 CLI 用法 <i class="cli-caret" aria-hidden="true"></i
        ></a>
      </div>
      <a class="hero__ai-link reveal" data-delay="230" :href="links.agents"
        >用 AI 做游戏？看接入文档 <span class="ph ph-arrow-right" aria-hidden="true"></span
      ></a>
    </div>
  </section>
</template>
