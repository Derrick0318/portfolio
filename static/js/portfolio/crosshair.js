document.addEventListener("DOMContentLoaded", () => {
  const crosshair = document.querySelector("[data-cs-crosshair]");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!crosshair || !finePointer) return;

  document.body.classList.add("cs-cursor-enabled");

  const interactiveSelector = "a, button, [role='button'], input, textarea, select, summary";

  const moveCrosshair = (event) => {
    crosshair.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  };

  document.addEventListener("pointermove", moveCrosshair, { passive: true });
  document.addEventListener("pointerover", (event) => {
    if (event.target.closest(interactiveSelector)) crosshair.classList.add("is-hovering");
  }, { passive: true });
  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget || !event.relatedTarget.closest?.(interactiveSelector)) {
      crosshair.classList.remove("is-hovering");
    }
  }, { passive: true });
});
