<script setup lang="ts">
import case1 from '@/assets/cases/case-1.webp';

defineOptions({ name: 'Cases' });
</script>

<template>
  <section class="section cases" id="cases">
    <div class="container">
      <header class="section-heading reveal">
        <span class="section-kicker">PROVEN PATHS</span>
        <h2 class="section-heading__pair">
          <span class="section-heading__pair-lead">从个人作品到长线大作，</span
          ><span class="section-heading__pair-accent">都有先例</span>
        </h2>
        <p>不同体量的团队，在 TapTap 上都找到了他们的发行路径。</p>
      </header>

      <div class="case-tabs reveal" role="tablist" aria-label="合作案例">
        <button
          class="is-active"
          type="button"
          role="tab"
          id="caseTab0"
          aria-selected="true"
          aria-controls="caseCard"
          data-case="0"
        >
          <img decoding="async" src="@/assets/cases/case-icon-1.png" alt="" loading="lazy" /><span>心动小镇</span
          ><span class="case-tab__bar" aria-hidden="true"></span>
        </button>
        <button type="button" role="tab" id="caseTab1" aria-selected="false" aria-controls="caseCard" data-case="1">
          <img decoding="async" src="@/assets/cases/case-icon-2.png" alt="" loading="lazy" /><span>Phigros</span
          ><span class="case-tab__bar" aria-hidden="true"></span>
        </button>
        <button type="button" role="tab" id="caseTab2" aria-selected="false" aria-controls="caseCard" data-case="2">
          <img decoding="async" src="@/assets/cases/case-icon-3.png" alt="" loading="lazy" /><span>泰拉瑞亚</span
          ><span class="case-tab__bar" aria-hidden="true"></span>
        </button>
        <button type="button" role="tab" id="caseTab3" aria-selected="false" aria-controls="caseCard" data-case="3">
          <img decoding="async" src="@/assets/cases/case-icon-4.png" alt="" loading="lazy" /><span>原神</span
          ><span class="case-tab__bar" aria-hidden="true"></span>
        </button>
        <button type="button" role="tab" id="caseTab4" aria-selected="false" aria-controls="caseCard" data-case="4">
          <img decoding="async" src="@/assets/cases/case-icon-yihuan.png" alt="" loading="lazy" /><span>异环</span
          ><span class="case-tab__bar" aria-hidden="true"></span>
        </button>
        <button type="button" role="tab" id="caseTab5" aria-selected="false" aria-controls="caseCard" data-case="5">
          <img decoding="async" src="@/assets/cases/case-icon-5.jpg" alt="" loading="lazy" /><span>心动的公寓</span
          ><span class="case-tab__bar" aria-hidden="true"></span>
        </button>
        <button type="button" role="tab" id="caseTab6" aria-selected="false" aria-controls="caseCard" data-case="6">
          <img decoding="async" src="@/assets/cases/case-icon-6.png" alt="" loading="lazy" /><span>翡翠经营模拟器</span
          ><span class="case-tab__bar" aria-hidden="true"></span>
        </button>
      </div>

      <div class="case-stage reveal">
        <div class="case-card" id="caseCard" role="tabpanel" aria-labelledby="caseTab0">
          <div class="case-card__text">
            <div class="case-card__veil" aria-hidden="true">
              <img decoding="async" id="caseVeilImage" alt="" :src="case1" loading="lazy" />
            </div>
            <span class="case-card__label" id="caseLabel">全链路深度发行</span>
            <h3 id="caseName">心动小镇</h3>
            <p id="caseDesc">
              未走传统分发渠道，选择 TapTap
              独家发行。登录、测试招募、更新唤起、礼包与社区互动组合使用，分阶段做曝光和留存。
            </p>
            <div class="case-card__stat" id="caseStatBlock">
              <span class="case-card__stat-value" id="caseStat">1438</span
              ><span class="case-card__stat-unit" id="caseUnit">万+</span>
              <span class="case-card__stat-label" id="caseStatLabel">TapTap 上线两周下载量</span>
            </div>
          </div>
          <div class="case-card__media">
            <img decoding="async" id="caseImage" :src="case1" alt="心动小镇游戏画面" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
