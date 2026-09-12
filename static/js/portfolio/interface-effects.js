document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const panel = document.querySelector("[data-tilt]");

  if (!finePointer || reduceMotion) return;

  const hero = document.querySelector(".hero");
  if (hero) {
    let heroFrame = 0;
    let heroBounds = hero.getBoundingClientRect();
    let heroX = heroBounds.width * .7;
    let heroY = heroBounds.height * .32;

    const renderHeroLight = () => {
      heroFrame = 0;
      hero.style.setProperty("--pointer-x", `${heroX}px`);
      hero.style.setProperty("--pointer-y", `${heroY}px`);
    };

    hero.addEventListener("pointerenter", () => {
      heroBounds = hero.getBoundingClientRect();
    });

    hero.addEventListener("pointermove", (event) => {
      heroX = event.clientX - heroBounds.left;
      heroY = event.clientY - heroBounds.top;
      if (!heroFrame) heroFrame = requestAnimationFrame(renderHeroLight);
    }, { passive: true });
  }

  document.querySelectorAll(".section-tag").forEach((tag) => {
    const original = tag.textContent.trim();
    const glyphs = "01<>/{}[]";
    let timer = 0;

    tag.setAttribute("aria-label", original);
    tag.addEventListener("pointerenter", () => {
      if (timer) return;
      let progress = 0;
      const tick = () => {
        const revealAt = Math.floor(progress / 2);
        tag.textContent = Array.from(original, (character, index) => {
          if (character === " ") return " ";
          if (index < revealAt) return character;
          return glyphs[(index + progress) % glyphs.length];
        }).join("");
        progress += 1;
        if (revealAt <= original.length) {
          timer = window.setTimeout(tick, 28);
        } else {
          tag.textContent = original;
          timer = 0;
        }
      };
      tick();
    });
  });

  if (!panel) return;

  let frameId = 0;
  let pointerX = 0;
  let pointerY = 0;
  let bounds = panel.getBoundingClientRect();

  const renderTilt = () => {
    frameId = 0;
    const x = (pointerX - bounds.left) / bounds.width - .5;
    const y = (pointerY - bounds.top) / bounds.height - .5;
    const rotateX = Math.max(-4, Math.min(4, y * -7));
    const rotateY = Math.max(-5, Math.min(5, x * 8));
    panel.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(0, -3px, 0)`;
  };

  panel.addEventListener("pointerenter", () => {
    bounds = panel.getBoundingClientRect();
    panel.style.transition = "transform .18s ease-out";
  });

  panel.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frameId) frameId = requestAnimationFrame(renderTilt);
  }, { passive: true });

  panel.addEventListener("pointerleave", () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    panel.style.transition = "transform .65s cubic-bezier(.16, .84, .44, 1)";
    panel.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
  });
});
