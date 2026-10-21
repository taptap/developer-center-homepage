<script setup lang="ts">
defineOptions({ name: 'Ways' });
</script>

<template>
  <section class="section ways" id="ways">
    <div class="ways__intro">
      <div class="ways__frame">
        <header class="section-heading section-heading--center reveal">
          <span class="section-kicker">BUILD ANYTHING</span>
          <h2>
            <span class="section-heading__title-line">无论什么游戏</span
            ><span class="section-heading__title-comma">，</span
            ><span class="section-heading__logo-line"
              >都能上<img
                decoding="async"
                class="section-wordmark"
                src="@/assets/logo-wordmark-blue.svg"
                alt="TapTap"
                loading="lazy"
            /></span>
          </h2>
          <p>支持主流引擎、多种包体格式，个人和企业都能发布游戏。</p>
        </header>

        <div class="engine-row reveal-group">
          <div class="engine-card reveal-item">
            <i class="frame-plus frame-plus--tr" aria-hidden="true"></i>
            <i class="frame-plus frame-plus--bl" aria-hidden="true"></i>
            <img decoding="async" class="engine-card__art" src="@/assets/engines/ai.svg" alt="" loading="lazy" />
            <strong>AI 生成</strong>
            <small>豆包 · DeepSeek · Codex · Cindy</small>
            <span class="engine-card__desc">用 AI 工具完成创作，通过 CLI 快速发布。</span>
          </div>
          <span class="engine-row__hatch" aria-hidden="true"></span>
          <div class="engine-card reveal-item">
            <i class="frame-plus frame-plus--tr" aria-hidden="true"></i>
            <i class="frame-plus frame-plus--bl" aria-hidden="true"></i>
            <img decoding="async" class="engine-card__art" src="@/assets/engines/engine.svg" alt="" loading="lazy" />
            <strong>游戏引擎</strong>
            <small>Unity · Cocos · UE5 · Godot</small>
            <span class="engine-card__desc">导出游戏包体，控制台里便捷上传管理。</span>
          </div>
          <span class="engine-row__hatch" aria-hidden="true"></span>
          <div class="engine-card reveal-item">
            <i class="frame-plus frame-plus--tr" aria-hidden="true"></i>
            <i class="frame-plus frame-plus--bl" aria-hidden="true"></i>
            <img decoding="async" class="engine-card__art" src="@/assets/engines/maker.svg" alt="" loading="lazy" />
            <strong>TapTap 制造</strong>
            <small>网页版 · 本地插件</small>
            <span class="engine-card__desc">在制造里完成作品，一键即可完成发布。</span>
          </div>
        </div>

        <div class="converge reveal" aria-hidden="true">
          <svg viewBox="0 0 1200 88" preserveAspectRatio="none">
            <path d="M195 0 C195 45 430 88 600 88"></path>
            <path d="M600 0 L600 88"></path>
            <path d="M1005 0 C1005 45 770 88 600 88"></path>
          </svg>
          <span></span>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="game-formats reveal-group" id="formatAccordion">
        <article class="format-panel format-panel--open reveal-item" data-format="web">
          <div class="format-panel__stage">
            <span class="format-panel__mark"
              ><span class="format-panel__mark-shape" aria-hidden="true"></span
              ><img decoding="async" src="@/assets/formats/web.png" alt="" loading="lazy"
            /></span>
            <button type="button" aria-expanded="true">
              <span class="format-panel__number">01</span><strong><span>网页</span><span>游戏</span></strong
              ><small>H5 / WEB</small>
            </button>
            <div class="format-panel__content">
              <span class="format-panel__tag">即点即玩</span>
              <small class="format-panel__platform">H5 / WEB</small>
              <h3>网页游戏</h3>
              <p>用更低的体验成本验证创意，通过社区反馈快速找到玩法方向与第一批核心玩家。</p>
              <ul>
                <li>链接与版本快速发布</li>
                <li>适合轻量玩法和活动内容</li>
              </ul>
            </div>
          </div>
        </article>
        <article class="format-panel reveal-item" data-format="pc">
          <div class="format-panel__stage">
            <span class="format-panel__mark"
              ><span class="format-panel__mark-shape" aria-hidden="true"></span
              ><img decoding="async" src="@/assets/formats/pc.png" alt="" loading="lazy"
            /></span>
            <button type="button" aria-expanded="false">
              <span class="format-panel__number">02</span><strong><span>PC</span><span>游戏</span></strong
              ><small>WINDOWS</small>
            </button>
            <div class="format-panel__content">
              <span class="format-panel__tag">多端分发</span><small class="format-panel__platform">WINDOWS</small>
              <h3>PC 游戏</h3>
              <p>上传 PC 客户端，配置版本与更新规则，让玩家在 TapTap 一站式发现、下载和更新。</p>
              <ul>
                <li>支持大包体与增量更新</li>
                <li>社区内容与商店页联动</li>
              </ul>
            </div>
          </div>
        </article>
        <article class="format-panel reveal-item" data-format="mobile">
          <div class="format-panel__stage">
            <span class="format-panel__mark"
              ><span class="format-panel__mark-shape" aria-hidden="true"></span
              ><img decoding="async" src="@/assets/formats/mobile.png" alt="" loading="lazy"
            /></span>
            <button type="button" aria-expanded="false">
              <span class="format-panel__number">03</span><strong><span>手机</span><span>游戏</span></strong
              ><small>ANDROID / IOS</small>
            </button>
            <div class="format-panel__content">
              <span class="format-panel__tag">覆盖最广</span><small class="format-panel__platform">ANDROID / IOS</small>
              <h3>手机游戏</h3>
              <p>支持测试招募、预约、安装包分发与更新唤起，覆盖从首测到长期运营的完整链路。</p>
              <ul>
                <li>包体与素材统一管理</li>
                <li>预约、测试、正式服灵活切换</li>
              </ul>
            </div>
          </div>
        </article>
        <article class="format-panel reveal-item" data-format="mini">
          <div class="format-panel__stage">
            <span class="format-panel__mark"
              ><span class="format-panel__mark-shape" aria-hidden="true"></span
              ><img decoding="async" src="@/assets/formats/mini.png" alt="" loading="lazy"
            /></span>
            <button type="button" aria-expanded="false">
              <span class="format-panel__number">04</span><strong><span>Tap</span><span>小游戏</span></strong
              ><small>MINI GAMES</small>
            </button>
            <div class="format-panel__content">
              <span class="format-panel__tag">快速验证</span><small class="format-panel__platform">MINI GAMES</small>
              <h3>Tap 小游戏</h3>
              <p>无需下载安装，玩家从内容与推荐场景直接进入游戏，缩短第一次体验的距离。</p>
              <ul>
                <li>快速触达兴趣用户</li>
                <li>数据与反馈集中查看</li>
              </ul>
            </div>
          </div>
        </article>
        <article class="format-panel reveal-item" data-format="maker">
          <div class="format-panel__stage">
            <span class="format-panel__mark"
              ><span class="format-panel__mark-shape" aria-hidden="true"></span
              ><img decoding="async" src="@/assets/formats/maker.png" alt="" loading="lazy"
            /></span>
            <button type="button" aria-expanded="false">
              <span class="format-panel__number">05</span><strong><span>TapTap</span><span>制造</span></strong
              ><small>GAME MAKER</small>
            </button>
            <div class="format-panel__content">
              <span class="format-panel__tag">创作直达</span><small class="format-panel__platform">GAME MAKER</small>
              <h3>TapTap 制造</h3>
              <p>创作、调试、分享与发布都在同一条路径内完成，让创意直接变成可玩的作品。</p>
              <ul>
                <li>无需配置复杂工程环境</li>
                <li>作品与账号自动关联</li>
              </ul>
            </div>
          </div>
        </article>
      </div>

      <div class="ways-promise reveal">
        <p>不同引擎、多种包体类型共享完整服务</p>
        <div class="ways-promise__checks">
          <span><i class="ph-fill ph-check-circle" aria-hidden="true"></i> 一键上架</span>
          <span><i class="ph-fill ph-check-circle" aria-hidden="true"></i> 生态能力开箱即用</span>
        </div>
      </div>
    </div>
  </section>
</template>
