<script setup lang="ts">
defineOptions({ name: 'SectionNav' });
</script>

<template>
  <nav class="section-nav" id="sectionNav" aria-label="页面内容导航">
    <div class="section-nav__inner">
      <a href="#ways" data-section="ways">游戏类型</a>
      <a href="#publish" data-section="publish">如何上架</a>
      <a href="#ecosystem" data-section="ecosystem">生态能力</a>
      <a href="#rhythm" data-section="rhythm">发行节奏</a>
      <a href="#traffic" data-section="traffic">流量与曝光</a>
      <a href="#cases" data-section="cases">合作案例</a>
    </div>
  </nav>
</template>
