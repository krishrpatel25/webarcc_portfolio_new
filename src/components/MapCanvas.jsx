import React, { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";

const isSplineLogo = (el) => {
  if (!el || el.nodeType !== 1) return false;
  if (el.id === "logo") return true;
  if (el.tagName === "A" && el.href && el.href.includes("spline.design")) return true;
  const cls = typeof el.className === "string" ? el.className : "";
  if (cls.includes("logo") || cls.includes("watermark")) return true;
  return false;
};

export default function MapCanvas() {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if device is mobile or tablet (width < 1024px)
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    // Intersection Observer to only load when visible in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
        } else {
          // Optionally unload when out of view to save CPU/GPU resources
          setShouldLoad(false);
        }
      },
      { rootMargin: "100px" } // Start loading slightly before it comes into view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const killLogo = (root) => {
      if (!root) return;
      const candidates = root.querySelectorAll
        ? root.querySelectorAll('a[href*="spline.design"], #logo, [class*="logo"], [class*="watermark"]')
        : [];
      candidates.forEach(el => { try { el.remove(); } catch (_) { } });
      const all = root.querySelectorAll ? root.querySelectorAll("*") : [];
      all.forEach(el => { if (el.shadowRoot) killLogo(el.shadowRoot); });
    };

    killLogo(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (isSplineLogo(node)) { try { node.remove(); } catch (_) { } return; }
          killLogo(node);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
    const killInterval = setInterval(() => killLogo(document), 500);
    const killTimeout = setTimeout(() => clearInterval(killInterval), 15000);

    return () => {
      window.removeEventListener("resize", checkDevice);
      observer.disconnect();
      mutationObserver.disconnect();
      clearInterval(killInterval);
      clearTimeout(killTimeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[460px] lg:min-h-[520px] overflow-hidden select-none canvas-3d-hover"
    >
      {/* Gradient layer — masked so top 65% is fully transparent */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 40%, rgba(255, 255, 255, 0.92) 0px, transparent 20%),
            radial-gradient(ellipse at 50% 85%, #B8E8A0 0px, transparent 55%),
            radial-gradient(ellipse at 15% 60%, #A0CCE8 0px, transparent 48%),
            radial-gradient(ellipse at 85% 60%, #A0CCE8 0px, transparent 48%),
            linear-gradient(135deg, #A8D4E8 0%, #B4D8E8 40%, #C0EAA8 70%, #A8D4E8 100%)
          `,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
        }}
      />
      {/* Absolute inset wrapper — prevents Spline canvas from driving container height */}
      <div className="absolute inset-0 pointer-events-none lg:pointer-events-auto flex items-center justify-center">
        {isMobile ? (
          <img
            src="/robot.png"
            alt="3D Robot"
            className="w-full h-full object-contain object-bottom"
          />
        ) : (
          shouldLoad && (
            <Spline
              scene="https://prod.spline.design/080bq-Oq1Ojmy03J/scene.splinecode"
              className="w-full h-full"
              style={{ background: "transparent" }}
            />
          )
        )}
      </div>

      {/* Decorative square — bottom-right corner, covers Spline logo position */}
      <div
        className="absolute bottom-0 right-0 w-44 h-14 bg-[#F5F4F0] border-t border-l border-black flex items-center justify-center"
        style={{ zIndex: 30 }}
      >
        <span className="text-[10px] font-mono font-semibold tracking-widest uppercase text-black">
          {isMobile ? "WEB AARC / INTERACTIVE" : "WEB AARC / 3D"}
        </span>
      </div>
    </div>
  );
}

