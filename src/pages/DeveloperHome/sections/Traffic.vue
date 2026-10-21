<script setup lang="ts">
import trafficMobileApp from '@/assets/traffic/traffic-mobile-app.png';
import trafficPc from '@/assets/traffic/traffic-pc.png';
import type { LINKS } from '@/config/links';

defineProps<{
  links: typeof LINKS;
}>();
</script>

<template>
  <section class="section traffic" id="traffic">
    <div class="traffic-frame">
      <header class="section-heading reveal">
        <span class="section-kicker">FIND YOUR PLAYERS</span>
        <h2 class="section-heading__pair">
          <span class="section-heading__pair-lead">上架就有自然曝光，</span
          ><span class="section-heading__pair-accent">增长不必先投放</span>
        </h2>
        <p>算法推荐助你找到初始玩家，多端曝光更可直接助力增长。</p>
      </header>

      <div class="traffic-stage reveal">
        <ul class="traffic-list" aria-label="流量与收入">
          <li><span>01</span><b>不投放也能获得自然流量</b></li>
          <li><span>02</span><b>国内最大的游戏社区</b></li>
          <li><span>03</span><b>平台不抽成，收益全部归开发者</b></li>
          <li><span>04</span><b>通过资源合作计划获得增长</b></li>
        </ul>
        <span class="traffic-stage__hatch" aria-hidden="true"></span>
        <figure class="traffic-visual" id="trafficVisual">
          <div class="traffic-visual__frame">
            <img
              decoding="async"
              class="is-shown"
              :src="trafficMobileApp"
              alt="TapTap Android 与 iOS App"
              loading="lazy"
            />
            <img decoding="async" :data-src="trafficPc" alt="TapTap PC 游戏库" aria-hidden="true" />
          </div>
          <div class="traffic-switch">
            <button type="button" class="is-active" data-slide="0" aria-label="手机" aria-pressed="true">
              <i class="ph-duotone ph-device-mobile-camera" aria-hidden="true"></i>
            </button>
            <span class="traffic-switch__line" aria-hidden="true"></span>
            <button type="button" data-slide="1" aria-label="电脑" aria-pressed="false">
              <i class="ph-duotone ph-devices" aria-hidden="true"></i>
            </button>
          </div>
        </figure>
      </div>

      <div class="growth-plans">
        <span class="growth-plans__label"
          ><i class="ph ph-arrow-down" aria-hidden="true"></i>资源合作计划<i
            class="ph ph-arrow-down"
            aria-hidden="true"
          ></i
        ></span>
      </div>
      <div class="growth-plans growth-links">
        <a :href="links.adPlatform" target="_blank" rel="noopener noreferrer"
          ><span class="growth-links__badge"
            ><i class="ph-bold ph-megaphone growth-links__mark" aria-hidden="true"></i></span
          ><span class="growth-links__copy"><b>广告平台</b><small>精准触达目标玩家</small></span
          ><i class="ph ph-arrow-up-right" aria-hidden="true"></i
        ></a>
        <a :href="links.resExchange" target="_blank" rel="noopener noreferrer"
          ><span class="growth-links__badge"
            ><i class="ph-bold ph-arrows-left-right growth-links__mark" aria-hidden="true"></i></span
          ><span class="growth-links__copy"><b>资源置换</b><small>不增加投放成本，换取更多流量</small></span
          ><i class="ph ph-arrow-up-right" aria-hidden="true"></i
        ></a>
        <a :href="links.contentMarketing" target="_blank" rel="noopener noreferrer"
          ><span class="growth-links__badge"
            ><i class="ph-bold ph-article growth-links__mark" aria-hidden="true"></i></span
          ><span class="growth-links__copy"><b>内容营销</b><small>通过优质内容带动增长</small></span
          ><i class="ph ph-arrow-up-right" aria-hidden="true"></i
        ></a>
      </div>
      <div class="growth-tail" aria-hidden="true"></div>
    </div>
  </section>
</template>
