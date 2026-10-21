<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { fetchMe } from '@/api/me';
import { LINKS } from '@/config/links';
import { trackPageView } from '@/track/page-view';
import { usePageBehavior } from './composables';
import Cases from './sections/Cases.vue';
import Community from './sections/Community.vue';
import Ecosystem from './sections/Ecosystem.vue';
import Footer from './sections/Footer.vue';
import Hero from './sections/Hero.vue';
import Join from './sections/Join.vue';
import Publish from './sections/Publish.vue';
import Rhythm from './sections/Rhythm.vue';
import SectionNav from './sections/SectionNav.vue';
import TopBar from './sections/TopBar.vue';
import Traffic from './sections/Traffic.vue';
import Ways from './sections/Ways.vue';

/**
 * This page takes no part in app routing: every link is a full page navigation to a
 * build-time constant (see `src/config/links.ts`).
 */
defineOptions({ name: 'DeveloperHome' });

const links = LINKS;
const rootRef = ref<HTMLElement | null>(null);
const year = new Date().getFullYear();

// --- signed-in header -------------------------------------------------------
const loggedIn = ref(false);
const userAvatar = ref('');
const userName = ref('');
const userInitial = computed(function () {
  const name = userName.value || '';
  return name ? String(name).charAt(0) : '';
});

function loadCurrentUser() {
  if (window.__PRERENDER_INJECTED) return;
  // `fetchMe` resolves to null on every failure, so there is no rejection to handle here.
  void fetchMe().then(function (data) {
    const menu = data && data.menu;
    const user = data && data.user;
    if (!menu || !menu.length || !user) return;
    loggedIn.value = true;
    userAvatar.value = user.avatar || '';
    userName.value = user.name || '';
  });
}

// --- footer contact panel ---------------------------------------------------
const contactOpen = ref(false);
const contactQr = ref('wx');
const hoverContactQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

function placeContactPanel() {
  const root = rootRef.value;
  if (!root || !contactOpen.value) return;
  const panel = root.querySelector<HTMLElement>('.footer__contact-panel');
  const anchor = root.querySelector<HTMLElement>('.footer__contact');
  if (!panel || !anchor) return;
  const anchorBox = anchor.getBoundingClientRect();
  const width = panel.offsetWidth;
  if (!width) return;
  const anchorCenter = anchorBox.left + anchorBox.width / 2;
  let desiredLeft = anchorCenter - width / 2;
  const maxLeft = window.innerWidth - width - 16;
  if (desiredLeft > maxLeft) desiredLeft = maxLeft;
  if (desiredLeft < 16) desiredLeft = 16;
  const offset = desiredLeft - anchorCenter;
  panel.style.webkitTransform = 'translateX(' + offset + 'px)';
  panel.style.transform = 'translateX(' + offset + 'px)';
}

function openContact() {
  const wasOpen = contactOpen.value;
  contactOpen.value = true;
  if (!wasOpen) {
    contactQr.value = 'wx';
    nextTick(placeContactPanel);
  }
}

function closeContact() {
  contactOpen.value = false;
}

function onContactEnter() {
  if (!hoverContactQuery.matches) return;
  openContact();
}

function onContactLeave() {
  if (!hoverContactQuery.matches) return;
  closeContact();
}

/**
 * A real toggle: hover is only a shortcut for pointer devices, so keyboard activation
 * (Enter/Space fire a `click` with no hover) has to work on hover-capable screens too.
 */
function toggleContact() {
  if (contactOpen.value) {
    closeContact();
    return;
  }
  openContact();
}

function setContactQr(type: string) {
  contactQr.value = type;
}

function onDocumentClick(event: MouseEvent) {
  let node = event.target as Node | null;
  if (node && node.nodeType !== 1) node = (node as Node).parentElement;
  const root = rootRef.value;
  const wrap = root ? root.querySelector('.footer__contact') : null;
  if (wrap && node && wrap.contains(node)) return;
  contactOpen.value = false;
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' && event.keyCode !== 27) return;
  contactOpen.value = false;
}

// --- lifecycle --------------------------------------------------------------
onMounted(function () {
  loadCurrentUser();
  trackPageView(document.title);
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onDocumentKeydown);
  window.addEventListener('resize', placeContactPanel);
});

onBeforeUnmount(function () {
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keydown', onDocumentKeydown);
  window.removeEventListener('resize', placeContactPanel);
});

usePageBehavior(rootRef);
</script>

<template>
  <div ref="rootRef">
    <a class="skip-link" href="#main">跳到主要内容</a>

    <TopBar
      :links="links"
      :loggedIn="loggedIn"
      :userAvatar="userAvatar"
      :userName="userName"
      :userInitial="userInitial"
    />

    <main id="main" tabindex="-1">
      <Hero :links="links" />

      <SectionNav />

      <Ways />

      <Publish :links="links" />

      <Ecosystem />

      <Rhythm />

      <Traffic :links="links" />

      <Cases />

      <Community :links="links" />

      <Join :links="links" />
    </main>

    <Footer
      :links="links"
      :contactOpen="contactOpen"
      :contactQr="contactQr"
      :year="year"
      :toggleContact="toggleContact"
      :onContactEnter="onContactEnter"
      :onContactLeave="onContactLeave"
      :setContactQr="setContactQr"
    />
  </div>
</template>

<style src="@/assets/phosphor/icons.css"></style>
<style src="./styles/base.css"></style>
<style src="./styles/tokens.css"></style>
<style src="./styles.css"></style>
