(function () {
  'use strict';

  function initDetailEffects() {
    var body = document.body;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var progress = document.querySelector('[data-detail-progress]');
    var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-detail-reveal]'));

    body.classList.add('detail-booted');

    if (reduceMotion) {
      reveals.forEach(function (item) { item.classList.add('is-visible'); });
    } else if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      reveals.forEach(function (item) { revealObserver.observe(item); });
    } else {
      reveals.forEach(function (item) { item.classList.add('is-visible'); });
    }

    if (progress) {
      var progressFrame = 0;
      var updateProgress = function () {
        progressFrame = 0;
        var scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = 'scaleX(' + (scrollable > 0 ? window.scrollY / scrollable : 0) + ')';
      };
      window.addEventListener('scroll', function () {
        if (progressFrame) return;
        progressFrame = window.requestAnimationFrame(updateProgress);
      }, { passive: true });
      updateProgress();
    }

    if (!finePointer || reduceMotion) return;

    var spotlightTargets = Array.prototype.slice.call(document.querySelectorAll('.demo-window, .workflow-list article, .resource-item'));
    spotlightTargets.forEach(function (target) {
      var frame = 0;
      var pendingX = 50;
      var pendingY = 50;
      target.addEventListener('pointermove', function (event) {
        var rect = target.getBoundingClientRect();
        pendingX = ((event.clientX - rect.left) / rect.width) * 100;
        pendingY = ((event.clientY - rect.top) / rect.height) * 100;
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          frame = 0;
          target.style.setProperty('--spot-x', pendingX + '%');
          target.style.setProperty('--spot-y', pendingY + '%');
        });
      }, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDetailEffects, { once: true });
  } else {
    initDetailEffects();
  }
}());
