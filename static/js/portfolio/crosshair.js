document.addEventListener("DOMContentLoaded", () => {
  const crosshair = document.querySelector("[data-cs-crosshair]");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!crosshair || !finePointer) return;

  document.body.classList.add("cs-cursor-enabled");

  const interactiveSelector = "a, button, [role='button'], input, textarea, select, summary";
  let frameId = 0;
  let pointerX = -100;
  let pointerY = -100;

  const renderCrosshair = () => {
    frameId = 0;
    crosshair.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
  };

  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frameId) frameId = requestAnimationFrame(renderCrosshair);
  }, { passive: true });
  document.addEventListener("pointerover", (event) => {
    if (event.target.closest(interactiveSelector)) crosshair.classList.add("is-hovering");
  }, { passive: true });
  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget || !event.relatedTarget.closest?.(interactiveSelector)) {
      crosshair.classList.remove("is-hovering");
    }
  }, { passive: true });
});
