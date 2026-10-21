<script setup lang="ts">
import type { LINKS } from '@/config/links';

defineProps<{
  links: typeof LINKS;
}>();
</script>

<template>
  <section class="section publish" id="publish">
    <div class="container publish-layout">
      <div class="publish-head">
        <header class="section-heading">
          <span class="section-kicker">SHIP WITH CONFIDENCE</span>
          <h2>上架，<span>就是这么简单</span></h2>
          <p>AI 代填资料，素材一键适配，智能助手助你轻松上架。</p>
        </header>
      </div>
      <div class="publish-chain publish-layout__toggle">
        <button class="publish-chain__toggle" type="button" aria-expanded="false" aria-controls="publishChainBody">
          <span class="publish-chain__mark" aria-hidden="true"><i class="ph ph-question"></i></span>
          <b>上架需要哪些环节</b>
          <i class="ph ph-caret-down publish-chain__arrow" aria-hidden="true"></i>
        </button>
      </div>
      <div class="publish-cards">
        <div class="publish-cards__slot publish-cards__slot--cli">
          <article class="ship-card ship-card--cli">
            <div class="ship-card__head">
              <span class="ship-card__icon" aria-hidden="true"><i class="ph-duotone ph-terminal-window"></i></span>
              <h3>交给 AI 助手</h3>
            </div>
            <p class="ship-card__intro">向 AI 描述你的上架需求，由它智能配置。</p>
            <div class="ship-card__tags">
              <span>高效便捷</span>
              <span>省力省心</span>
            </div>
            <div class="terminal-window">
              <div class="window-bar"><i></i><i></i><i></i><span>taptap-cli</span></div>
              <div class="terminal-body">
                <p><b>$</b> npx skills add taptap/cli</p>
                <p><b>$</b> taptap-cli app create --name "我的游戏"</p>
                <p><b>$</b> taptap-cli package upload ./build.pkg</p>
                <p class="terminal-success">✓ 已提交审核</p>
                <span class="terminal-caret" aria-hidden="true"></span>
              </div>
            </div>
            <ul class="check-list">
              <li>快速完成测试计划、新版本、资料编辑等运营配置</li>
              <li>根据你提供的资料智能补完素材物料</li>
            </ul>
            <a class="button button--solid" :href="links.cli" target="_blank" rel="noopener noreferrer"
              >查看 CLI 文档 <span class="ph ph-arrow-right" aria-hidden="true"></span
            ></a>
          </article>
        </div>
        <div class="publish-cards__or" aria-hidden="true">OR</div>
        <div class="publish-cards__slot publish-cards__slot--console">
          <article class="ship-card ship-card--console">
            <div class="ship-card__head">
              <span class="ship-card__icon" aria-hidden="true"><i class="ph-duotone ph-monitor"></i></span>
              <h3>控制台自主配置</h3>
            </div>
            <p class="ship-card__intro">在开发者后台手动发布，即开即用。</p>
            <div class="ship-card__tags">
              <span>传统方式</span>
              <span>稳定可控</span>
            </div>
            <div class="console-flow" aria-label="控制台上架步骤">
              <button class="console-flow__step is-active" type="button" aria-selected="true">
                <i>1</i><b>建游戏</b>
              </button>
              <button class="console-flow__step" type="button" aria-selected="false"><i>2</i><b>传包体</b></button>
              <button class="console-flow__step" type="button" aria-selected="false"><i>3</i><b>补资料</b></button>
              <button class="console-flow__step" type="button" aria-selected="false"><i>4</i><b>提审</b></button>
            </div>
            <ul class="check-list">
              <li>完整的发布向导，引导你逐步完成发布设置</li>
              <li>所有资料所见即所得，精准把控上架效果</li>
            </ul>
            <a class="button button--solid" :href="links.console"
              >进入控制台 <span class="ph ph-arrow-right" aria-hidden="true"></span
            ></a>
          </article>
        </div>
      </div>
      <div class="publish-chain__body publish-layout__flow" id="publishChainBody" hidden>
        <div class="chain-board">
          <div class="chain-steps-scroll">
            <div class="chain-steps" id="chainSteps" role="tablist" aria-label="上架环节" aria-orientation="horizontal">
              <span class="chain-steps__track" aria-hidden="true"></span>
              <span class="chain-steps__fill" id="chainStepsFill" aria-hidden="true"></span>
              <button
                class="chain-step is-active"
                type="button"
                role="tab"
                id="chainStep0"
                data-chain="0"
                aria-selected="true"
                aria-controls="chainDetail"
                tabindex="0"
              >
                <span class="chain-step__circle">
                  <i class="ph ph-file chain-step__icon" aria-hidden="true"></i>
                  <svg
                    class="chain-step__tick"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span class="chain-step__label">建游戏</span>
              </button>
              <button
                class="chain-step"
                type="button"
                role="tab"
                id="chainStep1"
                data-chain="1"
                aria-selected="false"
                aria-controls="chainDetail"
                tabindex="-1"
              >
                <span class="chain-step__circle">
                  <i class="ph ph-upload-simple chain-step__icon" aria-hidden="true"></i>
                  <svg
                    class="chain-step__tick"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span class="chain-step__label">传包体</span>
              </button>
              <button
                class="chain-step"
                type="button"
                role="tab"
                id="chainStep2"
                data-chain="2"
                aria-selected="false"
                aria-controls="chainDetail"
                tabindex="-1"
              >
                <span class="chain-step__circle">
                  <i class="ph ph-device-mobile chain-step__icon" aria-hidden="true"></i>
                  <svg
                    class="chain-step__tick"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span class="chain-step__label">自测</span>
              </button>
              <button
                class="chain-step"
                type="button"
                role="tab"
                id="chainStep3"
                data-chain="3"
                aria-selected="false"
                aria-controls="chainDetail"
                tabindex="-1"
              >
                <span class="chain-step__circle">
                  <i class="ph ph-image chain-step__icon" aria-hidden="true"></i>
                  <svg
                    class="chain-step__tick"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span class="chain-step__label">补资料</span>
              </button>
              <button
                class="chain-step"
                type="button"
                role="tab"
                id="chainStep4"
                data-chain="4"
                aria-selected="false"
                aria-controls="chainDetail"
                tabindex="-1"
              >
                <span class="chain-step__circle">
                  <i class="ph ph-users chain-step__icon" aria-hidden="true"></i>
                  <svg
                    class="chain-step__tick"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span class="chain-step__label">开测试</span>
              </button>
              <button
                class="chain-step"
                type="button"
                role="tab"
                id="chainStep5"
                data-chain="5"
                aria-selected="false"
                aria-controls="chainDetail"
                tabindex="-1"
              >
                <span class="chain-step__circle">
                  <i class="ph ph-flag chain-step__icon" aria-hidden="true"></i>
                  <svg
                    class="chain-step__tick"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span class="chain-step__label">正式上架</span>
              </button>
            </div>
          </div>
          <div class="chain-detail" id="chainDetail" role="tabpanel" aria-labelledby="chainStep0" aria-live="polite">
            <h3 id="chainTitle">建游戏</h3>
            <p id="chainLead">填写最小必填信息，创建游戏。</p>
            <p class="chain-detail__result" id="chainResult">做完是这样：控制台里能看到这个游戏，状态是草稿。</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
