<script setup lang="ts">
defineOptions({ name: 'Ecosystem' });
</script>

<template>
  <section class="section ecosystem" id="ecosystem">
    <div class="eco-stars" aria-hidden="true">
      <span class="eco-stars__a"></span>
      <span class="eco-stars__b"></span>
      <span class="eco-stars__c"></span>
    </div>
    <div class="container">
      <header class="section-heading reveal">
        <span class="section-kicker">ECOSYSTEM</span>
        <h2>游戏常用的衍生服务，<span class="heading-line">开箱即用</span></h2>
      </header>
      <div class="eco-grid reveal">
        <article class="eco-card">
          <h3>
            <span class="eco-icon eco-icon--cloud"><i class="ph ph-cloud" aria-hidden="true"></i></span>云存档
          </h3>
          <p>玩家的进度跟着账号走，换手机、换电脑都能接着玩。</p>
          <div class="cost-line">
            <span>接入成本</span>
            <p>预计 0.5-1 天</p>
          </div>
        </article>
        <article class="eco-card">
          <h3>
            <span class="eco-icon eco-icon--pay"><i class="ph ph-credit-card" aria-hidden="true"></i></span>内购与变现
          </h3>
          <p>商品、订单、结算、对账打包集成，一次接入即可解锁主流支付方式。</p>
          <div class="cost-line">
            <span>接入成本</span>
            <p>预计 2-3 天</p>
          </div>
        </article>
        <article class="eco-card">
          <h3>
            <span class="eco-icon eco-icon--award"><i class="ph ph-medal" aria-hidden="true"></i></span>游戏成就
          </h3>
          <p>成就上报全托管，无需服务端即可获取全服解锁进度、白金成就等各项能力。</p>
          <div class="cost-line">
            <span>接入成本</span>
            <p>预计约 3 天</p>
          </div>
        </article>
        <article class="eco-card">
          <h3>
            <span class="eco-icon eco-icon--rank"><i class="ph ph-chart-bar" aria-hidden="true"></i></span>排行榜
          </h3>
          <p>好友榜、全服榜开箱可用，平台更提供完善的排名规则配置与反作弊能力。</p>
          <div class="cost-line">
            <span>接入成本</span>
            <p>预计 0.5-1 天</p>
          </div>
        </article>
        <article class="eco-card">
          <h3>
            <span class="eco-icon eco-icon--account"><i class="ph ph-user" aria-hidden="true"></i></span>TapTap 登录
          </h3>
          <p>玩家用 TapTap 账号直接登录，不用重新注册；老玩家的社交关系也能带进游戏。</p>
          <div class="cost-line">
            <span>接入成本</span>
            <p>预计 0.5-1 天</p>
          </div>
        </article>
        <article class="eco-card">
          <h3>
            <span class="eco-icon eco-icon--community"><i class="ph ph-chat-circle" aria-hidden="true"></i></span
            >内嵌社区
          </h3>
          <p>把 TapTap 社区嵌进游戏，玩家不用切出去就能查攻略、和其他玩家一同讨论。</p>
          <div class="cost-line">
            <span>接入成本</span>
            <p>预计 0.5-1 天</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
