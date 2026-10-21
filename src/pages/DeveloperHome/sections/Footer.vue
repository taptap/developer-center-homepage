<script setup lang="ts">
import type { LINKS } from '@/config/links';

defineProps<{
  links: typeof LINKS;
  contactOpen: boolean;
  contactQr: string;
  year: number;
  toggleContact: () => void;
  onContactEnter: () => void;
  onContactLeave: () => void;
  setContactQr: (type: string) => void;
}>();
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <img decoding="async" src="@/assets/logo-taptap-light.svg" alt="TapTap 开发者中心" loading="lazy" />
        <span>© TapTap Developer Services</span>
      </div>
      <nav aria-label="页脚导航">
        <a :href="links.terms" target="_blank" rel="noopener noreferrer">服务协议</a>
        <a :href="links.privacy" target="_blank" rel="noopener noreferrer">隐私政策</a>
        <span
          class="footer__contact"
          :class="{ 'is-open': contactOpen }"
          @mouseenter="onContactEnter"
          @mouseleave="onContactLeave"
        >
          <button
            type="button"
            class="footer__contact-toggle"
            aria-controls="footerContactPanel"
            :aria-expanded="contactOpen ? 'true' : 'false'"
            @click.stop="toggleContact"
          >
            联系我们
          </button>
          <div
            v-show="contactOpen"
            id="footerContactPanel"
            class="footer__contact-panel"
            role="dialog"
            aria-label="联系或关注我们"
          >
            <div class="footer__contact-main">
              <h3>联系或关注我们</h3>
              <p>商务合作：<a :href="links.mailBusiness">cooperation@taptap.com</a></p>
              <p>运营邮箱：<a :href="links.mailOperation">operation@taptap.com</a></p>
              <div class="footer__social">
                <button
                  type="button"
                  class="footer__social-btn"
                  :class="{ 'is-active': contactQr === 'wx' }"
                  aria-label="微信公众号"
                  @mouseenter="setContactQr('wx')"
                  @focus="setContactQr('wx')"
                >
                  <img decoding="async" src="@/assets/footer/icon-wx.svg" alt="" loading="lazy" />
                </button>
                <button
                  type="button"
                  class="footer__social-btn"
                  :class="{ 'is-active': contactQr === 'ws' }"
                  aria-label="微信视频号"
                  @mouseenter="setContactQr('ws')"
                  @focus="setContactQr('ws')"
                >
                  <img decoding="async" src="@/assets/footer/icon-ws.svg" alt="" loading="lazy" />
                </button>
                <button
                  type="button"
                  class="footer__social-btn"
                  :class="{ 'is-active': contactQr === 'bili' }"
                  aria-label="B站官方号"
                  @mouseenter="setContactQr('bili')"
                  @focus="setContactQr('bili')"
                >
                  <img decoding="async" src="@/assets/footer/icon-bilibili.svg" alt="" loading="lazy" />
                </button>
                <button
                  type="button"
                  class="footer__social-btn"
                  :class="{ 'is-active': contactQr === 'qq' }"
                  aria-label="QQ 交流群"
                  @mouseenter="setContactQr('qq')"
                  @focus="setContactQr('qq')"
                >
                  <img decoding="async" src="@/assets/footer/icon-qq.svg" alt="" loading="lazy" />
                </button>
              </div>
            </div>
            <div class="footer__contact-preview">
              <img
                decoding="async"
                v-if="contactOpen && contactQr === 'wx'"
                src="@/assets/footer/qrcode-wx.jpg"
                alt=""
                loading="lazy"
              />
              <img
                decoding="async"
                v-if="contactOpen && contactQr === 'ws'"
                src="@/assets/footer/qrcode-ws.jpg"
                alt=""
                loading="lazy"
              />
              <img
                decoding="async"
                v-if="contactOpen && contactQr === 'bili'"
                src="@/assets/footer/qrcode-bilibili.png"
                alt=""
                loading="lazy"
              />
              <img
                decoding="async"
                v-if="contactOpen && contactQr === 'qq'"
                src="@/assets/footer/qrcode-qq.png"
                alt=""
                loading="lazy"
              />
              <span v-show="contactQr === 'wx'">关注微信公众号</span>
              <span v-show="contactQr === 'ws'">关注微信视频号</span>
              <span v-show="contactQr === 'bili'">关注B站官方号</span>
              <span v-show="contactQr === 'qq'">加入 QQ 交流群</span>
            </div>
          </div>
        </span>
        <a :href="links.docs" target="_blank" rel="noopener noreferrer">开发者文档</a>
      </nav>
    </div>
    <div class="footer__legal">
      <div class="footer__legal-row">
        <span>易玩（上海）网络科技有限公司</span>
        <span>公司地址：上海市静安区灵石路 718 号 B1 北楼</span>
        <span>注册地址：上海市闵行区紫星路 588 号 2 幢 2122 室</span>
        <span>©{{ year }} TapTap</span>
      </div>
      <div class="footer__legal-row">
        <a :href="links.icp" target="_blank" rel="noreferrer nofollow noopener">沪ICP备16012525号</a>
        <a :href="links.icpLicense" target="_blank" rel="noreferrer nofollow noopener">沪网文(2019)3544-255号</a>
        <a :href="links.icpLicense" target="_blank" rel="noreferrer nofollow noopener">经营许可证编号: 沪B2-20170322</a>
        <a :href="links.police" target="_blank" rel="noreferrer nofollow noopener"
          ><img
            decoding="async"
            class="footer__legal-icon"
            src="@/assets/footer/network_security@2x.png"
            alt=""
            loading="lazy"
          />沪公网安备 31010402003255 号</a
        >
        <a :href="links.antiSpam" target="_blank" rel="noreferrer nofollow noopener"
          ><img
            decoding="async"
            class="footer__legal-icon"
            src="@/assets/footer/internet_reporting@2x.png"
            alt=""
            loading="lazy"
          />上海互联网举报中心</a
        >
        <a :href="links.reportCenter" target="_blank" rel="noreferrer nofollow noopener"
          ><img
            decoding="async"
            class="footer__legal-icon"
            src="@/assets/footer/report_harmful_information@2x.png"
            alt=""
            loading="lazy"
          />网上有害信息举报专区</a
        >
      </div>
    </div>
  </footer>
</template>
