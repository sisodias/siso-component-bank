"use client";
import { useEffect } from "react";
import "@/index.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Pane } from "tweakpane";

export default function ScrollAnimation() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const config = {
      theme: "dark",
      animate: true,
      snap: true,
      start: gsap.utils.random(0, 100, 1),
      end: gsap.utils.random(900, 1000, 1),
      scroll: true,
      debug: false,
    };

    const ctrl = new Pane({ title: "Config", expanded: false });
    let items, scrollerScrub, dimmerScrub, chromaEntry, chromaExit;

    const update = () => {
      document.documentElement.dataset.theme = config.theme;
      document.documentElement.dataset.syncScrollbar = config.scroll;
      document.documentElement.dataset.animate = config.animate;
      document.documentElement.dataset.snap = config.snap;
      document.documentElement.dataset.debug = config.debug;
      document.documentElement.style.setProperty("--start", config.start);
      document.documentElement.style.setProperty("--hue", config.start);
      document.documentElement.style.setProperty("--end", config.end);

      if (!config.animate) {
        chromaEntry?.scrollTrigger.disable(true, false);
        chromaExit?.scrollTrigger.disable(true, false);
        dimmerScrub?.disable(true, false);
        scrollerScrub?.disable(true, false);
        gsap.set(items, { opacity: 1 });
        gsap.set(document.documentElement, { "--chroma": 0 });
      } else {
        gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });
        dimmerScrub?.enable(true, true);
        scrollerScrub?.enable(true, true);
        chromaEntry?.scrollTrigger.enable(true, true);
        chromaExit?.scrollTrigger.enable(true, true);
      }
    };

    ctrl.addBinding(config, "animate", { label: "Animate" });
    ctrl.addBinding(config, "snap", { label: "Snap" });
    ctrl.addBinding(config, "start", { label: "Hue Start", min: 0, max: 1000, step: 1 });
    ctrl.addBinding(config, "end", { label: "Hue End", min: 0, max: 1000, step: 1 });
    ctrl.addBinding(config, "scroll", { label: "Scrollbar" });
    ctrl.addBinding(config, "debug", { label: "Debug" });
    ctrl.addBinding(config, "theme", {
      label: "Theme",
      options: { System: "system", Light: "light", Dark: "dark" },
    });

    ctrl.on("change", update);

    // Fallback без CSS scroll-timeline
    if (!CSS.supports("(animation-timeline: scroll()) and (animation-range: 0% 100%)")) {
      items = gsap.utils.toArray("ul li");
      gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });

      const dimmer = gsap.timeline()
        .to(items.slice(1), { opacity: 1, stagger: 0.5 })
        .to(items.slice(0, items.length - 1), { opacity: 0.2, stagger: 0.5 }, 0);

      dimmerScrub = ScrollTrigger.create({
        trigger: items[0],
        endTrigger: items[items.length - 1],
        start: "center center",
        end: "center center",
        animation: dimmer,
        scrub: 0.2,
      });

      const scroller = gsap.timeline().fromTo(
        document.documentElement,
        { "--hue": config.start },
        { "--hue": config.end, ease: "none" }
      );

      scrollerScrub = ScrollTrigger.create({
        trigger: items[0],
        endTrigger: items[items.length - 1],
        start: "center center",
        end: "center center",
        animation: scroller,
        scrub: 0.2,
      });

      chromaEntry = gsap.fromTo(
        document.documentElement,
        { "--chroma": 0 },
        {
          "--chroma": 0.3,
          ease: "none",
          scrollTrigger: {
            scrub: 0.2,
            trigger: items[0],
            start: "center center+=40",
            end: "center center",
          },
        }
      );

      chromaExit = gsap.fromTo(
        document.documentElement,
        { "--chroma": 0.3 },
        {
          "--chroma": 0,
          ease: "none",
          scrollTrigger: {
            scrub: 0.2,
            trigger: items[items.length - 2],
            start: "center center",
            end: "center center-=40",
          },
        }
      );
    }

    update();
  }, []);

  return (
    <>
      <header>
        <h1
          className="fluid"
          style={{ fontSize: "calc(var(--fluid-type) * 2)" }}
        >
          you can<br />scroll.
        </h1>
      </header>
      <main>
        <section className="content fluid">
          <h2>
            <span aria-hidden="true">you can&nbsp;</span>
            <span className="sr-only">you can ship things.</span>
          </h2>
          <ul aria-hidden="true" style={{ "--count": 22 }}>
            {[
              "design.","prototype.","solve.","build.","develop.","debug.","learn.","cook.","ship.","prompt.",
              "collaborate.","create.","inspire.","follow.","innovate.","test.","optimize.","teach.","visualize.",
              "transform.","scale.","do it."
            ].map((text, i) => (
              <li key={i} style={{ "--i": i }}>{text}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="fluid">fin.</h2>
        </section>
      </main>
      <footer>ʕ⊙ᴥ⊙ʔ jh3yy &copy; 2024</footer>
    </>
  );
}
