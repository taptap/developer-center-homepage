<script setup lang="ts">
import type { LINKS } from '@/config/links';

defineProps<{
  links: typeof LINKS;
  loggedIn: boolean;
  userAvatar: string;
  userName: string;
  userInitial: string;
}>();
</script>

<template>
  <header class="topbar" id="topbar">
    <div class="topbar__inner">
      <a class="brand" href="#top" aria-label="TapTap 开发者中心首页">
        <img decoding="async" src="@/assets/logo-taptap.svg" alt="TapTap 开发者服务" />
      </a>
      <nav class="topbar__nav" aria-label="主导航">
        <div class="topbar__drop">
          <button type="button" class="topbar__link topbar__drop-toggle" aria-expanded="false" aria-haspopup="true">
            商业化与合作
            <i class="ph ph-caret-down topbar__caret" aria-hidden="true"></i>
          </button>
          <div class="topbar__drop-menu" role="menu">
            <a role="menuitem" :href="links.adPlatformMenu" target="_blank" rel="noopener noreferrer">推广平台</a>
            <a role="menuitem" :href="links.resExchange" target="_blank" rel="noopener noreferrer">资源置换平台</a>
            <a role="menuitem" :href="links.contentMarketing" target="_blank" rel="noopener noreferrer">内容营销平台</a>
            <a role="menuitem" :href="links.adNetwork" target="_blank" rel="noopener noreferrer">广告联盟平台</a>
          </div>
        </div>
        <div class="topbar__drop">
          <button type="button" class="topbar__link topbar__drop-toggle" aria-expanded="false" aria-haspopup="true">
            社区
            <i class="ph ph-caret-down topbar__caret" aria-hidden="true"></i>
          </button>
          <div class="topbar__drop-menu" role="menu">
            <a role="menuitem" :href="links.tutorials">开发者学堂</a>
            <a role="menuitem" :href="links.forum" target="_blank" rel="noopener noreferrer">开发者论坛</a>
          </div>
        </div>
        <a class="topbar__link" :href="links.docs" target="_blank" rel="noopener noreferrer">文档</a>
        <a class="topbar__link" :href="links.tdw" target="_blank" rel="noopener noreferrer">TDW 2026</a>
        <a class="topbar__link" :href="links.spotlight" target="_blank" rel="noopener noreferrer">聚光灯计划</a>
      </nav>
      <div class="topbar__actions">
        <a v-if="!loggedIn" class="topbar__login" :href="links.login">登录</a>
        <span v-else class="topbar__avatar" :title="userName">
          <img decoding="async" v-if="userAvatar" class="topbar__avatar-img" :src="userAvatar" :alt="userName" />
          <span v-else class="topbar__avatar-fallback">{{ userInitial }}</span>
        </span>
        <a class="button button--small button--solid" :href="links.console">进入控制台</a>
      </div>
      <button class="topbar__menu" type="button" aria-label="展开导航" aria-expanded="false">
        <i class="ph ph-list" aria-hidden="true"></i>
      </button>
    </div>
  </header>
</template>
