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
  document.addEventListener("pointerover", (event) => {
    if (event.target.closest?.(interactiveSelector)) cursor.classList.add("is-hovering");
  }, { passive: true });
  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget || !event.relatedTarget.closest?.(interactiveSelector)) {
      cursor.classList.remove("is-hovering");
    }
  }, { passive: true });
});
