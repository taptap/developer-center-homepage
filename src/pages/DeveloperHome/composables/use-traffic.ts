import type { BehaviorContext } from './context';

export function useTraffic(ctx: BehaviorContext): void {
  const { root, reduceMotion, cleanups, listen } = ctx;
  function mountTrafficCarousel() {
    const visual = root.querySelector('#trafficVisual');
    if (!visual) return;
    const frame = visual.querySelector('.traffic-visual__frame') || visual;
    const slides = visual.querySelectorAll('img');
    if (slides.length < 2) return;
    const buttons = visual.querySelectorAll('.traffic-switch button');
    let index = 0;
    let timer;
    let busy = false;
    let failed = false;
    let trafficStarted = false;
    const intervalMs = 5000;
    const slideMs = 600;
    let awaitingSlide = false;
    let gestureType = null;
    let gestureStartX = 0;
    let gestureStartY = 0;
    let gestureActive = false;
    let dragTargetIndex: number | null = null;
    let dragWidth = 0;
    let dragDeltaX = 0;

    function mark(slide, shown) {
      if (shown) slide.classList.add('is-shown');
      else slide.classList.remove('is-shown');
      slide.classList.remove('is-leaving');
      if (shown) slide.removeAttribute('aria-hidden');
      else slide.setAttribute('aria-hidden', 'true');
    }

    function setSlideOffset(slide, offset) {
      const transform = 'translate3d(' + offset + 'px, 0, 0)';
      slide.style.webkitTransform = transform;
      slide.style.transform = transform;
    }

    function clearSlideOffsets() {
      Array.prototype.forEach.call(slides, function (slide) {
        slide.style.webkitTransform = '';
        slide.style.transform = '';
      });
    }

    function resetGesture() {
      gestureType = null;
      gestureActive = false;
      dragTargetIndex = null;
      dragWidth = 0;
      dragDeltaX = 0;
    }

    function syncSwitch(activeIndex) {
      Array.prototype.forEach.call(buttons, function (button, i) {
        const on = i === activeIndex;
        if (on) button.classList.add('is-active');
        else button.classList.remove('is-active');
        button.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    function arm(delay, fn) {
      window.clearTimeout(timer);
      if (failed) return;
      timer = window.setTimeout(fn, delay);
    }

    function ensureSlideSrc(slide) {
      if (!slide || slide.getAttribute('src')) return;
      // `data-src` holds the hashed URL; the slide stays unloaded until it is needed.
      const url = slide.getAttribute('data-src');
      if (url) slide.src = url;
    }

    function preloadSlides() {
      if (failed) return;
      Array.prototype.forEach.call(slides, ensureSlideSrc);
      Array.prototype.forEach.call(slides, function (slide) {
        if (!slide.getAttribute('src') || (slide.complete && !slide.naturalWidth)) failCarousel();
      });
    }

    function whenSlideReady(slide, done) {
      ensureSlideSrc(slide);
      if (failed || !slide || !slide.getAttribute('src')) {
        done(false);
        return;
      }
      if (slide.complete) {
        done(slide.naturalWidth > 0);
        return;
      }
      let settled = false;
      function finish(loaded) {
        if (settled) return;
        settled = true;
        slide.removeEventListener('load', onLoad);
        slide.removeEventListener('error', onError);
        done(loaded && slide.naturalWidth > 0);
      }
      function onLoad() {
        finish(true);
      }
      function onError() {
        finish(false);
      }
      slide.addEventListener('load', onLoad);
      slide.addEventListener('error', onError);
    }

    let pendingIndex = null;
    let trafficEpoch = 0;

    function failCarousel() {
      if (failed) return;
      failed = true;
      trafficStarted = false;
      awaitingSlide = false;
      trafficEpoch += 1;
      window.clearTimeout(timer);
      visual.classList.add('is-unavailable');
      visual.classList.remove('is-sliding');
      visual.classList.remove('is-dragging');
      Array.prototype.forEach.call(slides, function (slide, slideIndex) {
        mark(slide, slideIndex === index);
      });
      clearSlideOffsets();
      resetGesture();
      pendingIndex = null;
      busy = false;
      syncSwitch(index);
    }

    Array.prototype.forEach.call(slides, function (slide) {
      listen(slide, 'error', failCarousel);
    });

    function finishSlide() {
      let current;
      let next;
      if (!busy) return;
      visual.classList.remove('is-sliding');
      visual.classList.remove('is-dragging');
      if (pendingIndex === null) {
        clearSlideOffsets();
        busy = false;
        return;
      }
      current = slides[index];
      next = slides[pendingIndex];
      if (current) {
        current.classList.remove('is-leaving');
        current.classList.remove('is-shown');
        current.setAttribute('aria-hidden', 'true');
      }
      if (next) {
        next.classList.remove('is-leaving');
        next.classList.add('is-shown');
        next.removeAttribute('aria-hidden');
      }
      index = pendingIndex;
      pendingIndex = null;
      busy = false;
      syncSwitch(index);
      clearSlideOffsets();
    }

    function goTo(nextIndex) {
      let current;
      let next;
      let epoch;
      if (failed || busy || awaitingSlide || gestureActive || nextIndex === index) return;
      window.clearTimeout(timer);
      current = slides[index];
      next = slides[nextIndex];
      epoch = trafficEpoch;
      awaitingSlide = true;
      whenSlideReady(next, function (loaded) {
        if (epoch !== trafficEpoch || failed) return;
        awaitingSlide = false;
        if (!loaded) {
          failCarousel();
          return;
        }
        if (busy || index === nextIndex) return;
        syncSwitch(nextIndex);
        if (reduceMotion) {
          mark(current, false);
          mark(next, true);
          index = nextIndex;
          if (trafficStarted) arm(intervalMs, advance);
          return;
        }
        busy = true;
        pendingIndex = nextIndex;
        next.classList.remove('is-leaving');
        next.classList.remove('is-shown');
        visual.classList.add('is-sliding');
        visual.offsetWidth;
        current.classList.add('is-leaving');
        next.classList.add('is-shown');
        next.removeAttribute('aria-hidden');
        arm(slideMs, function () {
          finishSlide();
          if (trafficStarted) arm(intervalMs, advance);
        });
      });
    }

    function advance() {
      if (failed) return;
      goTo((index + 1) % slides.length);
    }

    Array.prototype.forEach.call(buttons, function (button) {
      listen(button, 'click', function () {
        if (failed) return;
        goTo(parseInt(button.getAttribute('data-slide'), 10));
      });
    });

    mark(slides[0], true);
    syncSwitch(0);

    let touchIdentifier = null;

    function resumeTraffic() {
      if (trafficStarted && !failed && !busy) arm(intervalMs, advance);
    }

    function beginGesture(type, clientX, clientY) {
      if (failed || busy || awaitingSlide || gestureType || gestureActive) return false;
      dragWidth = frame.clientWidth;
      if (!dragWidth) return false;
      gestureType = type;
      gestureStartX = clientX;
      gestureStartY = clientY;
      window.clearTimeout(timer);
      return true;
    }

    function updateGesture(deltaX, deltaY) {
      let direction;
      let offset;
      let next;
      if (!gestureType || failed) return false;
      if (!gestureActive) {
        if (Math.abs(deltaX) <= 8 || Math.abs(deltaX) <= Math.abs(deltaY)) return false;
        gestureActive = true;
      }
      direction = deltaX < 0 ? -1 : deltaX > 0 ? 1 : dragDeltaX < 0 ? -1 : 1;
      dragDeltaX = Math.max(-dragWidth, Math.min(dragWidth, deltaX));
      dragTargetIndex = (index + (direction < 0 ? 1 : slides.length - 1)) % slides.length;
      next = slides[dragTargetIndex];
      ensureSlideSrc(next);
      if (!next.getAttribute('src') || (next.complete && !next.naturalWidth)) {
        failCarousel();
        return false;
      }
      offset = dragDeltaX + (direction < 0 ? dragWidth : -dragWidth);
      visual.classList.add('is-dragging');
      setSlideOffset(slides[index], dragDeltaX);
      setSlideOffset(next, offset);
      return true;
    }

    function settleDrag(nextIndex) {
      const current = slides[index];
      const next = slides[nextIndex === null ? dragTargetIndex : nextIndex];
      const direction = dragDeltaX < 0 ? -1 : 1;
      const width = dragWidth;
      if (reduceMotion) {
        visual.classList.remove('is-dragging');
        clearSlideOffsets();
        if (nextIndex !== null) {
          mark(current, false);
          mark(next, true);
          index = nextIndex;
          syncSwitch(index);
        }
        resetGesture();
        resumeTraffic();
        return;
      }
      busy = true;
      pendingIndex = nextIndex;
      visual.classList.remove('is-dragging');
      visual.classList.add('is-sliding');
      visual.offsetWidth;
      if (nextIndex === null) {
        setSlideOffset(current, 0);
        setSlideOffset(next, direction < 0 ? width : -width);
      } else {
        setSlideOffset(current, direction * width);
        setSlideOffset(next, 0);
      }
      resetGesture();
      arm(slideMs, function () {
        finishSlide();
        if (trafficStarted) arm(intervalMs, advance);
      });
    }

    function endGesture(type, deltaX, deltaY) {
      let nextIndex;
      let epoch;
      if (gestureType !== type) return;
      gestureType = null;
      if (!gestureActive) {
        resetGesture();
        resumeTraffic();
        return;
      }
      if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) {
        settleDrag(null);
        return;
      }
      nextIndex = dragTargetIndex;
      epoch = trafficEpoch;
      awaitingSlide = true;
      whenSlideReady(slides[nextIndex], function (loaded) {
        if (epoch !== trafficEpoch || failed) return;
        awaitingSlide = false;
        if (!loaded) {
          failCarousel();
          return;
        }
        if (index === nextIndex) {
          settleDrag(null);
          return;
        }
        settleDrag(nextIndex);
      });
    }

    function cancelGesture(type) {
      if (gestureType !== type) return;
      gestureType = null;
      if (gestureActive) settleDrag(null);
      else {
        resetGesture();
        resumeTraffic();
      }
    }

    function findTouch(touches, identifier) {
      let i;
      for (i = 0; i < touches.length; i += 1) {
        if (touches[i].identifier === identifier) return touches[i];
      }
      return null;
    }

    listen(frame, 'dragstart', function (event) {
      event.preventDefault();
    });
    listen(frame, 'mousedown', function (event) {
      if (event.button === 0 && beginGesture('mouse', event.clientX, event.clientY)) event.preventDefault();
    });
    listen(window, 'mousemove', function (event) {
      if (gestureType !== 'mouse') return;
      event.preventDefault();
      updateGesture(event.clientX - gestureStartX, event.clientY - gestureStartY);
    });
    listen(window, 'mouseup', function (event) {
      endGesture('mouse', event.clientX - gestureStartX, event.clientY - gestureStartY);
    });
    listen(window, 'blur', function () {
      cancelGesture('mouse');
    });
    listen(
      frame,
      'touchstart',
      function (event) {
        let touch;
        if (failed) return;
        if (event.touches.length !== 1) {
          touchIdentifier = null;
          cancelGesture('touch');
          return;
        }
        touch = event.touches[0];
        if (!beginGesture('touch', touch.clientX, touch.clientY)) return;
        touchIdentifier = touch.identifier;
      },
      { passive: true },
    );
    listen(
      frame,
      'touchmove',
      function (event) {
        let touch;
        if (touchIdentifier === null) return;
        if (event.touches.length !== 1) {
          touchIdentifier = null;
          cancelGesture('touch');
          return;
        }
        touch = findTouch(event.touches, touchIdentifier);
        if (!touch) return;
        updateGesture(touch.clientX - gestureStartX, touch.clientY - gestureStartY);
        if (gestureActive && event.cancelable) event.preventDefault();
      },
      { passive: false },
    );
    listen(
      frame,
      'touchend',
      function (event) {
        let touch;
        if (touchIdentifier === null) return;
        touch = findTouch(event.changedTouches, touchIdentifier);
        if (!touch) return;
        touchIdentifier = null;
        if (event.touches.length) cancelGesture('touch');
        else endGesture('touch', touch.clientX - gestureStartX, touch.clientY - gestureStartY);
      },
      { passive: true },
    );
    listen(
      frame,
      'touchcancel',
      function () {
        if (touchIdentifier === null) return;
        touchIdentifier = null;
        cancelGesture('touch');
      },
      { passive: true },
    );

    function startTraffic() {
      if (failed || trafficStarted) return;
      trafficStarted = true;
      arm(intervalMs, advance);
    }
    function stopTraffic() {
      trafficStarted = false;
      trafficEpoch += 1;
      awaitingSlide = false;
      window.clearTimeout(timer);
      if (gestureType || gestureActive) {
        visual.classList.remove('is-dragging');
        clearSlideOffsets();
        resetGesture();
        touchIdentifier = null;
      }
      finishSlide();
    }
    const trafficSection = root.querySelector('#traffic');
    if (trafficSection && 'IntersectionObserver' in window) {
      const preloadObserver = new IntersectionObserver(
        function (entries) {
          if (entries[0] && entries[0].isIntersecting) preloadSlides();
        },
        { rootMargin: '640px 0px' },
      );
      const trafficObserver = new IntersectionObserver(
        function (entries) {
          if (entries[0] && entries[0].isIntersecting) startTraffic();
          else stopTraffic();
        },
        { rootMargin: '160px 0px' },
      );
      preloadObserver.observe(trafficSection);
      trafficObserver.observe(trafficSection);
      cleanups.push(function () {
        preloadObserver.disconnect();
        trafficObserver.disconnect();
        stopTraffic();
      });
    } else {
      preloadSlides();
      startTraffic();
      cleanups.push(stopTraffic);
    }
  }
  mountTrafficCarousel();
}
