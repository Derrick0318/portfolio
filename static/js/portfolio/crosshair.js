document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector("[data-dev-cursor]");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!cursor || !finePointer) return;

  document.body.classList.add("dev-cursor-enabled");

  const interactiveSelector = "a, button, [role='button'], input, textarea, select, summary";
  let frameId = 0;
  let pointerX = -100;
  let pointerY = -100;

  const renderCursor = () => {
    frameId = 0;
    cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
  };

  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frameId) frameId = requestAnimationFrame(renderCursor);
  }, { passive: true });
  // Clicking releases a small burst of code glyphs from the cursor.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const glyphs = ["0", "1", "{", "}", "<", ">", "/", ";", "*"];
  let liveBursts = 0;
  document.addEventListener("pointerdown", (event) => {
    cursor.classList.add("is-pressing");
    if (reduceMotion || liveBursts > 3 || event.button !== 0) return;
    if (event.target.closest?.("[data-chip], .window-viewport, input, textarea, select")) return;
    liveBursts += 1;
    const count = 6;
    const offset = Math.random() * Math.PI;
    for (let index = 0; index < count; index += 1) {
      const glyph = document.createElement("span");
      glyph.className = "dev-burst";
      glyph.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      document.body.appendChild(glyph);
      const angle = offset + (index / count) * Math.PI * 2;
      const distance = 20 + Math.random() * 18;
      const from = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      const to = `translate3d(${event.clientX + Math.cos(angle) * distance}px, ${event.clientY + Math.sin(angle) * distance}px, 0) translate(-50%, -50%) scale(.6)`;
      const animation = glyph.animate([{ transform: from, opacity: 1 }, { transform: to, opacity: 0 }], { duration: 520 + Math.random() * 120, easing: "cubic-bezier(.16, .84, .44, 1)" });
      animation.onfinish = () => {
        glyph.remove();
        if (index === count - 1) liveBursts -= 1;
      };
    }
  }, { passive: true });
  document.addEventListener("pointerup", () => cursor.classList.remove("is-pressing"), { passive: true });

  document.addEventListener("pointerover", (event) => {
    if (event.target.closest?.(interactiveSelector)) cursor.classList.add("is-hovering");
  }, { passive: true });
  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget || !event.relatedTarget.closest?.(interactiveSelector)) {
      cursor.classList.remove("is-hovering");
    }
  }, { passive: true });
});
