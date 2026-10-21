<script setup lang="ts">
defineOptions({ name: 'Rhythm' });
</script>

<template>
  <section class="section rhythm" id="rhythm">
    <div class="container">
      <div class="rhythm-head">
        <header class="section-heading reveal">
          <span class="section-kicker">RELEASE YOUR WAY</span>
          <h2>发行节奏，<span>自由决定</span></h2>
          <p>不管是长线运营大作，还是小体量个人作品，TapTap 都有完善的发布能力。</p>
        </header>
      </div>

      <div class="rhythm-board">
        <div class="rhythm-board__visuals">
          <div class="rhythm-panel rhythm-panel--active reveal" id="rhythmLong">
            <div class="flow">
              <div class="flow-curve">
                <svg viewBox="0 0 547 472" aria-hidden="true">
                  <circle class="vibe-ring" cx="267.881" cy="218.378" r="177.382"></circle>
                  <path
                    class="curve-track"
                    d="M41.3735 346.756C54.1644 346.756 74.9533 348.436 104.699 329.592C141.88 306.036 140.217 275.23 190.942 272.83C269.526 269.11 270.276 229.512 287.938 175.62C319.885 78.1389 371.809 163.269 410.173 156.256C448.536 149.243 439.58 117.616 494.389 89.9631"
                  ></path>
                  <path
                    class="curve-progress is-idle"
                    id="curveProgress"
                    d="M41.3735 346.756C54.1644 346.756 74.9533 348.436 104.699 329.592C141.88 306.036 140.217 275.23 190.942 272.83C269.526 269.11 270.276 229.512 287.938 175.62C319.885 78.1389 371.809 163.269 410.173 156.256C448.536 149.243 439.58 117.616 494.389 89.9631"
                    pathLength="100"
                    stroke-dasharray="100"
                    stroke-dashoffset="100"
                  ></path>
                </svg>
                <span class="flow-curve__mark" aria-hidden="true"><i class="ph-bold ph-rocket-launch"></i></span>
                <button
                  class="flow-node flow-node--curve is-active n0"
                  type="button"
                  data-flow="long"
                  data-index="0"
                  data-at="0"
                  style="left: 7.56%; top: 73.47%"
                >
                  <span class="flow-node__dot"><i class="ph ph-flag" aria-hidden="true"></i></span
                  ><span class="flow-node__name">预约期</span>
                </button>
                <button
                  class="flow-node flow-node--curve n1"
                  type="button"
                  data-flow="long"
                  data-index="1"
                  data-at="32"
                  style="left: 37.65%; top: 57.54%"
                >
                  <span class="flow-node__dot"><i class="ph ph-flask" aria-hidden="true"></i></span
                  ><span class="flow-node__name">测试期</span>
                </button>
                <button
                  class="flow-node flow-node--curve n2"
                  type="button"
                  data-flow="long"
                  data-index="2"
                  data-at="68"
                  style="left: 61.58%; top: 27.37%"
                >
                  <span class="flow-node__dot"><i class="ph ph-rocket" aria-hidden="true"></i></span
                  ><span class="flow-node__name">首发期</span>
                </button>
                <button
                  class="flow-node flow-node--curve n3"
                  type="button"
                  data-flow="long"
                  data-index="3"
                  data-at="100"
                  style="left: 90.38%; top: 19.06%"
                >
                  <span class="flow-node__dot"><i class="ph ph-pulse" aria-hidden="true"></i></span
                  ><span class="flow-node__name">运营期</span>
                </button>
              </div>
            </div>
          </div>

          <div class="rhythm-panel" id="rhythmQuick" hidden>
            <div class="flow">
              <div class="flow-dial">
                <svg viewBox="0 0 547 472" aria-hidden="true">
                  <circle class="vibe-ring" cx="267.881" cy="218.378" r="177.382"></circle>
                  <circle
                    class="vibe-ring-fill"
                    id="vibeFill"
                    cx="267.881"
                    cy="218.378"
                    r="177.382"
                    stroke-dasharray="0 1114.52"
                    stroke-dashoffset="278.63"
                  ></circle>
                  <path class="vibe-arrow" d="M174.9 66.6L168.3 81.3L158.9 68.4Z"></path>
                </svg>
                <span class="flow-dial__mark" aria-hidden="true"><i class="ph ph-game-controller"></i></span>
                <button
                  class="flow-node flow-node--label-n is-active"
                  type="button"
                  data-flow="quick"
                  data-index="0"
                  style="left: 48.97%; top: 8.69%"
                >
                  <span class="flow-node__dot"><i class="ph ph-lightbulb" aria-hidden="true"></i></span
                  ><span class="flow-node__name">一个想法 / 热梗</span>
                </button>
                <button
                  class="flow-node flow-node--label-e"
                  type="button"
                  data-flow="quick"
                  data-index="1"
                  style="left: 79.81%; top: 34.65%"
                >
                  <span class="flow-node__dot"><i class="ph ph-flask" aria-hidden="true"></i></span
                  ><span class="flow-node__name">快速小范围测试</span>
                </button>
                <button
                  class="flow-node flow-node--label-s"
                  type="button"
                  data-flow="quick"
                  data-index="2"
                  style="left: 68.03%; top: 76.67%"
                >
                  <span class="flow-node__dot"><i class="ph ph-rocket" aria-hidden="true"></i></span
                  ><span class="flow-node__name">上架游戏</span>
                </button>
                <button
                  class="flow-node flow-node--label-s"
                  type="button"
                  data-flow="quick"
                  data-index="3"
                  style="left: 29.91%; top: 76.67%"
                >
                  <span class="flow-node__dot"><i class="ph ph-chat-circle" aria-hidden="true"></i></span
                  ><span class="flow-node__name">收集反馈</span>
                </button>
                <button
                  class="flow-node flow-node--label-w"
                  type="button"
                  data-flow="quick"
                  data-index="4"
                  style="left: 18.13%; top: 34.65%"
                >
                  <span class="flow-node__dot"><i class="ph ph-arrows-clockwise" aria-hidden="true"></i></span
                  ><span class="flow-node__name">新一个作品</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="rhythm-board__side">
          <div class="rhythm-switch reveal" role="tablist" aria-label="发行节奏">
            <button class="is-active" type="button" role="tab" aria-selected="true" data-rhythm="long">长线运营</button>
            <button type="button" role="tab" aria-selected="false" data-rhythm="quick">做完就发</button>
          </div>
          <div class="rhythm-board__notes">
            <div id="longNoteWrap">
              <aside class="flow-note">
                <div class="flow-note__head">
                  <span class="flow-note__tag" id="longTag">第 1 / 4 步</span>
                  <h3 id="longTitle">预约期</h3>
                </div>
                <p id="longDesc">
                  研发阶段接入技术服务，提高研发效率。建立游戏预约页，实现早期宣发，积累关注预约。上线时平台通知推送激活预约玩家，完成高效转化。
                </p>
                <div class="flow-note__caps">
                  <span>使用的核心服务</span>
                  <div class="flow-note__list" id="longCaps">
                    <span>预约宣发页</span><span>预约里程碑</span><span>预约榜</span><span>官方消息推送</span
                    ><span>技术服务支持</span>
                  </div>
                </div>
              </aside>
            </div>
            <div id="quickNoteWrap" hidden>
              <aside class="flow-note">
                <div class="flow-note__head">
                  <span class="flow-note__tag" id="quickTag">第 1 / 5 步</span>
                  <h3 id="quickTitle">一个想法 / 热梗</h3>
                </div>
                <p id="quickDesc">一个热梗、一个玩法点子就能开工。做个 DEMO 就能扫码自测。</p>
                <div class="flow-note__caps">
                  <span>使用的核心服务</span>
                  <div class="flow-note__list" id="quickCaps">
                    <span>扫码自测</span><span>自动化测试</span><span>游戏服务</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
