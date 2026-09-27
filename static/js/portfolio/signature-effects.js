document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasObserver = "IntersectionObserver" in window;

  const whenVisible = (element, callback, rootMargin = "0px 0px -12% 0px") => {
    if (!element) return;
    if (!hasObserver) { callback(); return; }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      callback();
    }, { rootMargin, threshold: .01 });
    observer.observe(element);
  };

  // Types text into an element character by character.
  const typeInto = (element, text, speed = 32) => new Promise((resolve) => {
    let index = 0;
    const tick = () => {
      element.textContent = text.slice(0, index);
      index += 1;
      if (index <= text.length) window.setTimeout(tick, speed);
      else resolve();
    };
    tick();
  });

  const setupMagnetic = () => {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll("[data-magnetic]").forEach((element) => {
      let frame = 0;
      let bounds = null;
      let pointerX = 0;
      let pointerY = 0;
      const render = () => {
        frame = 0;
        if (!bounds) return;
        const x = (pointerX - (bounds.left + bounds.width / 2)) * .22;
        const y = (pointerY - (bounds.top + bounds.height / 2)) * .3;
        element.style.translate = `${Math.max(-9, Math.min(9, x))}px ${Math.max(-6, Math.min(6, y))}px`;
      };
      element.addEventListener("pointerenter", () => {
        bounds = element.getBoundingClientRect();
        element.classList.add("is-magnetized");
      });
      element.addEventListener("pointermove", (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!frame) frame = requestAnimationFrame(render);
      }, { passive: true });
      element.addEventListener("pointerleave", () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        bounds = null;
        element.classList.remove("is-magnetized");
        element.style.translate = "0px 0px";
      });
    });
  };

  // One pointer listener per group lights the borders of every nearby card, not only the hovered one.
  const setupGlowGroups = () => {
    if (!finePointer || reduceMotion) return;
    const groups = [
      [document.querySelector(".stats"), ".stat"],
      [document.querySelector("#timeline"), ".tl-copy"],
      [document.querySelector(".work-experience-block"), ".work-experience-card"]
    ];
    groups.forEach(([group, selector]) => {
      if (!group) return;
      const cards = Array.from(group.querySelectorAll(selector));
      if (!cards.length) return;
      group.classList.add("glow-group");
      cards.forEach((card) => card.classList.add("glow-card"));
      let rects = [];
      let stale = true;
      let frame = 0;
      let pointerX = 0;
      let pointerY = 0;
      const markStale = () => { stale = true; };
      const render = () => {
        frame = 0;
        if (stale) {
          rects = cards.map((card) => card.getBoundingClientRect());
          stale = false;
        }
        cards.forEach((card, index) => {
          card.style.setProperty("--glow-x", `${pointerX - rects[index].left}px`);
          card.style.setProperty("--glow-y", `${pointerY - rects[index].top}px`);
        });
      };
      group.addEventListener("pointerenter", () => {
        stale = true;
        group.classList.add("is-glowing");
        window.addEventListener("scroll", markStale, { passive: true });
      });
      group.addEventListener("pointermove", (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!frame) frame = requestAnimationFrame(render);
      }, { passive: true });
      group.addEventListener("pointerleave", () => {
        group.classList.remove("is-glowing");
        window.removeEventListener("scroll", markStale);
      });
    });
  };

  // The console status line cycles through build states while the hero is on screen.
  const setupConsoleStatus = () => {
    const status = document.querySelector("[data-console-status]");
    const hero = document.querySelector(".hero");
    if (!status || !hero || reduceMotion) return;
    const messages = ["Build completed", "Tests passing", "Ready for review"];
    let index = 0;
    let running = false;
    let heroVisible = true;
    let timer = 0;

    const erase = () => new Promise((resolve) => {
      const tick = () => {
        status.textContent = status.textContent.slice(0, -1);
        if (status.textContent.length) window.setTimeout(tick, 22);
        else resolve();
      };
      tick();
    });
    const cycle = async () => {
      if (!heroVisible || document.hidden) { running = false; return; }
      running = true;
      index = (index + 1) % messages.length;
      await erase();
      await typeInto(status, messages[index], 45);
      timer = window.setTimeout(cycle, 3200);
    };
    const resume = () => {
      if (running || !heroVisible || document.hidden) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(cycle, 2600);
      running = true;
    };

    if (hasObserver) {
      new IntersectionObserver((entries) => {
        heroVisible = entries.some((entry) => entry.isIntersecting);
        if (heroVisible) resume();
      }).observe(hero);
    }
    document.addEventListener("visibilitychange", resume);
    window.setTimeout(resume, 1200);
  };

  const setupContactTyping = () => {
    const terminal = document.querySelector(".contact-terminal");
    const link = terminal?.querySelector("a");
    if (!link || reduceMotion) return;
    const text = link.textContent.trim();
    link.setAttribute("aria-label", text);
    whenVisible(terminal, async () => {
      link.classList.add("is-typing");
      link.textContent = "";
      await new Promise((resolve) => window.setTimeout(resolve, 260));
      await typeInto(link, text, 30);
      link.classList.remove("is-typing");
    });
  };

  // Section file names decode themselves once as they scroll into view.
  const setupTagDecode = () => {
    if (reduceMotion) return;
    const glyphs = "01<>/{}[]";
    document.querySelectorAll(".section-tag").forEach((tag) => {
      whenVisible(tag, () => {
        const original = tag.getAttribute("aria-label") || tag.textContent.trim();
        tag.setAttribute("aria-label", original);
        let progress = 0;
        const tick = () => {
          const revealAt = Math.floor(progress / 2);
          tag.textContent = Array.from(original, (character, index) => {
            if (character === " " || index < revealAt) return character;
            return glyphs[(index + progress) % glyphs.length];
          }).join("");
          progress += 1;
          if (revealAt <= original.length) window.setTimeout(tick, 30);
          else tag.textContent = original;
        };
        window.setTimeout(tick, 120);
      });
    });
  };

  setupMagnetic();
  setupGlowGroups();
  setupConsoleStatus();
  setupContactTyping();
  setupTagDecode();
});
