document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = Boolean(window.gsap && window.ScrollTrigger);
  const { gsap, ScrollTrigger } = window;

  body.classList.add("motion-ready");
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  const setupNavigation = () => {
    const toggle = document.querySelector(".menu-toggle");
    const links = document.querySelector(".navlinks");
    const navLinks = document.querySelectorAll(".navlinks a[href^='#']");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        links.classList.toggle("is-open", open);
      });
      links.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
      }));
    }

    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-34% 0px -58% 0px", threshold: 0 });
    document.querySelectorAll("main section[id], body > section[id]").forEach((section) => observer.observe(section));
  };

  const setupHero = () => {
    const lines = gsap?.utils?.toArray(".hero-line") || Array.from(document.querySelectorAll(".hero-line"));
    lines.forEach((line) => {
      const words = line.textContent.trim().split(/\s+/);
      line.textContent = "";
      words.forEach((word) => {
        const span = document.createElement("span");
        span.className = "hero-word";
        span.textContent = `${word} `;
        line.appendChild(span);
      });
    });

    const words = document.querySelectorAll(".hero-word");
    if (!hasGsap || reduceMotion) {
      words.forEach((word) => { word.style.opacity = "1"; word.style.transform = "none"; });
      return;
    }

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".site-header", { y: -18, autoAlpha: 0, duration: .6 })
      .to(words, { y: 0, autoAlpha: 1, duration: .65, stagger: .055 }, "-=.2")
      .from(".hero-sub", { y: 16, autoAlpha: 0, duration: .55 }, "-=.22")
      .from(".hero-actions > *", { y: 14, autoAlpha: 0, duration: .45, stagger: .08 }, "-=.22");
  };

  const setupStatement = () => {
    const text = document.querySelector(".reveal-text");
    if (!text) return;
    const words = text.textContent.trim().split(/\s+/);
    text.textContent = "";
    words.forEach((word) => {
      const span = document.createElement("span");
      span.className = "rword";
      span.textContent = `${word} `;
      text.appendChild(span);
    });
    if (!hasGsap || reduceMotion) {
      text.querySelectorAll(".rword").forEach((word) => { word.style.opacity = "1"; });
      return;
    }
    gsap.to(text.querySelectorAll(".rword"), {
      opacity: 1,
      stagger: .055,
      ease: "none",
      scrollTrigger: { trigger: text, start: "top 86%", end: "bottom 42%", scrub: .8 }
    });
  };

  const setupScrollReveals = () => {
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!elements.length) return;
    if (reduceMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    document.body.classList.add("reveal-ready");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: .01 });
    elements.forEach((element) => observer.observe(element));
  };

  const setupProjects = () => {
    const rows = gsap?.utils?.toArray("[data-proj]") || Array.from(document.querySelectorAll("[data-proj]"));
    const preview = document.querySelector("#hover-preview");
    const previewImage = document.querySelector("#hp-image");
    const previewName = document.querySelector("#hp-name");

    if (hasGsap && !reduceMotion) {
      rows.forEach((row, index) => {
        gsap.fromTo(row,
          { autoAlpha: 0, x: -20 },
          { autoAlpha: 1, x: 0, duration: .72, ease: "power3.out", delay: index * .06,
            immediateRender: false,
            scrollTrigger: { trigger: row, start: "top 88%", once: true, invalidateOnRefresh: true } }
        );
      });
    } else {
      if (reduceMotion || !("IntersectionObserver" in window)) {
        rows.forEach((row) => row.classList.add("is-visible"));
      } else {
        document.body.classList.add("no-gsap");
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        }, { rootMargin: "0px 0px -12% 0px", threshold: .01 });
        rows.forEach((row) => observer.observe(row));
      }
    }

    if (!preview || !previewImage || !previewName || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let activeRow = null;

    const movePreview = (event) => {
      const gap = 24;
      const margin = 16;
      const width = preview.offsetWidth || 240;
      const height = preview.offsetHeight || 210;
      const fitsRight = event.clientX + gap + width <= window.innerWidth - margin;
      const fitsBelow = event.clientY + gap + height <= window.innerHeight - margin;
      const targetX = fitsRight ? event.clientX + gap : event.clientX - width - gap;
      const targetY = fitsBelow ? event.clientY + gap : event.clientY - height - gap;
      const maxX = Math.max(margin, window.innerWidth - width - margin);
      const maxY = Math.max(margin, window.innerHeight - height - margin);
      const x = Math.min(Math.max(targetX, margin), maxX);
      const y = Math.min(Math.max(targetY, margin), maxY);
      const rotation = preview.dataset.rotation || -3;
      preview.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(1)`;
    };

    const hidePreview = () => {
      activeRow = null;
      preview.classList.remove("is-visible");
      preview.style.opacity = "0";
      preview.style.transform = "translate3d(-999px, -999px, 0) rotate(-3deg) scale(.88)";
    };

    rows.forEach((row, index) => {
      row.addEventListener("pointerenter", (event) => {
        activeRow = row;
        previewImage.src = row.dataset.image;
        previewImage.alt = `${row.dataset.title} project preview`;
        previewName.textContent = row.dataset.title;
        const rotation = index % 2 ? 3 : -3;
        preview.dataset.rotation = rotation;
        movePreview(event);
        preview.style.opacity = "1";
        preview.classList.add("is-visible");
      });
      row.addEventListener("pointermove", (event) => {
        if (activeRow !== row) return;
        movePreview(event);
      });
      row.addEventListener("pointerleave", hidePreview);
      row.addEventListener("pointercancel", hidePreview);
      row.addEventListener("click", hidePreview);
    });

    window.addEventListener("scroll", hidePreview, { passive: true });
    window.addEventListener("resize", hidePreview, { passive: true });
    window.addEventListener("blur", hidePreview);
    document.addEventListener("visibilitychange", hidePreview);
  };

  const setupTimeline = () => {
    const timeline = document.querySelector("#timeline");
    const items = gsap?.utils?.toArray("[data-tl]") || Array.from(document.querySelectorAll("[data-tl]"));
    const fill = document.querySelector(".timeline-fill");
    if (!timeline || !hasGsap || reduceMotion) {
      items.forEach((item) => item.classList.add("in"));
      return;
    }
    gsap.to(fill, {
      height: "100%",
      ease: "none",
      scrollTrigger: { trigger: timeline, start: "top 76%", end: "bottom 48%", scrub: .7 }
    });
    gsap.from(items, {
      x: -24,
      autoAlpha: 0,
      duration: .65,
      stagger: .16,
      ease: "power3.out",
      scrollTrigger: { trigger: timeline, start: "top 82%", toggleActions: "play none none reverse" },
      onStart: function () { this.targets().forEach((item) => item.classList.add("in")); }
    });
  };

  const setupToolbox = () => {
    const toolbox = document.querySelector("#toolbox");
    if (!toolbox) return;
    const chips = Array.from(toolbox.querySelectorAll("[data-chip]"));
    chips.forEach((chip) => {
      const state = {
        pointerId: null,
        startPointerX: 0,
        startPointerY: 0,
        startX: 0,
        startY: 0,
        x: 0,
        y: 0
      };
      const clamp = (min, max, value) => Math.min(Math.max(value, min), Math.max(min, max));
      const render = () => {
        chip.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
      };
      const move = (event) => {
        if (event.pointerId !== state.pointerId) return;
        const bounds = toolbox.getBoundingClientRect();
        const baseX = chip.offsetLeft;
        const baseY = chip.offsetTop;
        const maxX = bounds.width - chip.offsetWidth - 8;
        const maxY = bounds.height - chip.offsetHeight - 8;
        const nextX = clamp(8, maxX, state.startX + event.clientX - state.startPointerX);
        const nextY = clamp(8, maxY, state.startY + event.clientY - state.startPointerY);
        state.x = nextX - baseX;
        state.y = nextY - baseY;
        render();
      };
      const stop = (event) => {
        if (event.pointerId !== state.pointerId) return;
        state.pointerId = null;
        chip.classList.remove("is-dragging");
        chip.setAttribute("aria-grabbed", "false");
        chip.releasePointerCapture?.(event.pointerId);
        chip.removeEventListener("pointermove", move);
        chip.removeEventListener("pointerup", stop);
        chip.removeEventListener("pointercancel", stop);
      };
      chip.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        state.pointerId = event.pointerId;
        state.startPointerX = event.clientX;
        state.startPointerY = event.clientY;
        state.startX = chip.offsetLeft + state.x;
        state.startY = chip.offsetTop + state.y;
        chip.classList.add("is-dragging");
        chip.setAttribute("aria-grabbed", "true");
        render();
        chip.setPointerCapture?.(event.pointerId);
        chip.addEventListener("pointermove", move);
        chip.addEventListener("pointerup", stop);
        chip.addEventListener("pointercancel", stop);
      });
    });
  };

  const setupCounters = () => {
    if (!hasGsap || reduceMotion) return;
    gsap.utils.toArray(".count").forEach((element) => {
      const value = { current: 0 };
      const target = Number(element.dataset.target || 0);
      gsap.to(value, {
        current: target,
        duration: 1.1,
        ease: "power2.out",
        snap: { current: 1 },
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
        onUpdate: () => { element.textContent = String(value.current); }
      });
    });
  };

  setupNavigation();
  setupHero();
  setupStatement();
  setupScrollReveals();
  setupProjects();
  setupTimeline();
  setupToolbox();
  setupCounters();

  if (hasGsap && !reduceMotion) {
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }
});
