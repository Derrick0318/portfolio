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
    const codeLines = document.querySelectorAll(".code-lines li");
    if (!hasGsap || reduceMotion) {
      words.forEach((word) => { word.style.opacity = "1"; word.style.transform = "none"; });
      codeLines.forEach((line) => { line.style.opacity = "1"; line.style.transform = "none"; });
      return;
    }

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".site-header", { y: -18, autoAlpha: 0, duration: .6 })
      .from(".hero-kicker", { y: 12, autoAlpha: 0, duration: .45 }, "-=.2")
      .to(words, { y: 0, autoAlpha: 1, duration: .68, stagger: .05 }, "-=.18")
      .from(".hero-sub", { y: 16, autoAlpha: 0, duration: .55 }, "-=.28")
      .from(".hero-actions > *", { y: 14, autoAlpha: 0, duration: .45, stagger: .08 }, "-=.24")
      .from(".hero-metric", { y: 12, autoAlpha: 0, duration: .42, stagger: .07 }, "-=.22")
      .from(".hero-console", { x: 42, y: 18, rotation: 2.2, scale: .97, autoAlpha: 0, duration: .9 }, "-=1.15")
      .to(codeLines, { x: 0, autoAlpha: 1, duration: .32, stagger: .055, ease: "power2.out" }, "-=.58")
      .from(".console-output", { y: 8, autoAlpha: 0, duration: .4 }, "-=.18");
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

    const revealTargets = new Map();
    elements.forEach((element) => {
      const target = element.classList.contains("motion-heading") ? element.parentElement : element;
      if (!target) return;
      const groupedElements = revealTargets.get(target) || [];
      groupedElements.push(element);
      revealTargets.set(target, groupedElements);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (revealTargets.get(entry.target) || []).forEach((element) => element.classList.add("is-visible"));
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: .01 });
    revealTargets.forEach((_, target) => observer.observe(target));
  };

  const setupProjects = () => {
    const rows = gsap?.utils?.toArray("[data-proj]") || Array.from(document.querySelectorAll("[data-proj]"));
    const entranceRows = rows.filter((row) => !row.hasAttribute("data-project-disclosure-row"));
    const preview = document.querySelector("#hover-preview");
    const previewImage = document.querySelector("#hp-image");
    const previewName = document.querySelector("#hp-name");

    if (hasGsap && !reduceMotion) {
      entranceRows.forEach((row, index) => {
        gsap.fromTo(row,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: .72, ease: "power3.out", delay: index * .06,
            immediateRender: false,
            scrollTrigger: { trigger: row, start: "top 88%", once: true, invalidateOnRefresh: true } }
        );
      });
    } else {
      if (reduceMotion || !("IntersectionObserver" in window)) {
        entranceRows.forEach((row) => row.classList.add("is-visible"));
      } else {
        document.body.classList.add("no-gsap");
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        }, { rootMargin: "0px 0px -12% 0px", threshold: .01 });
        entranceRows.forEach((row) => observer.observe(row));
      }
    }

    let activeRow = null;
    let pointerX = 0;
    let pointerY = 0;
    let previewWidth = 240;
    let previewHeight = 210;
    let frameId = 0;
    let activeImage = null;
    let activeRowBounds = null;

    const measurePreview = () => {
      previewWidth = preview.offsetWidth || 240;
      previewHeight = preview.offsetHeight || 210;
    };

    const renderPreview = () => {
      frameId = 0;
      if (!activeRow) return;
      const rowBounds = activeRowBounds;
      if (!rowBounds) return;
      const localX = pointerX - rowBounds.left;
      const localY = pointerY - rowBounds.top;
      activeRow.style.setProperty("--spot-x", `${localX}px`);
      activeRow.style.setProperty("--spot-y", `${localY}px`);
      if (activeImage) {
        const depthX = Math.max(-5, Math.min(5, (localX / rowBounds.width - .5) * 10));
        const depthY = Math.max(-4, Math.min(4, (localY / rowBounds.height - .5) * 8));
        activeImage.style.setProperty("--image-x", `${depthX}px`);
        activeImage.style.setProperty("--image-y", `${depthY}px`);
      }
      const gap = 24;
      const margin = 16;
      const fitsRight = pointerX + gap + previewWidth <= window.innerWidth - margin;
      const fitsBelow = pointerY + gap + previewHeight <= window.innerHeight - margin;
      const targetX = fitsRight ? pointerX + gap : pointerX - previewWidth - gap;
      const targetY = fitsBelow ? pointerY + gap : pointerY - previewHeight - gap;
      const maxX = Math.max(margin, window.innerWidth - previewWidth - margin);
      const maxY = Math.max(margin, window.innerHeight - previewHeight - margin);
      const x = Math.min(Math.max(targetX, margin), maxX);
      const y = Math.min(Math.max(targetY, margin), maxY);
      const rotation = preview.dataset.rotation || -3;
      preview.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
    };

    const previewScan = preview?.querySelector(".hp-scan");
    const playInspectorScan = () => {
      if (reduceMotion || !previewImage.animate) return;
      const top = previewImage.offsetTop;
      const height = previewImage.offsetHeight;
      previewImage.animate(
        [{ clipPath: "inset(0 0 100% 0)", filter: "brightness(1.5) saturate(.2)" }, { clipPath: "inset(0 0 0% 0)", filter: "none" }],
        { duration: 320, easing: "cubic-bezier(.16, .84, .44, 1)" }
      );
      previewScan?.animate(
        [{ transform: `translateY(${top}px)`, opacity: 1 }, { transform: `translateY(${top + height}px)`, opacity: 0 }],
        { duration: 340, easing: "cubic-bezier(.16, .84, .44, 1)" }
      );
    };

    const movePreview = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frameId) frameId = requestAnimationFrame(renderPreview);
    };

    const hidePreview = () => {
      if (activeRow) activeRow.style.setProperty("--spot-x", "50%");
      if (activeRow) activeRow.style.setProperty("--spot-y", "50%");
      activeImage?.style.setProperty("--image-x", "0px");
      activeImage?.style.setProperty("--image-y", "0px");
      activeRow = null;
      activeImage = null;
      activeRowBounds = null;
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      if (!preview) return;
      preview.classList.remove("is-visible");
      preview.style.opacity = "0";
      preview.style.transform = "translate3d(-999px, -999px, 0) rotate(-3deg) scale(.88)";
    };

    window.addEventListener("project-disclosure:collapse", hidePreview);

    if (!preview || !previewImage || !previewName || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    rows.forEach((row, index) => {
      row.addEventListener("pointerenter", (event) => {
        activeRow = row;
        activeImage = row.querySelector(".proj-thumb img");
        activeRowBounds = row.getBoundingClientRect();
        previewImage.src = row.dataset.image;
        previewImage.alt = `${row.dataset.title} project preview`;
        previewName.textContent = row.dataset.title;
        const rotation = index % 2 ? 3 : -3;
        preview.dataset.rotation = rotation;
        measurePreview();
        movePreview(event);
        preview.style.opacity = "1";
        preview.classList.add("is-visible");
        playInspectorScan();
      });
      row.addEventListener("pointermove", (event) => {
        if (activeRow !== row) return;
        movePreview(event);
      });
      row.addEventListener("pointerleave", hidePreview);
      row.addEventListener("pointercancel", hidePreview);
      row.addEventListener("click", hidePreview);
    });

    window.addEventListener("resize", () => {
      measurePreview();
      if (activeRow) activeRowBounds = activeRow.getBoundingClientRect();
      if (activeRow && !frameId) frameId = requestAnimationFrame(renderPreview);
    }, { passive: true });
    window.addEventListener("blur", hidePreview);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) hidePreview();
    });
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
    const linksLayer = toolbox.querySelector("[data-toolbox-links]");
    const coords = document.querySelector("[data-toolbox-coords]");
    const coordsIdle = coords ? coords.textContent : "";
    const svgNS = "http://www.w3.org/2000/svg";
    const edge = 8;
    const clamp = (min, max, value) => Math.min(Math.max(value, min), Math.max(min, max));
    const lines = [];
    let fieldWidth = 0;
    let fieldHeight = 0;
    let linkFrame = 0;
    let focusIndex = -1;
    let coordsTimer = 0;

    const nodes = chips.map((chip, index) => {
      chip.style.setProperty("--chip-i", index);
      return {
        chip, index, pointerId: null,
        startPointerX: 0, startPointerY: 0, startX: 0, startY: 0,
        lastPointerX: 0, lastPointerY: 0, lastTime: 0,
        x: 0, y: 0, vx: 0, vy: 0, angle: 0, scale: 1,
        baseX: 0, baseY: 0, width: 0, height: 0, glideFrame: 0
      };
    });

    const render = (node) => {
      node.chip.style.transform = `translate3d(${node.x}px, ${node.y}px, 0) rotate(${node.angle}deg) scale(${node.scale})`;
    };
    const limits = (node) => ({
      minX: edge - node.baseX,
      maxX: fieldWidth - node.width - edge - node.baseX,
      minY: edge - node.baseY,
      maxY: fieldHeight - node.height - edge - node.baseY
    });

    // Link every skill to its two nearest neighbours so the field reads as a live node graph.
    const drawLinks = () => {
      linkFrame = 0;
      if (!linksLayer) return;
      const centers = nodes.map((node) => [node.baseX + node.x + node.width / 2, node.baseY + node.y + node.height / 2]);
      const pairs = new Map();
      centers.forEach((center, i) => {
        centers
          .map((other, j) => [j, (other[0] - center[0]) ** 2 + (other[1] - center[1]) ** 2])
          .filter(([j]) => j !== i)
          .sort((a, b) => a[1] - b[1])
          .slice(0, 2)
          .forEach(([j]) => pairs.set(i < j ? `${i}-${j}` : `${j}-${i}`, [Math.min(i, j), Math.max(i, j)]));
      });
      const edges = Array.from(pairs.values());
      while (lines.length < edges.length) {
        const line = document.createElementNS(svgNS, "line");
        linksLayer.appendChild(line);
        lines.push(line);
      }
      lines.forEach((line, k) => {
        const pair = edges[k];
        line.classList.toggle("is-hidden", !pair);
        if (!pair) return;
        const [a, b] = pair;
        line.setAttribute("x1", centers[a][0].toFixed(1));
        line.setAttribute("y1", centers[a][1].toFixed(1));
        line.setAttribute("x2", centers[b][0].toFixed(1));
        line.setAttribute("y2", centers[b][1].toFixed(1));
        line.classList.toggle("is-active", a === focusIndex || b === focusIndex);
      });
    };
    const queueLinks = () => {
      if (!linkFrame) linkFrame = requestAnimationFrame(drawLinks);
    };

    const showCoords = (node) => {
      if (!coords) return;
      window.clearTimeout(coordsTimer);
      coords.textContent = `${node.chip.textContent.trim()} → x:${Math.round(node.baseX + node.x)} y:${Math.round(node.baseY + node.y)}`;
      coords.classList.add("is-live");
    };
    const resetCoords = () => {
      if (!coords) return;
      window.clearTimeout(coordsTimer);
      coordsTimer = window.setTimeout(() => {
        coords.textContent = coordsIdle;
        coords.classList.remove("is-live");
      }, 1200);
    };

    const measure = () => {
      fieldWidth = toolbox.clientWidth;
      fieldHeight = toolbox.clientHeight;
      nodes.forEach((node) => {
        node.baseX = node.chip.offsetLeft;
        node.baseY = node.chip.offsetTop;
        node.width = node.chip.offsetWidth;
        node.height = node.chip.offsetHeight;
        const { minX, maxX, minY, maxY } = limits(node);
        node.x = clamp(minX, maxX, node.x);
        node.y = clamp(minY, maxY, node.y);
        if (node.x || node.y) render(node);
      });
      queueLinks();
    };

    const stopGlide = (node) => {
      if (node.glideFrame) cancelAnimationFrame(node.glideFrame);
      node.glideFrame = 0;
      node.chip.classList.remove("is-gliding");
    };

    // After a flick, the chip keeps sliding with friction and bounces off the field edges.
    const glide = (node) => {
      let last = performance.now();
      node.chip.classList.add("is-gliding");
      const step = (now) => {
        const dt = Math.min(32, now - last);
        last = now;
        const { minX, maxX, minY, maxY } = limits(node);
        node.x += node.vx * dt;
        node.y += node.vy * dt;
        if (node.x < minX) { node.x = minX; node.vx = Math.abs(node.vx) * .55; }
        else if (node.x > maxX) { node.x = maxX; node.vx = -Math.abs(node.vx) * .55; }
        if (node.y < minY) { node.y = minY; node.vy = Math.abs(node.vy) * .55; }
        else if (node.y > maxY) { node.y = maxY; node.vy = -Math.abs(node.vy) * .55; }
        const friction = Math.pow(.935, dt / 16);
        node.vx *= friction;
        node.vy *= friction;
        node.angle = clamp(-6, 6, node.vx * 5);
        render(node);
        showCoords(node);
        queueLinks();
        if (Math.hypot(node.vx, node.vy) > .02) {
          node.glideFrame = requestAnimationFrame(step);
          return;
        }
        node.angle = 0;
        render(node);
        stopGlide(node);
        resetCoords();
      };
      node.glideFrame = requestAnimationFrame(step);
    };

    nodes.forEach((node) => {
      const { chip } = node;
      const move = (event) => {
        if (event.pointerId !== node.pointerId) return;
        const { minX, maxX, minY, maxY } = limits(node);
        node.x = clamp(minX, maxX, node.startX + event.clientX - node.startPointerX);
        node.y = clamp(minY, maxY, node.startY + event.clientY - node.startPointerY);
        const now = performance.now();
        const elapsed = Math.max(1, now - node.lastTime);
        node.vx = node.vx * .6 + ((event.clientX - node.lastPointerX) / elapsed) * .4;
        node.vy = node.vy * .6 + ((event.clientY - node.lastPointerY) / elapsed) * .4;
        node.angle = clamp(-4, 4, (event.clientX - node.lastPointerX) * .32);
        node.lastPointerX = event.clientX;
        node.lastPointerY = event.clientY;
        node.lastTime = now;
        render(node);
        showCoords(node);
        queueLinks();
      };
      const stop = (event) => {
        if (event.pointerId !== node.pointerId) return;
        node.pointerId = null;
        node.angle = 0;
        node.scale = 1;
        chip.classList.remove("is-dragging");
        chip.setAttribute("aria-grabbed", "false");
        chip.releasePointerCapture?.(event.pointerId);
        chip.removeEventListener("pointermove", move);
        chip.removeEventListener("pointerup", stop);
        chip.removeEventListener("pointercancel", stop);
        const stale = performance.now() - node.lastTime > 90;
        const speed = Math.hypot(node.vx, node.vy);
        if (!reduceMotion && !stale && speed > .12) {
          const cap = Math.min(1, 2.4 / speed);
          node.vx *= cap;
          node.vy *= cap;
          glide(node);
          return;
        }
        render(node);
        resetCoords();
      };

      chip.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        stopGlide(node);
        node.pointerId = event.pointerId;
        node.startPointerX = event.clientX;
        node.startPointerY = event.clientY;
        node.lastPointerX = event.clientX;
        node.lastPointerY = event.clientY;
        node.lastTime = performance.now();
        node.startX = node.x;
        node.startY = node.y;
        node.vx = 0;
        node.vy = 0;
        node.scale = 1.055;
        focusIndex = node.index;
        chip.classList.add("is-dragging");
        chip.setAttribute("aria-grabbed", "true");
        render(node);
        queueLinks();
        chip.setPointerCapture?.(event.pointerId);
        chip.addEventListener("pointermove", move);
        chip.addEventListener("pointerup", stop);
        chip.addEventListener("pointercancel", stop);
      });

      const focusNode = () => {
        focusIndex = node.index;
        queueLinks();
      };
      const blurNode = () => {
        if (node.pointerId !== null) return;
        if (focusIndex === node.index) focusIndex = -1;
        queueLinks();
      };
      chip.addEventListener("pointerenter", focusNode);
      chip.addEventListener("pointerleave", blurNode);
      chip.addEventListener("focus", focusNode);
      chip.addEventListener("blur", blurNode);

      chip.addEventListener("keydown", (event) => {
        const distance = event.shiftKey ? 32 : 12;
        const delta = { ArrowLeft: [-distance, 0], ArrowRight: [distance, 0], ArrowUp: [0, -distance], ArrowDown: [0, distance] }[event.key];
        if (!delta) return;
        event.preventDefault();
        stopGlide(node);
        const { minX, maxX, minY, maxY } = limits(node);
        node.x = clamp(minX, maxX, node.x + delta[0]);
        node.y = clamp(minY, maxY, node.y + delta[1]);
        render(node);
        showCoords(node);
        resetCoords();
        queueLinks();
      });
    });

    measure();
    let resizeFrame = 0;
    window.addEventListener("resize", () => {
      if (!resizeFrame) resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; measure(); });
    }, { passive: true });
    window.addEventListener("load", measure, { once: true });
    document.fonts?.ready.then(measure);
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
