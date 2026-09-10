document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  const showWithoutMotion = () => {
    document.querySelectorAll(".motion-enter").forEach((element) => element.classList.add("is-visible"));
  };

  const setupNavigation = () => {
    if ("IntersectionObserver" in window && navLinks.length) {
      const sectionObserver = new IntersectionObserver((entries) => {
        const activeEntry = entries.find((entry) => entry.isIntersecting);
        if (!activeEntry) return;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${activeEntry.target.id}`;
          link.classList.toggle("active", isActive);
          if (isActive) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }, { rootMargin: "-28% 0px -62% 0px", threshold: 0 });

      document.querySelectorAll("main section[id], footer[id]").forEach((section) => sectionObserver.observe(section));
    }

    const closeMenu = () => {
      if (!menuToggle || !siteNav) return;
      menuToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };

    if (!menuToggle || !siteNav) return;
    menuToggle.addEventListener("click", () => {
      const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      siteNav.classList.toggle("is-open", willOpen);
      document.body.classList.toggle("menu-open", willOpen);
    });
    siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  };

  const setupProjectReel = () => {
    document.querySelectorAll("[data-project-reel]").forEach((reel) => {
      const slides = Array.from(reel.querySelectorAll("[data-reel-slide]"));
      const title = reel.querySelector("[data-reel-title]");
      const counter = reel.querySelector("[data-reel-index]");
      const previous = reel.querySelector("[data-reel-previous]");
      const next = reel.querySelector("[data-reel-next]");
      const duration = 5200;
      let activeIndex = 0;
      let timer;
      let isPaused = false;
      let isInView = true;

      if (slides.length < 2) return;

      const stop = () => {
        window.clearTimeout(timer);
        reel.classList.remove("is-running");
      };

      const schedule = () => {
        stop();
        if (reduceMotion || isPaused || !isInView || document.hidden) return;
        void reel.offsetWidth;
        reel.classList.add("is-running");
        timer = window.setTimeout(() => showSlide(activeIndex + 1), duration);
      };

      const showSlide = (nextIndex) => {
        activeIndex = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, index) => {
          const isActive = index === activeIndex;
          slide.classList.toggle("is-active", isActive);
          slide.setAttribute("aria-hidden", String(!isActive));
          slide.setAttribute("tabindex", isActive ? "0" : "-1");
        });
        if (title) title.textContent = slides[activeIndex].dataset.title;
        if (counter) counter.textContent = String(activeIndex + 1).padStart(2, "0");
        schedule();
      };

      previous?.addEventListener("click", () => showSlide(activeIndex - 1));
      next?.addEventListener("click", () => showSlide(activeIndex + 1));
      reel.addEventListener("pointerenter", () => { isPaused = true; stop(); });
      reel.addEventListener("pointerleave", () => { isPaused = false; schedule(); });
      reel.addEventListener("focusin", () => { isPaused = true; stop(); });
      reel.addEventListener("focusout", () => {
        window.setTimeout(() => {
          if (reel.contains(document.activeElement)) return;
          isPaused = false;
          schedule();
        }, 0);
      });

      if ("IntersectionObserver" in window) {
        const reelObserver = new IntersectionObserver(([entry]) => {
          isInView = entry.isIntersecting;
          schedule();
        }, { threshold: 0.25 });
        reelObserver.observe(reel);
      }

      document.addEventListener("visibilitychange", schedule);
      showSlide(0);
    });
  };

  const setupFallbackReveals = () => {
    const revealElements = document.querySelectorAll(".motion-enter");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      showWithoutMotion();
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
  };

  const setupGsapMotion = () => {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) {
      setupFallbackReveals();
      return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    root.classList.add("has-gsap");

    const progress = document.createElement("span");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    gsap.to(progress, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.2 }
    });

    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 801px)", mobile: "(max-width: 800px)" }, (context) => {
      const isDesktop = context.conditions.desktop;
      const travel = isDesktop ? 52 : 26;

      if (document.querySelector(".hero")) {
        gsap.set([".hero-content", ".hero-project"], { autoAlpha: 1, y: 0 });
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".site-header", { y: -24, autoAlpha: 0, duration: 0.65 })
          .from(".hero-content .eyebrow, .hero-content .availability", { y: 18, autoAlpha: 0, duration: 0.55, stagger: 0.08 }, "-=0.25")
          .from(".hero-line", { yPercent: 115, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, "-=0.28")
          .from(".hero-summary", { y: 22, autoAlpha: 0, duration: 0.65 }, "-=0.48")
          .from(".hero-actions > *", { y: 18, autoAlpha: 0, duration: 0.5, stagger: 0.1 }, "-=0.38")
          .from(".hero-project", { x: isDesktop ? 46 : 0, y: isDesktop ? 0 : 24, scale: 0.965, autoAlpha: 0, duration: 1 }, "-=0.8");

        if (isDesktop) {
          gsap.to(".hero-image-wrap", {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
          });
        }
      }

      document.querySelectorAll(".project-entry").forEach((entry, index) => {
        const visual = entry.querySelector(".project-visual");
        const body = entry.querySelector(".project-body");
        const details = body?.querySelectorAll(".project-meta, h3, .project-summary, .project-role, .project-stack, .project-link-label");
        const direction = index % 2 === 0 ? -1 : 1;

        gsap.timeline({
          scrollTrigger: { trigger: entry, start: "top 82%", toggleActions: "play none none reverse" }
        })
          .from(visual, { x: isDesktop ? direction * travel : 0, y: isDesktop ? 0 : travel, scale: 0.95, autoAlpha: 0, duration: 0.85, ease: "power3.out" })
          .from(details || body, { y: 28, autoAlpha: 0, duration: 0.62, stagger: 0.07, ease: "power2.out" }, "-=0.5");

        if (isDesktop && visual) {
          const image = visual.querySelector("img");
          gsap.fromTo(image, { yPercent: -5, scale: 1.08 }, {
            yPercent: 5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: { trigger: visual, start: "top bottom", end: "bottom top", scrub: 1 }
          });
        }
      });

      const revealGroup = (trigger, targets, fromVars = {}) => {
        if (!document.querySelector(trigger)) return;
        gsap.from(targets, {
          y: 34,
          autoAlpha: 0,
          duration: 0.72,
          stagger: 0.1,
          ease: "power3.out",
          ...fromVars,
          scrollTrigger: { trigger, start: "top 80%", toggleActions: "play none none reverse" }
        });
      };

      revealGroup(".about-section", ".about-heading > *, .about-copy > *");
      revealGroup(".skills-section .section-inner", ".skills-section .section-heading > *");

      if (document.querySelector(".skills-list")) {
        document.querySelectorAll(".skill-row").forEach((row) => {
          gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 86%", toggleActions: "play none none reverse" }
          })
            .from(row, { y: 26, autoAlpha: 0, duration: 0.58, ease: "power2.out" })
            .from(row.querySelectorAll("dd span"), {
              y: 12,
              autoAlpha: 0,
              duration: 0.38,
              stagger: 0.055,
              ease: "power2.out"
            }, "-=0.3");
        });
      }

      revealGroup(".experience-section", ".experience-section .section-heading > *");
      document.querySelectorAll(".experience-item").forEach((item) => {
        gsap.timeline({
          scrollTrigger: { trigger: item, start: "top 84%", toggleActions: "play none none reverse" }
        })
          .from(item.querySelector(".where-meta"), { x: -22, autoAlpha: 0, duration: 0.55 })
          .from(item.querySelectorAll(".where-content > *"), { x: isDesktop ? 34 : 0, y: isDesktop ? 0 : 20, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }, "-=0.3");
      });

      revealGroup(".site-footer", ".footer-intro > *, .footer-links, .footer-contact", { y: 26 });

      if (document.body.classList.contains("project-page")) {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".project-detail-header", { y: -20, autoAlpha: 0, duration: 0.55 })
          .from(".project-title-block > *", { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.09 }, "-=0.2")
          .from(".demo-window", { y: 42, scale: 0.985, autoAlpha: 0, duration: 0.85 }, "-=0.45");

        revealGroup(".project-details", ".details-intro > *, .details-layout");
        revealGroup(".workflow-section", ".workflow-section > *");
        revealGroup(".project-resources", ".project-resources > *");
      }
    });

    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  };

  setupNavigation();
  setupProjectReel();
  setupGsapMotion();
});
