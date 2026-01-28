import { useEffect, useRef, useState } from "react";
import "remixicon/fonts/remixicon.css";
import profilePic from "./assets/profilePic2.png";
import cwpHero from "./assets/cpw-hero.png";
import ecommerceHero from "./assets/xstore-ecommerce.png";
import paypathHero from "./assets/paypath.png";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const steps = [
    {
      id: "01",
      title: "STRATEGY",
      desc: "We understand your business goals and plan the right website approach.",
      color: "bg-white",
    },
    {
      id: "02",
      title: "FREE DEMO",
      desc: "I create a basic demo website using your business details.",
      color: "bg-gray-50",
    },
    {
      id: "03",
      title: "ADVANCE",
      desc: "Once you like the demo, a small advance confirms the project.",
      color: "bg-white",
    },
    {
      id: "04",
      title: "PREVIEW",
      desc: "You receive a full preview link to review content and layout.",
      color: "bg-gray-50",
    },
    {
      id: "05",
      title: "PAYMENT",
      desc: "After your approval, the remaining payment is completed.",
      color: "bg-white",
    },
    {
      id: "06",
      title: "LAUNCH",
      desc: "Your website is published and connected to your domain.",
      color: "[background:var(--accent)] text-white",
    },
  ];
  const reviews = [
    {
      id: "1",
      name: "Alex Rivera",
      role: "E-comm Founder",
      img: "https://i.pravatar.cc/150?u=alex",
      text: "The landing page paid for itself in a week. Lighthouse scores are perfect and the 48h turnaround is unmatched.",
      stars: 5,
      performance: 98,
    },
    {
      id: "2",
      name: "Sarah Chen",
      role: "SaaS Marketing",
      img: "https://i.pravatar.cc/150?u=sarah",
      text: "Cleanest code I've ever seen from a freelancer. It's modular, fast, and exactly what our brand needed to scale.",
      stars: 5,
      performance: 100,
    },
    {
      id: "3",
      name: "Marcus Thorne",
      role: "Agency Owner",
      img: "https://i.pravatar.cc/150?u=marcus",
      text: "He doesn't just build sites; he builds conversion engines. Our lead-to-visitor ratio jumped by 40% immediately.",
      stars: 5,
      performance: 95,
    },
  ];
  useEffect(() => {
    const lens = document.getElementById("lens");
    const progress = document.getElementById("progress");

    if (!lens) return;

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    // 🎚️ Smoothness (lower = more delay)
    const speed = 0.12;

    // ⬇️ Offset values (THIS moves lens below cursor)
    const offsetX = 30; // keep centered horizontally
    const offsetY = 30; // move lens BELOW cursor

    const move = (e) => {
      mouseX = e.clientX + offsetX;
      mouseY = e.clientY + offsetY;
    };

    const scroll = () => {
      if (!progress) return;
      const h = document.documentElement;
      progress.style.width =
        (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
    };

    const animate = () => {
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;

      lens.style.left = currentX + "px";
      lens.style.top = currentY + "px";

      requestAnimationFrame(animate);
    };

    animate();

    document.addEventListener("mousemove", move);
    window.addEventListener("scroll", scroll);

    return () => {
      document.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", scroll);
    };
  }, []);

  useEffect(() => {
    const lens = document.getElementById("lens");
    if (!lens) return;

    const hoverTargets = document.querySelectorAll(
      "nav a, nav button, .project-card",
    );

    const expand = () => lens.classList.add("lens-expand");
    const shrink = () => lens.classList.remove("lens-expand");

    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", expand);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  const expandProject = () => {
    lens.classList.add("lens-expand", "project-hover");
  };

  const shrink = () => {
    lens.classList.remove("lens-expand", "project-hover");
  };

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", expandProject);
    card.addEventListener("mouseleave", shrink);
  });

  return (
    <>
      {/* Progress + Cursor */}
      <div
        id="progress"
        className="fixed top-0 left-0 h-1 w-0 bg-[var(--accent)] z-[10000]"
      />
      <div
        id="lens"
        className="hidden md:block fixed w-3 h-3 rounded-full bg-[var(--accent)]
        pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2
        shadow-[0_0_20px_var(--accent)]"
      />

      {/* ================= DESKTOP SIDEBAR ================= */}
      <nav className="hidden md:flex fixed top-0 left-0 md:w-[70px] lg:w-[80px] bg-[#ffffff0c] backdrop-blur-lg border-r border-black/10 h-screen md:py-4 lg:py-8 flex-col items-center z-10">
        <div className="flex items-center gap-3 mb-16">
          <span className="w-[3px] h-10 bg-[var(--accent)]"></span>
          <span className="italic font-black leading-tight">
            WEB
            <br />
            AARC
          </span>
        </div>

        <ul className="flex flex-col gap-16 my-auto">
          {[
            { label: "INDEX", id: "help" },
            { label: "SERVICES", id: "services" },
            { label: "WORK", id: "projects" },
            { label: "PROCESS", id: "process" },
            { label: "INQUIRY", id: "contact" },
          ].map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="
          text-xs tracking-widest opacity-80 justify-center flex
          hover:text-[var(--accent)]
          [writing-mode:vertical-rl]
          rotate-180
        "
              >
                #{item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ================= MOBILE TOP BAR ================= */}
      <div
        className="fixed top-0 left-0 w-full h-16 bg-[#d8d8d8]
  border-b border-black/10 flex items-center justify-between px-4
  z-[9999] md:hidden"
      >
        <div className="flex items-center gap-3">
          <span className="w-[3px] h-10 bg-[var(--accent)]"></span>
          <span className="italic font-black leading-tight">
            WEB
            <br />
            AARC
          </span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative w-5 h-5 flex items-center justify-center z-[10001]"
          aria-label="Toggle menu"
        >
          {/* top line */}
          <span
            className={`absolute h-[2px] w-5 bg-black transition-all duration-300
    ${menuOpen ? "rotate-45" : "-translate-y-1.5"}`}
          />

          {/* middle line */}
          <span
            className={`absolute h-[2px] w-5 bg-black transition-all duration-300
    ${menuOpen ? "opacity-0" : ""}`}
          />

          {/* bottom line */}
          <span
            className={`absolute h-[2px] w-5 bg-black transition-all duration-300
    ${menuOpen ? "-rotate-45" : "translate-y-1.5"}`}
          />
        </button>
      </div>

      {/* ================= MOBILE SIDE MENU ================= */}
      <div
        className={`fixed top-0 right-0 h-screen w-[280px] bg-[var(--accent)]
  pt-28 px-8 z-[9998] transform transition-transform duration-300
  ${menuOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}
      >
        {[
          { label: "INDEX", id: "help" },
          { label: "SERVICES", id: "services" },
          { label: "WORK", id: "projects" },
          { label: "PROCESS", id: "process" },
          { label: "INQUIRY", id: "contact" },
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setMenuOpen(false)}
            className="block mb-8 tracking-widest text-white text-sm opacity-80
      hover:text-[var(--accent)]"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-9997 md:hidden"
        />
      )}

      {/* ================= RIGHT PANEL ================= */}
      <div
        className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2
        h-[90%] flex-col justify-between items-center z-40"
      >
        <div className="flex flex-col gap-4">
          <i className="ri-instagram-line text-xl" />
          <i className="ri-whatsapp-line text-xl" />
        </div>

        <div className="flex flex-col gap-[3px]">
          <span className="w-6 h-[2px] bg-black opacity-70"></span>
          <span className="w-6 h-[5px] bg-black"></span>
          <span className="w-6 h-[3px] bg-black opacity-80"></span>
          <span className="w-6 h-[7px] bg-black"></span>
          <span className="w-6 h-[2px] bg-black opacity-60"></span>
          <span className="w-6 h-[6px] bg-black"></span>
          <span className="w-6 h-[4px] bg-black opacity-80"></span>
          <span className="w-6 h-[8px] bg-black"></span>
          <span className="w-6 h-[3px] bg-black opacity-70"></span>
          <span className="w-6 h-[5px] bg-black"></span>
          <span className="w-6 h-[2px] bg-black opacity-60"></span>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <main className="pt-20 md:pt-0">
        {/* hero section */}
        <section className="container relative min-h-dvh flex flex-col justify-center py-12 md:py-20 overflow-hidden bg-white text-black">
          {/* 1. THE ARCHITECTURAL GRID (Hidden/Softened on Mobile) */}
          <div className="absolute inset-0 z-0">
            <div className="absolute left-[5%] md:left-[8%] top-0 w-[1px] h-full bg-black/[0.03]" />
            <div className="absolute right-[5%] md:right-[8%] top-0 w-[1px] h-full bg-black/[0.03]" />
            {/* Horizontal line follows the header flow on mobile */}
            <div className="absolute top-[15%] md:top-[20%] left-0 w-full h-[1px] bg-black/[0.03]" />
          </div>

          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 lg:gap-12 items-center">
            {/* 2. BOLD TYPOGRAPHY SECTION */}
            <div className="px-[5%] md:px-0 lg:pl-[8%] pt-10 lg:pt-0">
              <div className="flex items-center gap-4 mb-4 md:mb-6 font-mono text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] text-black/40">
                <div className="w-6 md:w-90 h-[1px] bg-[var(--accent)]" />
              </div>

              <h1 className="font-black leading-[0.85] md:leading-[0.8] text-[clamp(1.5rem,11vw,8.5rem)] tracking-tighter uppercase">
                Websites
                <br />
                <span className="flex flex-wrap items-baseline gap-x-4">
                  <span
                    className="text-transparent"
                    style={{ WebkitTextStroke: "1px black" }}
                  >
                    That Help
                  </span>
                  <span className="text-[var(--accent)]">Businesses Grow</span>
                </span>
              </h1>

              <p className="mt-8 md:mt-12 max-w-[420px] text-lg md:text-xl font-light leading-tight opacity-70">
                I design and develop fast, reliable websites that help
                businesses look professional
                <span className="font-bold"> grow online.</span>
              </p>
            </div>

            {/* 3. THE IMAGE PORTAL (Responsive Scaling) */}
            <div className="relative flex justify-center lg:justify-end px-[5%] md:pr-[8%]">
              <div className="relative w-full max-w-[280px] aspect-[4/5] md:max-w-none md:w-80 md:h-96 group">
                {/* Decorative Frames (Scaled down for mobile) */}
                <div className="absolute -inset-2 md:-inset-4 border border-black/5 rotate-3 group-hover:rotate-0 transition-transform duration-700" />
                <div className="absolute -inset-4 md:-inset-8 border border-black/[0.03] -rotate-6 group-hover:rotate-0 transition-transform duration-1000" />

                {/* Image Container with Corner Cut */}
                <div
                  className="relative w-full h-full overflow-hidden bg-gray-100 shadow-2xl transition-all duration-500 md:group-hover:translate-x-4 md:group-hover:-translate-y-4"
                  style={{
                    clipPath:
                      "polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%)",
                  }}
                >
                  <img
                    src={profilePic}
                    alt="Krish Patel"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />

                  <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
                    <p className="font-mono text-[8px] md:text-[10px] uppercase tracking-widest opacity-60">
                      Developer
                    </p>
                    <h3 className="font-black text-xl md:text-2xl uppercase tracking-tighter">
                      Krish Patel
                    </h3>
                  </div>
                </div>

                {/* Decorative Button with Code Icon */}
                <button className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-[var(--accent)] text-white p-3 md:p-4 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]"
                  >
                    {/* Right Bracket: > */}
                    <polyline points="16 18 22 12 16 6" />
                    {/* Left Bracket: < */}
                    <polyline points="8 6 2 12 8 18" />
                    {/* Slash: / */}
                    <line x1="14" y1="4" x2="10" y2="20" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
        <div className="py-16">
          {/* MOBILE */}
          <div className="md:hidden">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 400 40"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 30H50L80 10H200L230 30H400"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1.5"
              />
              <path
                className="animate-draw"
                d="M50 30L80 10H200L230 30"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeDasharray="250"
                strokeDashoffset="250"
              />
            </svg>
          </div>
          {/* DESKTOP */}
          <div className="hidden md:block">
            <svg
              width="100%"
              height="60"
              viewBox="0 0 1000 60"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 45H100L140 15H450L490 45H1000"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1"
              />
              <path
                className="animate-draw"
                d="M100 45L140 15H450L490 45"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="500"
                strokeDashoffset="500"
              />
            </svg>
          </div>
        </div>

        {/* Help Your Business */}
        <section
          id="help"
          className="container font-['Space_Grotesk',_sans-serif]"
        >
          <div>
            {/* ===== HEADING ===== */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
              <div className="relative">
                <h1
                  className="text-[2.2rem] sm:text-4xl md:text-6xl
          font-[900] tracking-tighter uppercase
          leading-[0.9] md:leading-[0.85] text-black"
                >
                  How We Help <br />
                  <span className="opacity-20">Your Business</span>
                </h1>
              </div>

              <p
                className="max-w-full md:max-w-[280px]
        text-[10px] sm:text-xs font-bold
        text-gray-400 uppercase tracking-widest
        leading-relaxed border-l-2 border-[var(--accent)]
        pl-4"
              >
                Simple, high-performance websites built to turn your visitors
                into customers.
              </p>
            </div>

            {/* ===== MISSION CARD ===== */}
            <div
              className="relative overflow-hidden bg-white
      border border-black/5 
      p-6 sm:p-8 md:p-14 lg:p-20
      shadow-sm"
            >
              {/* Corner Decoration */}
              <div
                className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16
      border-t-4 border-l-4 border-[var(--accent)]/10 "
              />

              <div className="relative z-10">
                <h2
                  className="text-[1.6rem] sm:text-2xl md:text-3xl lg:text-5xl
          font-[800] tracking-tight text-black
          leading-tight md:leading-[1.1]
          max-w-full md:max-w-4xl lg:max-w-5xl"
                >
                  I help small and local businesses{" "}
                  <span className="text-[var(--accent)]">grow online</span> with
                  clean, easy-to-use websites that turn{" "}
                  <span className="italic font-medium border-b-4 border-[var(--accent)]/20 px-1">
                    visitors into customers.
                  </span>
                </h2>

                <p
                  className="text-gray-500 text-base sm:text-lg md:text-2xl
          max-w-full md:max-w-xl lg:max-w-2xl
          mt-6 md:mt-8 leading-relaxed font-medium"
                >
                  No complex systems. No technical confusion. Just
                  high-performance digital tools that work for your business
                  growth.
                </p>

                {/* ===== BADGES ===== */}
                <div
                  className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 md:pt-10
          border-t border-black/5
          flex flex-wrap gap-y-4 gap-x-6 sm:gap-x-8 md:gap-x-12 items-center"
                >
                  {["Free Demo", "Local Focus", "Quick Delivery"].map(
                    (label, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <span className="text-[10px] font-black text-[var(--accent)] opacity-40">
                          0{i + 1}
                        </span>
                        <span
                          className="text-[10px] sm:text-[11px]
                font-[800] uppercase tracking-[0.2em]
                text-black/60 group-hover:text-black
                transition-colors cursor-default"
                        >
                          {label}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* ===== WATERMARK ===== */}
              <span
                className="absolute -bottom-6 -right-6
        sm:-bottom-10 sm:-right-10
        text-[80px] sm:text-[120px] md:text-[200px]
        font-black opacity-[0.03]
        pointer-events-none select-none tracking-tighter"
              >
                LOCAL
              </span>
            </div>
          </div>
        </section>
        <div className="py-16">
          <div className="md:hidden">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 400 40"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 10H150L250 30H400"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1.5"
              />
              <path
                className="animate-draw"
                d="M150 10L250 30"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeDasharray="120"
                strokeDashoffset="120"
              />
            </svg>
          </div>
          <div className="hidden md:block">
            <svg
              width="100%"
              height="60"
              viewBox="0 0 1000 60"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 15H400L600 45H1000"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1"
              />
              <path
                className="animate-draw"
                d="M400 15L600 45"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="250"
                strokeDashoffset="250"
              />
            </svg>
          </div>
        </div>

        {/* our services  */}
        <section id="services" className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
            <div className="relative">
              <h1
                className="text-[2.2rem] sm:text-4xl md:text-6xl
          font-[900] tracking-tighter uppercase
          leading-[0.9] md:leading-[0.85] text-black"
              >
                Our <br />
                <span className="opacity-20">Services</span>
              </h1>
            </div>

            <p
              className="max-w-full md:max-w-[280px]
        text-[10px] sm:text-xs font-bold
        text-gray-400 uppercase tracking-widest
        leading-relaxed border-l-2 border-[var(--accent)]
        pl-4"
            >
              We design and build fast, modern, and user-friendly websites that
              help your business grow online.
            </p>
          </div>

          {/* ===== SERVICES GRID ===== */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 
  gap-px border border-black/10 mb-5"
          >
            {/* Card 1 */}
            <div
              className="bg-[var(--card-bg)] p-6 sm:p-8 md:p-9 font-bold
      border-b border-black/10 
      lg:border-b-0 lg:border-r transition"
            >
              <h3 className="text-lg sm:text-xl uppercase text-[var(--accent)] mb-4 md:mb-5">
                01 / Landing Pages
              </h3>
              <p className="text-sm opacity-90">
                One-page websites designed to get quick calls, WhatsApp
                inquiries, and customer leads.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="bg-[var(--card-bg)] p-6 sm:p-8 md:p-9 font-bold
      border-b border-black/10 
      lg:border-b-0 lg:border-r transition"
            >
              <h3 className="text-lg sm:text-xl uppercase text-[var(--accent)] mb-4 md:mb-5">
                02 / Business Websites
              </h3>
              <p className="text-sm opacity-90">
                Simple multi-page websites that build trust and make your
                business look professional online.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="bg-[var(--card-bg)] p-6 sm:p-8 md:p-9 font-bold
      border-b border-black/10 
      lg:border-b-0 lg:border-r transition"
            >
              <h3 className="text-lg sm:text-xl uppercase text-[var(--accent)] mb-4 md:mb-5">
                03 / Redesign
              </h3>
              <p className="text-sm opacity-90">
                Upgrade your existing website to improve design, speed, and
                mobile experience.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[var(--accent)] p-6 sm:p-8 md:p-9 font-bold flex flex-col gap-4">
              <div>
                <h3 className="text-lg sm:text-xl uppercase text-white mb-4 md:mb-5">
                  04 / Consultation
                </h3>
                <p className="text-white/80 text-sm">
                  Honest advice on what type of website your business actually
                  needs.
                </p>
              </div>
              <a
                href="https://wa.me/9726632563?text=Hi%20I%20want%20to%20discuss%20a%20website%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden bg-white text-black px-12 py-6 uppercase font-black tracking-widest text-xs hover:text-white hover:bg-green-500 transition-all shadow-2xl"
              >
                Talk on WhatsApp →
              </a>
            </div>
          </div>
        </section>
        <div className="py-16">
          {/* MOBILE */}
          <div className="md:hidden">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 400 40"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 10H140L170 30H230L260 10H400"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1.5"
              />
              <path
                className="animate-draw"
                d="M140 10L170 30H230L260 10"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeDasharray="200"
                strokeDashoffset="200"
              />
            </svg>
          </div>
          {/* DESKTOP */}
          <div className="hidden md:block">
            <svg
              width="100%"
              height="60"
              viewBox="0 0 1000 60"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 15H420L450 45H550L580 15H1000"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1"
              />
              <path
                className="animate-draw"
                d="M420 15L450 45H550L580 15"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="400"
                strokeDashoffset="400"
              />
            </svg>
          </div>
        </div>

        {/* recent projects  */}
        <section
          id="projects"
          className="container min-h-screen flex flex-col md:flex-row font-['Space_Grotesk',_sans-serif]"
        >
          {/* LEFT STICKY TITLE */}
          <div className="w-full md:w-2/5 md:h-screen md:sticky md:top-0 flex items-center border-b md:border-b-0 md:border-r border-black/10 bg-[var(--card-bg)] py-10 md:py-0">
            <div className="flex flex-col md:pr-4 gap-4 md:gap-6">
              <h1 className="text-[2rem] sm:text-4xl md:text-6xl font-[900] tracking-tighter uppercase leading-[0.9] md:leading-[0.85] text-black">
                Recent <br />
                <span className="opacity-20">Work</span>
              </h1>

              <p className="max-w-full md:max-w-[280px] text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed border-l-2 border-[var(--accent)] pl-4">
                A collection of projects created for clients, reflecting our
                approach to professional design and development.
              </p>
            </div>
          </div>

          {/* PROJECT LIST */}
          <div className="w-full py-10 md:py-24 md:px-4 space-y-12 md:space-y-24">
            {[
              {
                id: "01",
                title: "Infotech Landing Page",
                label: "INFOTECH_SAMPLE",
                tag: "Technology",
                liveUrl: "https://www.cipherwisp.com/",
                image: cwpHero,
              },
              {
                id: "02",
                title: "Ecommerce Landing Page",
                label: "ECOMMERCE_SAMPLE",
                tag: "Ecommerce",
                liveUrl:
                  "https://krishrpatel25.github.io/XStore-Ecommerce-Project/",
                image: ecommerceHero,
              },
              {
                id: "03",
                title: "Fintech Landing Page",
                label: "FINTECH_SAMPLE",
                tag: "FinTech",
                liveUrl: "https://paypathweb.netlify.app/",
                image: paypathHero,
              },
            ].map((project, idx) => (
              <div
                key={`${project.id}-${idx}`}
                className="flex flex-col items-center text-center border border-black/10 p-6 md:p-12 space-y-6 md:space-y-8"
              >
                {/* TITLE */}
                <div className="space-y-2">
                  <span className="text-[var(--accent)] text-[10px] font-black tracking-[0.3em] uppercase">
                    // Project_{project.id}
                  </span>
                  <h2 className="text-3xl font-[900] tracking-tighter uppercase leading-none">
                    {project.title}
                  </h2>
                </div>

                {/* IMAGE PREVIEW */}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card group w-full max-w-4xl aspect-[14.5/7] border border-black/10 overflow-hidden relative"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />

                  {/* Overlay label */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-4 right-4 text-[10px] font-black tracking-[0.3em] uppercase bg-white px-3 py-1">
                    View Live ↗
                  </span>
                </a>

                {/* DESCRIPTION */}
                <div className="space-y-4 flex flex-col items-center">
                  <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                    Clean, high-performance digital solution tailored for local{" "}
                    {project.tag.toLowerCase()} growth.
                  </p>

                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-[900] uppercase tracking-wider border-b-2 border-black hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all pb-1"
                  >
                    Live Demo ↗
                  </a>

                  <p className="opacity-50 text-[10px] font-black uppercase tracking-widest">
                    {project.tag} // Sample Project
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="py-16">
          <div className="md:hidden">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 400 40"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 20H150L170 10H230L250 30H400"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1.5"
              />
              <path
                className="animate-draw"
                d="M150 20L170 10H230L250 30"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeDasharray="200"
                strokeDashoffset="200"
              />
            </svg>
          </div>

          {/* DESKTOP: Height stays 60px for a more dramatic circuit jump.
           */}
          <div className="hidden md:block">
            <svg
              width="100%"
              height="60"
              viewBox="0 0 1000 60"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 30H400L430 10H570L600 50H1000"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1"
              />
              <path
                className="animate-draw"
                d="M400 30L430 10H570L600 50"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="400"
                strokeDashoffset="400"
              />
            </svg>
          </div>

          <style jsx>{`
            @keyframes draw {
              to {
                stroke-dashoffset: 0;
              }
            }
            .animate-draw {
              animation: draw 3s ease-in-out infinite alternate;
            }
          `}</style>
        </div>

        {/* why choose us  */}
        <section id="chooseUs" className=" container">
          {/* ===== HEADING ===== */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
            <div className="relative">
              <h1
                className="text-[2.2rem] sm:text-4xl md:text-6xl
          font-[900] tracking-tighter uppercase
          leading-[0.9] md:leading-[0.85] text-black"
              >
                Why <br />
                <span className="opacity-20">Choose US</span>
              </h1>
            </div>

            <p
              className="max-w-full md:max-w-[280px]
        text-[10px] sm:text-xs font-bold
        text-gray-400 uppercase tracking-widest
        leading-relaxed border-l-2 border-[var(--accent)]
        pl-4"
            >
              These are real client projects built to solve real business needs.
              Each project reflects our focus on clean design, reliable
              development, and practical results.
            </p>
          </div>
          <div className="bg-[var(--card-bg)] border border-black/10 rounded mb-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-12 max-md:p-6">
              <div className="flex gap-4">
                <span className="w-[4px] bg-[var(--accent)]"></span>
                <div>
                  <h4 className="mb-2 uppercase text-lg font-bold">
                    Fast Delivery
                  </h4>
                  <p className="text-xs opacity-50 leading-relaxed">
                    Your website is usually ready within 24–48 hours, so your
                    business can go online quickly.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="w-[4px] bg-[var(--accent)]"></span>
                <div>
                  <h4 className="mb-2 uppercase text-lg font-bold">
                    Mobile Friendly
                  </h4>
                  <p className="text-xs opacity-50 leading-relaxed">
                    Every website is designed to work smoothly on mobile phones,
                    tablets, and desktops.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="w-[4px] bg-[var(--accent)]"></span>
                <div>
                  <h4 className="mb-2 uppercase text-lg font-bold">
                    Affordable
                  </h4>
                  <p className="text-xs opacity-50 leading-relaxed">
                    Simple and fair pricing designed for small and local
                    business owners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="py-16">
          {/* MOBILE */}
          <div className="md:hidden">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 400 40"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 15H40L70 30H120L150 15H400"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1.5"
              />
              <path
                className="animate-draw"
                d="M40 15L70 30H120L150 15"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="150"
                strokeDashoffset="150"
              />
            </svg>
          </div>
          {/* DESKTOP */}
          <div className="hidden md:block">
            <svg
              width="100%"
              height="60"
              viewBox="0 0 1000 60"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 20H80L120 45H240L280 20H1000"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1"
              />
              <path
                className="animate-draw"
                d="M80 20L120 45H240L280 20"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="350"
                strokeDashoffset="350"
              />
            </svg>
          </div>
        </div>

        {/* our process  */}
        <section
          id="process"
          className="container bg-white font-['Space_Grotesk']"
        >
          {/* ===== HEADING ===== */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
            <div className="relative">
              <h1 className="text-[2.2rem] sm:text-4xl md:text-6xl font-[900] tracking-tighter uppercase leading-[0.9] md:leading-[0.85] text-black">
                Our <br />
                <span className="opacity-20">Workflow</span>
              </h1>
            </div>

            <p className="max-w-full md:max-w-[280px] text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed border-l-2 border-[var(--accent)] pl-4">
              Our process is simple and transparent, designed to keep you
              involved at every stage. From a free demo to final launch, each
              step ensures clarity, quality, and a smooth project experience.
            </p>
          </div>

          <div className="px-[6%]">
            {/* STACKING CONTAINER */}
            <div className="relative">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  className="sticky top-20 mb-20 group"
                  style={{ top: `${80 + i * 20}px` }}
                >
                  <div
                    className={`
              ${step.color}
              border border-black/10 rounded-3xl
              p-8 md:p-16 lg:p-20
              shadow-[0_-20px_50px_rgba(0,0,0,0.05)]
              transition-transform duration-500
              group-hover:-translate-y-2
              relative
            `}
                    style={
                      step.id === "06" ? { background: "var(--accent)" } : {}
                    }
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                      {/* Left Info */}
                      <div className="space-y-6 md:w-2/3">
                        <div className="flex items-center gap-4">
                          <span
                            className="px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest"
                            style={{
                              color:
                                step.id === "06" ? "#fff" : "var(--accent)",
                              borderColor:
                                step.id === "06" ? "#fff" : "var(--accent)",
                            }}
                          >
                            Phase_0{step.id}
                          </span>

                          <div
                            className="h-[1px] w-12"
                            style={{
                              background:
                                step.id === "06"
                                  ? "rgba(255,255,255,0.3)"
                                  : "rgba(0,0,0,0.1)",
                            }}
                          />
                        </div>

                        <h2 className="text-4xl md:text-7xl font-[900] tracking-tighter uppercase leading-none">
                          {step.title}
                        </h2>

                        <p
                          className="text-base md:text-xl font-medium leading-relaxed max-w-xl"
                          style={{
                            color:
                              step.id === "06"
                                ? "rgba(255,255,255,0.8)"
                                : "#6b7280",
                          }}
                        >
                          {step.desc}
                        </p>
                      </div>

                      {/* Right Index */}
                      <div className="text-7xl md:text-[6rem] font-black opacity-10 leading-none select-none">
                        {step.id}
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute bottom-8 right-12 text-xs font-black tracking-widest uppercase opacity-40">
                      {step.id === "06" ? "Ready" : "In_Progress"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="py-16">
          {/* MOBILE: Baseline 15, Jump on the right (approx 70% mark) */}
          <div className="md:hidden">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 400 40"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 15H250L280 5H330L360 15H400"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1.5"
              />
              <path
                className="animate-draw"
                d="M250 15L280 5H330L360 15"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="150"
                strokeDashoffset="150"
              />
            </svg>
          </div>

          {/* DESKTOP: Baseline 45, Jump on the right (approx 75% mark) */}
          <div className="hidden md:block">
            <svg
              width="100%"
              height="60"
              viewBox="0 0 1000 60"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 45H720L760 20H880L920 45H1000"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1"
              />
              <path
                className="animate-draw"
                d="M720 45L760 20H880L920 45"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="350"
                strokeDashoffset="350"
              />
            </svg>
          </div>
        </div>

        {/* client reviews  */}
        <section className="container font-['Space_Grotesk']">
          {/* ===== HEADING ===== */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
            <div className="relative">
              <h1 className="text-[2.2rem] sm:text-4xl md:text-6xl font-[900] tracking-tighter uppercase leading-[0.9] md:leading-[0.85] text-black">
                What <br />
                <span className="opacity-20">Clients Say</span>
              </h1>
            </div>

            <p className="max-w-full md:max-w-[280px] text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed border-l-2 border-[var(--accent)] pl-4">
              Our clients’ words speak for the quality, reliability, and
              professionalism we bring to every project.
            </p>
          </div>

          {/* ===== CONTENT ===== */}
          <div>
            {/* TOP LEVEL RATING */}
            <div className="flex flex-col md:flex-row justify-between items-center p-10 border border-black/5 border-b-0 bg-gray-50/50">
              <div className="text-center md:text-left mb-8 md:mb-0">
                <h2 className="text-7xl md:text-9xl font-[900] tracking-tighter leading-none">
                  5.0<span className="text-[var(--accent)]">★</span>
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mt-2">
                  Verified Marketplace Rating
                </p>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-1/3">
                {[5, 4, 3].map((num) => (
                  <div key={num} className="flex items-center gap-4">
                    <span className="text-[10px] font-black w-4">{num}★</span>
                    <div className="flex-1 h-[2px] bg-black/5 overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent)]"
                        style={{ width: num === 5 ? "100%" : "0%" }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-300">
                      {num === 5 ? "100%" : "0%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CLIENT CARDS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 border border-black/5 border-t-0 lg:[&>*:nth-child(3n)]:border-r-0">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-8 bg-white
          border-b border-black/5
          lg:border-b-0 lg:border-r"
                >
                  {/* Client Info */}
                  <div className="flex items-center gap-4 mb-8">
                    <img
                      src={rev.img}
                      alt={rev.name}
                      className="w-14 h-14 grayscale border border-black/5 p-1"
                    />
                    <div>
                      <h4 className="font-black uppercase tracking-tighter text-sm">
                        {rev.name}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {rev.role}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(rev.stars)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 fill-[var(--accent)]"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-lg font-medium tracking-tight leading-snug mb-10 text-black italic">
                    "{rev.text}"
                  </p>

                  {/* Footer */}
                  <div className="pt-6 border-t border-black/5 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Perf_Score
                    </span>
                    <span className="text-sm font-[900] text-[var(--accent)]">
                      {rev.performance}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="py-16">
          {/* MOBILE: Centered M-Shape with 1.5/2 stroke thickness */}
          <div className="md:hidden">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 400 40"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Background Track - Elegant 1.5px */}
              <path
                d="M0 20H130L155 5L200 35L245 5L270 20H400"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1.5"
              />
              {/* Animated Accent - Refined 2px */}
              <path
                className="animate-draw"
                d="M130 20L155 5L200 35L245 5L270 20"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="250"
                strokeDashoffset="250"
              />
            </svg>
          </div>

          {/* DESKTOP: Centered M-Shape with 1/2 stroke thickness */}
          <div className="hidden md:block">
            <svg
              width="100%"
              height="60"
              viewBox="0 0 1000 60"
              fill="none"
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              {/* Background Track - Surgical 1px */}
              <path
                d="M0 30H380L420 10H480L500 50L520 10H580L620 30H1000"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1"
              />
              {/* Animated Accent - Sharp 2px */}
              <path
                className="animate-draw"
                d="M380 30L420 10H480L500 50L520 10H580L620 30"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="400"
                strokeDashoffset="400"
              />
            </svg>
          </div>
        </div>

        {/* contact form  */}
        <section
          id="contact"
          className="container grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-20 py-10"
        >
          <div>
            <h2 className="text-[clamp(3.5rem,10vw,7rem)] leading-[0.85] font-black uppercase tracking-tighter">
              READY TO <br />
              <span className="text-[var(--accent)]">GROW?</span>
            </h2>
          </div>

          <form
            action="https://formspree.io/f/xnjdljle"
            method="POST"
            className="group"
          >
            {/* Name */}
            <div className="relative mb-8">
              <input
                type="text"
                name="name"
                required
                placeholder="Name"
                className="w-full bg-transparent border-b border-black/10 py-5 outline-none focus:border-[var(--accent)] transition-colors placeholder:text-black/20"
              />
            </div>

            {/* Email */}
            <div className="relative mb-8">
              <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-black/10 py-5 outline-none focus:border-[var(--accent)] transition-colors placeholder:text-black/20"
              />
            </div>
            {/* Email */}
            <div className="relative mb-8">
              <input
                type="mobile"
                name="mobile"
                required
                placeholder="Mobile Number"
                className="w-full bg-transparent border-b border-black/10 py-5 outline-none focus:border-[var(--accent)] transition-colors placeholder:text-black/20"
              />
            </div>

            {/* Project Type */}
            <div className="relative mb-8">
              <select
                name="project_type"
                className="w-full bg-transparent border-b border-black/10 py-5 outline-none focus:border-[var(--accent)] appearance-none cursor-pointer text-black/60 focus:text-black"
              >
                <option value="">Project Type (Optional)</option>
                <option value="Website Design">Website Design</option>
                <option value="Website Development">Website Development</option>
                <option value="Redesign">Redesign</option>
                <option value="Not Sure">Not Sure</option>
              </select>

              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 1L5 5L9 1" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="relative mb-12">
              <textarea
                rows="3"
                name="message"
                required
                placeholder="Briefly tell me about your project or idea."
                className="w-full bg-transparent border-b border-black/10 py-5 outline-none focus:border-[var(--accent)] transition-colors placeholder:text-black/20 resize-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="relative overflow-hidden bg-[var(--accent)] text-white px-12 py-6 uppercase font-black tracking-widest text-xs hover:bg-black transition-all shadow-2xl"
            >
              Submit
            </button>

            {/* Trust line */}
            <p className="mt-4 text-[10px] uppercase tracking-widest opacity-40">
              No spam. I reply within 24 hours.
            </p>
          </form>
        </section>

        <footer className="border-t border-black/10 pt-20 pb-10 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              {/* Column 1: Brand Identity */}
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-3 mb-16">
                  <span className="w-[3px] h-10 bg-[var(--accent)]"></span>
                  <span className="italic font-black leading-tight">
                    WEB
                    <br />
                    AARC
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-40 uppercase tracking-widest max-w-[200px]">
                  Precision-built digital structures for local businesses.
                </p>
              </div>

              {/* Column 2: Navigation Links */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-30 mb-6">
                  // Index
                </h4>
                <ul className="space-y-3 text-xs font-bold uppercase tracking-tighter">
                  <li>
                    <a
                      href="#hero"
                      className="hover:text-[var(--accent)] transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#services"
                      className="hover:text-[var(--accent)] transition-colors"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#projects"
                      className="hover:text-[var(--accent)] transition-colors"
                    >
                      Selected Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="hover:text-[var(--accent)] transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Direct Contact */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-30 mb-6">
                  // Connectivity
                </h4>
                <div className="space-y-4">
                  {/* Email */}
                  <a
                    href="mailto:krishrpatel09@gmail.com"
                    className="block group"
                  >
                    <span className="text-[10px] block opacity-40 mb-1">
                      Email
                    </span>
                    <span className="text-xs font-bold border-b border-transparent group-hover:border-[var(--accent)] transition-all">
                      krishrpatel09@gmail.com
                    </span>
                  </a>

                  {/* WhatsApp - Mobile Link */}
                  <a
                    href="https://wa.me/9726632563?text=I'm%20interested%20in%20a%20project"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group text-[var(--accent)]"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <span className="text-xs font-black uppercase tracking-tighter">
                      Chat on WhatsApp
                    </span>
                  </a>
                </div>
              </div>

              {/* Column 4: Location/Time */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] opacity-30 mb-6">
                  // Presence
                </h4>
                <div className="text-xs font-bold uppercase tracking-tighter space-y-1">
                  <div>Based in Ahmedabad, IN</div>
                  <div className="opacity-40 font-normal">
                    Available Worldwide
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Legal Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-black/5 text-[9px] opacity-30 uppercase tracking-[0.3em] gap-4">
              <div>Web Aarc © 2026 // All Rights Reserved</div>
              <div className="flex gap-8">
                <a href="#" className="hover:text-black transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-black transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
