document.addEventListener("DOMContentLoaded", () => {
  const disclosure = document.querySelector("[data-project-disclosure]");
  if (!disclosure) return;

  const toggle = disclosure.querySelector("[data-project-disclosure-toggle]");
  const panel = disclosure.querySelector("[data-project-disclosure-panel]");
  const label = toggle?.querySelector(".projects-toggle-label");
  const meta = toggle?.querySelector(".projects-toggle-meta");
  if (!toggle || !panel || !label) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let revealFrame = 0;
  let revealFrameNext = 0;
  let closeTimer = 0;
  const closedMeta = meta?.textContent?.trim() || "";

  const cancelRevealFrames = () => {
    if (revealFrame) cancelAnimationFrame(revealFrame);
    if (revealFrameNext) cancelAnimationFrame(revealFrameNext);
    revealFrame = 0;
    revealFrameNext = 0;
  };

  const cancelCloseTimer = () => {
    if (closeTimer) window.clearTimeout(closeTimer);
    closeTimer = 0;
  };

  const playClickFeedback = (event) => {
    if (reduceMotion) return;
    const bounds = toggle.getBoundingClientRect();
    toggle.style.setProperty("--press-x", `${event.clientX - bounds.left}px`);
    toggle.style.setProperty("--press-y", `${event.clientY - bounds.top}px`);
    toggle.classList.remove("is-activating");
    // Restart the animation when the button is pressed repeatedly.
    void toggle.offsetWidth;
    toggle.classList.add("is-activating");
  };

  const setExpanded = (expanded) => {
    cancelRevealFrames();
    cancelCloseTimer();
    toggle.setAttribute("aria-expanded", String(expanded));

    if (!expanded) {
      window.dispatchEvent(new CustomEvent("project-disclosure:collapse"));
      if (panel.contains(document.activeElement)) toggle.focus();
      disclosure.classList.remove("is-open");
      panel.classList.add("is-closing");
      panel.querySelectorAll("[data-project-disclosure-row]").forEach((row) => {
        row.classList.remove("is-disclosure-visible");
        row.style.removeProperty("--disclosure-delay");
      });
      panel.setAttribute("inert", "");
      label.textContent = "View all projects";
      if (meta) meta.textContent = closedMeta;
      const finishClose = () => {
        panel.hidden = true;
        panel.classList.remove("is-closing");
        closeTimer = 0;
        window.ScrollTrigger?.refresh();
      };
      if (reduceMotion) finishClose();
      else closeTimer = window.setTimeout(finishClose, 420);
      return;
    }

    panel.hidden = false;
    panel.removeAttribute("inert");
    panel.classList.remove("is-closing");
    disclosure.classList.add("is-open");
    label.textContent = "Show fewer projects";
    if (meta) meta.textContent = "archive open";
    const rows = Array.from(panel.querySelectorAll("[data-project-disclosure-row]"));
    rows.forEach((row, index) => row.style.setProperty("--disclosure-delay", `${Math.min(index * 45, 135)}ms`));
    const reveal = () => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      rows.forEach((row) => row.classList.add("is-disclosure-visible"));
      window.ScrollTrigger?.refresh();
    };
    if (reduceMotion) {
      reveal();
      return;
    }

    revealFrame = requestAnimationFrame(() => {
      revealFrame = 0;
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      revealFrameNext = requestAnimationFrame(() => {
        revealFrameNext = 0;
        reveal();
      });
    });
  };

  toggle.addEventListener("animationend", (event) => {
    if (event.animationName === "projects-toggle-press") {
      toggle.classList.remove("is-activating");
    }
  });

  toggle.addEventListener("click", (event) => {
    playClickFeedback(event);
    setExpanded(toggle.getAttribute("aria-expanded") !== "true");
  });
});
