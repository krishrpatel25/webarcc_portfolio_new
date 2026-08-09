import { useEffect, useRef, useState } from "react";
import "remixicon/fonts/remixicon.css";
import profilePic from "./assets/profilePic2.png";
import cwpHero from "./assets/cpw-hero.png";
import ecommerceHero from "./assets/xstore-ecommerce.png";
import paypathHero from "./assets/paypath.png";
import MapCanvas from "./components/MapCanvas";
import ProjectAccordion from "./components/ProjectAccordion";
import { projectsData } from "./data/projectsData";
export default function App() {
  const [activeHeroProject, setActiveHeroProject] = useState(projectsData[0]);
  const [activeLang, setActiveLang] = useState("EN");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [openFaqId, setOpenFaqId] = useState(null);

  // Pixel intro animation
  const COLS = 8;
  const ROWS = 5;
  const [pixelDelays] = useState(() =>
    Array.from({ length: COLS * ROWS }, () => Math.floor(Math.random() * 1400))
  );
  const [showPixelIntro, setShowPixelIntro] = useState(() => {
    // Check if session storage flag exists
    if (typeof window !== "undefined") {
      const hasLoaded = sessionStorage.getItem("hasLoadedPortfolio");
      return !hasLoaded;
    }
    return true;
  });
  const [pixelsVanishing, setPixelsVanishing] = useState(false);
  const [textFading, setTextFading] = useState(false);
  const [loadingNum, setLoadingNum] = useState(0);

  useEffect(() => {
    if (!showPixelIntro) return;

    // Set flag so it won't show again in this session
    sessionStorage.setItem("hasLoadedPortfolio", "true");

    // Count 0 → 100 over 1200ms
    let count = 0;
    const counter = setInterval(() => {
      count += 1;
      setLoadingNum(count);
      if (count >= 100) {
        clearInterval(counter);
        // Start fading text immediately once 100% is reached
        setTextFading(true);
      }
    }, 12);

    // Start pixel vanish animation 500ms after text fade starts (1200ms loading + 500ms fade buffer = 1700ms)
    const t1 = setTimeout(() => setPixelsVanishing(true), 1700);
    // Remove overlay from DOM once all pixels have finished fading slowly (1700ms start + 1400ms max delay + 1600ms transition = 4700ms)
    const t2 = setTimeout(() => setShowPixelIntro(false), 4800);
    return () => { clearInterval(counter); clearTimeout(t1); clearTimeout(t2); };
  }, [showPixelIntro]);

  // Typewriter animation
  const roles = [
    "Full-Stack Developer",
    "UI/UX Designer",
    "Design Engineer",
    "Frontend Specialist",
    "React & Next.js Dev",
  ];
  const [typedText, setTypedText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    if (isPaused) {
      const pause = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 1600);
      return () => clearTimeout(pause);
    }
    const speed = isDeleting ? 45 : 90;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const next = currentRole.slice(0, typedText.length + 1);
        setTypedText(next);
        if (next === currentRole) setIsPaused(true);
      } else {
        const next = currentRole.slice(0, typedText.length - 1);
        setTypedText(next);
        if (next === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, isPaused, roleIndex]);

  // Contact form state
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", projectType: "", brief: "" });
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState("idle"); // idle | submitting | success | error

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required.";
    } else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(formData.mobile)) {
      errors.mobile = "Enter a valid mobile number.";
    }
    if (!formData.projectType) errors.projectType = "Please select a project type.";
    return errors;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormStatus("submitting");
    try {
      const res = await fetch("https://formspree.io/f/xeajedbq", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          projectType: formData.projectType,
          brief: formData.brief || "(Not provided)",
        }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", mobile: "", projectType: "", brief: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    };
  }, [menuOpen]);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum distance to swipe

    if (diff > threshold) {
      // Swiped left -> NEXT testimonial
      setCurrentTestimonialIndex((prev) => prev + 1);
    } else if (diff < -threshold) {
      // Swiped right -> PREV testimonial
      setCurrentTestimonialIndex((prev) => prev - 1);
    }

    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

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
    const progress = document.getElementById("progress");
    let ticking = false;
    const scroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (progress) {
            const h = document.documentElement;
            progress.style.width =
              (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  return (
    <>
      {/* ================= PIXEL INTRO OVERLAY ================= */}
      {showPixelIntro && (
        <div className="fixed inset-0 z-[99999]" style={{ pointerEvents: "none" }}>
          {/* Pixel grid */}
          {pixelDelays.map((delay, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(col / COLS) * 100}%`,
                  top: `${(row / ROWS) * 100}%`,
                  width: `${100 / COLS}%`,
                  height: `${100 / ROWS}%`,
                  backgroundColor: "#F5F4F0",
                  opacity: pixelsVanishing ? 0 : 1,
                  transition: `opacity 1.6s ease ${delay}ms`,
                }}
              />
            );
          })}
          {/* Loading number */}
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              right: "6%",
              fontFamily: "'Syne', monospace",
              fontSize: "clamp(4rem, 10vw, 8rem)",
              fontWeight: "800",
              color: "#000",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              opacity: textFading ? 0 : 1,
              transition: "opacity 0.4s ease",
              userSelect: "none",
            }}
          >
            {String(loadingNum).padStart(2, "0")}
            <span style={{ fontSize: "0.4em", verticalAlign: "super", opacity: 0.4 }}>%</span>
          </div>
          {/* Loading label */}
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              left: "6%",
              fontFamily: "monospace",
              fontSize: "0.65rem",
              fontWeight: "700",
              color: "#000",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: textFading ? 0 : 0.4,
              transition: "opacity 0.4s ease",
              userSelect: "none",
            }}
          >
            Loading Portfolio
          </div>
          {/* Top-left brand logo matching navbar */}
          <div
            style={{
              position: "absolute",
              top: "24px",
              left: "24px",
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#000",
              letterSpacing: "-0.02em",
              textTransform: "lowercase",
              opacity: textFading ? 0 : 1,
              transition: "opacity 0.4s ease",
              userSelect: "none",
            }}
          >
            web aarc<span style={{ color: "#a3a3a3" }}>.</span>
          </div>
        </div>
      )}
      {/* Scroll Progress Indicator */}
      <div
        id="progress"
        className="fixed top-0 left-0 h-1 w-0 bg-[var(--accent)] z-[10000]"
      />
      {/* ================= TIERRA TOP NAVIGATION BAR ================= */}
      <nav className="w-full grid grid-cols-12 items-stretch border-b border-black bg-[#F5F4F0] text-black sticky top-0 z-50">
        {/* Left: Brand logo (web aarc.) */}
        <div className="col-span-8 sm:col-span-4 lg:col-span-3 flex items-center px-4 py-3 sm:px-6 sm:py-4">
          <a
            href="#hero"
            className="font-syne text-xl sm:text-2xl font-bold tracking-tight text-black lowercase flex items-center gap-1.5"
          >
            web aarc<span className="text-neutral-400">.</span>
          </a>
        </div>
        {/* Middle: Navigation links with vertical dividers */}
        <div className="hidden lg:flex col-span-6 items-stretch text-[11px] font-mono tracking-wider uppercase font-semibold border-l border-r border-black">
          {[
            { label: "ABOUT", id: "about" },
            { label: "SERVICES", id: "services" },
            { label: "WORK", id: "projects" },
            { label: "PROCESS", id: "process" },
            { label: "INQUIRY", id: "contact" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex-1 flex items-center justify-center border-r border-black last:border-r-0 text-neutral-700 hover:text-black hover:bg-black/5 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        {/* Right: Book Free Demo button (Desktop) */}
        <div className="hidden lg:flex col-span-3 items-center justify-end space-x-3 px-6 py-4">
          {/* Resume Pill Link */}
          <a
            href="/krishpatel_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-wider font-semibold border border-black px-4 py-2 rounded-none hover:opacity-80 transition-all shadow-sm relative overflow-hidden bg-[#F5F4F0] text-black"
          >
            <div
              className="absolute inset-0 pointer-events-none"
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
            <span className="relative z-10">View Resume</span>
          </a>
          {/* Book Free Demo Pill Button */}
          <a
            href="#contact"
            className="text-xs uppercase tracking-wider font-semibold border border-black px-4 py-2 rounded-none hover:bg-black hover:text-white transition-all shadow-sm"
          >
            Book Free Demo
          </a>
        </div>
        {/* Right: Hamburger Menu (Mobile/Tablet) */}
        <div className="col-span-4 sm:col-span-8 lg:hidden flex items-stretch justify-end">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-black hover:text-neutral-600 focus:outline-none transition-colors border-l border-black px-5 sm:px-8 flex items-center justify-center h-full cursor-pointer bg-transparent"
            aria-label="Toggle Menu"
          >
            <i className={menuOpen ? "ri-close-line" : "ri-menu-line"}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[70vw] sm:w-[320px] bg-[#F5F4F0] border-l border-r border-black z-40 transition-transform duration-300 ease-in-out transform ${menuOpen ? "translate-x-0" : "translate-x-full"
          } lg:hidden flex flex-col justify-between pt-[53px] sm:pt-[65px]`}
      >
        <div className="flex flex-col divide-y divide-black font-mono text-[13px] tracking-wider uppercase font-semibold">
          {[
            { label: "ABOUT", id: "about" },
            { label: "SERVICES", id: "services" },
            { label: "WORK", id: "projects" },
            { label: "PROCESS", id: "process" },
            { label: "INQUIRY", id: "contact" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className="px-8 py-5 text-neutral-850 hover:text-black hover:bg-black/5 transition-colors border-b border-black last:border-b-0 flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span className="text-xs text-neutral-400">&rarr;</span>
            </a>
          ))}
        </div>

        {/* Footer of the Mobile Menu */}
        <div className="p-8 border-t border-black bg-[#F5F4F0] flex flex-col gap-3">
          {/* View Resume Button */}
          <a
            href="/krishpatel_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center text-xs uppercase tracking-wider font-semibold border border-black py-3 rounded-none hover:opacity-80 transition-all shadow-sm relative overflow-hidden bg-[#F5F4F0] text-black block"
          >
            <div
              className="absolute inset-0 pointer-events-none"
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
            <span className="relative z-10">View Resume</span>
          </a>
          {/* Book Free Demo Button */}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="w-full text-center text-xs uppercase tracking-wider font-semibold border border-black py-3 rounded-none bg-black text-white hover:bg-transparent hover:text-black transition-all shadow-sm block animate-none"
          >
            Book Free Demo
          </a>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-[35] lg:hidden"
        />
      )}
      {/* ================= MAIN ================= */}
      <main className="pt-0 bg-[#F5F4F0] min-h-screen px-4 md:px-6 lg:px-8">
        <div className="border-l border-r border-black bg-[#F5F4F0]">
          {/* ================= TIERRA EDITORIAL HERO SECTION ================= */}
          <section
            id="hero"
            className="w-full border-b border-black bg-[#F5F4F0] text-black"
          >
            {/* Header grid title */}
            <div className="w-full border-b border-black grid grid-cols-12 items-stretch bg-[#F5F4F0]">
              <div className="col-span-12 lg:col-span-6 px-6 py-6 lg:py-10 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-center">
                <h1 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black uppercase leading-none">
                  WEBSITES THAT HELP BUSINESSES GROW.
                </h1>
              </div>
              <div className="col-span-12 md:col-span-7 lg:col-span-4 px-6 py-6 lg:py-10 border-b md:border-b-0 md:border-r border-black flex items-center">
                <p className="text-sm leading-relaxed text-neutral-700 font-outfit">
                  I design and develop fast, reliable websites that help
                  businesses look professional & grow online.
                </p>
              </div>
              <div className="col-span-12 md:col-span-5 lg:col-span-2 flex flex-row items-stretch p-0 bg-[#F5F4F0]">
                {/* Profile Pic Card */}
                <div className="flex-[4] aspect-square md:w-auto md:h-full md:flex-1 md:aspect-auto border-r border-black relative overflow-hidden bg-[#F5F4F0]">
                  <img
                    src="/hero_profile_pic.webp"
                    alt="Krish Patel"
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>
                {/* Social Links */}
                <div className="flex-[1] md:flex-none md:w-12 flex flex-col divide-y divide-black">
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=krishrpatel09@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 w-full md:w-auto md:h-auto md:flex-1 md:aspect-square flex items-center justify-center text-xl text-black hover:bg-black hover:text-white transition-colors bg-[#F5F4F0]"
                    title="Email"
                  >
                    <i className="ri-mail-line"></i>
                  </a>
                  <a
                    href="https://wa.me/9726632563"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 w-full md:w-auto md:h-auto md:flex-1 md:aspect-square flex items-center justify-center text-xl text-black hover:bg-black hover:text-white transition-colors bg-[#F5F4F0]"
                    title="WhatsApp"
                  >
                    <i className="ri-whatsapp-line"></i>
                  </a>
                  <a
                    href="https://instagram.com/krish__2595"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 w-full md:w-auto md:h-auto md:flex-1 md:aspect-square flex items-center justify-center text-xl text-black hover:bg-black hover:text-white transition-colors bg-[#F5F4F0]"
                    title="Instagram"
                  >
                    <i className="ri-instagram-line"></i>
                  </a>
                  <a
                    href="tel:9726632563"
                    className="flex-1 w-full md:w-auto md:h-auto md:flex-1 md:aspect-square flex items-center justify-center text-xl text-black hover:bg-black hover:text-white transition-colors bg-[#F5F4F0]"
                    title="Call"
                  >
                    <i className="ri-phone-line"></i>
                  </a>
                </div>
              </div>
            </div>
            {/* 2-Column Equal 50-50 Width Tierra Showcase */}
            <div className="w-full grid grid-cols-12 items-stretch min-h-[540px] bg-[#F5F4F0]">
              {/* Left Column (50% Width): Intro card & profile info */}
              <div className="col-span-12 lg:col-span-6 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between p-8 lg:p-12 bg-[#F5F4F0]">
                <div>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-syne font-bold text-black leading-tight">
                    Krish Patel,
                  </p>
                  {/* Typewriter animated role */}
                  <div className="mt-1 h-9 flex items-center">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-syne font-bold text-black leading-tight">
                      {typedText}
                    </span>
                    {/* Blinking cursor */}
                    <span
                      className="inline-block w-[2px] h-6 sm:h-7 lg:h-8 bg-black ml-[2px] align-middle"
                      style={{ animation: "blink 0.75s step-end infinite" }}
                    />
                  </div>
                  {/* Availability badge */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-black/20 bg-black/5 text-[10px] font-mono font-bold uppercase tracking-widest text-black">
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "linear-gradient(135deg, #A8D4E8 0%, #B4D8E8 40%, #C0EAA8 70%, #A8D4E8 100%)", animation: "blink 1.5s step-end infinite" }} />
                      Available For Freelance
                    </span>
                  </div>

                </div>
                <div className="mt-8 pt-6 border-t border-neutral-300">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                    STATUS
                  </span>
                  <p className="text-xs font-mono font-bold text-black uppercase">
                    AVAILABLE FOR NEW FREELANCE & INCUBATION PROJECTS
                  </p>
                  <p className="text-xs font-mono text-neutral-500 mt-2 uppercase tracking-wider">
                    DEVELOPER @ WEB AARC LABS
                  </p>
                </div>
              </div>
              {/* Right Column (50% Width): Tierra Map Canvas */}
              <div className="col-span-12 lg:col-span-6 relative h-[460px] lg:h-auto lg:min-h-[480px]">
                <MapCanvas
                  activeProject={activeHeroProject}
                  projects={projectsData}
                  onSelectProject={(p) => setActiveHeroProject(p)}
                />
              </div>
            </div>
          </section>
          {/* ================= ULTRA CLEAN 50-50 ABOUT SECTION (#about) ================= */}
          <section
            id="about"
            className="w-full border-b border-black bg-[#F5F4F0] text-black scroll-mt-16"
          >
            <div className="w-full grid grid-cols-12 items-stretch">
              {/* Left 50% Column (Clean, top aligned) */}
              <div className="col-span-12 lg:col-span-6 px-8 py-16 lg:p-14 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-start bg-[#F5F4F0]">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-4">
                    02 / ABOUT ME
                  </span>
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-extrabold uppercase tracking-tight text-black leading-[0.95]">
                    BUILD WITH INTENTION.
                  </h2>
                </div>
              </div>
              {/* Right 50% Column */}
              <div className="col-span-12 lg:col-span-6 px-8 py-16 lg:p-14 flex flex-col justify-between bg-[#F5F4F0]">
                <div className="space-y-6">
                  <p className="text-lg sm:text-2xl font-syne font-bold uppercase text-black leading-snug">
                    I'm Krish Patel, a full-stack developer focused on building
                    performant, production-ready web applications. My work spans
                    product development, client engagements, and independent
                    ventures with an emphasis on clean architecture, scalability,
                    and measurable outcomes.
                  </p>
                  <div className="w-12 h-[1px] bg-black"></div>
                  <p className="text-sm sm:text-base font-outfit text-neutral-700 leading-relaxed font-normal">
                    I approach every project the same way: understand the problem
                    deeply, build with intention, and ship something that actually
                    performs.
                  </p>
                </div>
                <div className="pt-6 border-t border-neutral-300 mt-10 flex items-center justify-start">
                  <a
                    href="/krishpatel_resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-black font-syne font-bold uppercase tracking-wider text-xs text-black bg-[#F5F4F0] transition-colors duration-300 hover:bg-black/5"
                  >
                    <span>View Resume</span>
                    <span className="text-sm"> </span>
                  </a>
                </div>
              </div>
            </div>
          </section>
          {/* ================= TIERRA EDITORIAL TECH STACK SECTION (#tech-stack) ================= */}
          <section
            id="tech-stack"
            className="w-full border-b border-black bg-[#F5F4F0] text-black"
          >
            {/* Top Header Grid Strip (Same UI as About Section Heading) */}
            <div className="w-full border-b border-black px-8 py-16 lg:px-14 lg:py-24 bg-[#F5F4F0]">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-4">
                03 / TECH STACK
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-extrabold uppercase tracking-tight text-black leading-[0.95]">
                WHAT I BUILD WITH.
              </h2>
            </div>
            {/* 5 Cards in 1 Row (5 Columns), Shared 1px Black Border, Zero Gap */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-5 items-stretch bg-[#F5F4F0] border-b border-black">
              {[
                {
                  category: "01 / FRONTEND",
                  items: [
                    { name: "HTML", icon: "https://skillicons.dev/icons?i=html" },
                    { name: "CSS", icon: "https://skillicons.dev/icons?i=css" },
                    {
                      name: "JavaScript",
                      icon: "https://skillicons.dev/icons?i=js",
                    },
                    {
                      name: "TypeScript",
                      icon: "https://skillicons.dev/icons?i=ts",
                    },
                    {
                      name: "React",
                      icon: "https://skillicons.dev/icons?i=react",
                    },
                    {
                      name: "Next.js",
                      icon: "https://skillicons.dev/icons?i=nextjs",
                    },
                    {
                      name: "Tailwind CSS",
                      icon: "https://skillicons.dev/icons?i=tailwind",
                    },
                    {
                      name: "Framer Motion",
                      icon: "https://cdn.simpleicons.org/framer",
                    },
                    {
                      name: "GSAP",
                      icon: "https://cdn.simpleicons.org/greensock",
                    },
                  ],
                },
                {
                  category: "02 / BACKEND",
                  items: [
                    {
                      name: "Node.js",
                      icon: "https://skillicons.dev/icons?i=nodejs",
                    },
                    {
                      name: "Express.js",
                      icon: "https://skillicons.dev/icons?i=express",
                    },
                    {
                      name: "Python",
                      icon: "https://skillicons.dev/icons?i=python",
                    },
                    {
                      name: "MongoDB",
                      icon: "https://skillicons.dev/icons?i=mongodb",
                    },
                    {
                      name: "Firebase",
                      icon: "https://skillicons.dev/icons?i=firebase",
                    },
                  ],
                },
                {
                  category: "03 / HARDWARE / IOT",
                  items: [
                    {
                      name: "Arduino",
                      icon: "https://skillicons.dev/icons?i=arduino",
                    },
                    {
                      name: "ESP32",
                      icon: "https://cdn.simpleicons.org/espressif",
                    },
                    {
                      name: "Raspberry Pi",
                      icon: "https://skillicons.dev/icons?i=raspberrypi",
                    },
                  ],
                },
                {
                  category: "04 / DESIGN & UI-UX",
                  items: [
                    {
                      name: "Figma",
                      icon: "https://skillicons.dev/icons?i=figma",
                    },
                    {
                      name: "Adobe XD",
                      icon: "https://skillicons.dev/icons?i=xd",
                    },
                    { name: "Wireframing", isTextBadge: true, label: "UI/WIRE" },
                    { name: "Prototyping", isTextBadge: true, label: "UX/PROTO" },
                  ],
                },
                {
                  category: "05 / TOOLS & DEVOPS",
                  items: [
                    { name: "Git", icon: "https://skillicons.dev/icons?i=git" },
                    {
                      name: "GitHub",
                      icon: "https://skillicons.dev/icons?i=github",
                    },
                    {
                      name: "Docker",
                      icon: "https://skillicons.dev/icons?i=docker",
                    },
                    {
                      name: "Postman",
                      icon: "https://skillicons.dev/icons?i=postman",
                    },
                    {
                      name: "Vercel",
                      icon: "https://skillicons.dev/icons?i=vercel",
                    },
                  ],
                },
              ].map((sec, idx) => (
                <div
                  key={sec.category}
                  className={`flex flex-col justify-between p-6 bg-[#F5F4F0] border-b last:border-b-0 lg:border-b-0 border-black ${idx < 4 ? "lg:border-r" : ""
                    }`}
                >
                  <div>
                    <div className="border-b border-black pb-3 mb-4 flex items-center justify-between">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-black">
                        {sec.category}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">
                        {sec.items.length}
                      </span>
                    </div>
                    <div className="w-full border border-black divide-y divide-black">
                      {sec.items.map((item) => (
                        <div
                          key={item.name}
                          className="p-3 bg-white flex items-center space-x-3"
                        >
                          {item.isTextBadge ? (
                            <div className="w-7 h-7 rounded-full border border-black flex items-center justify-center text-[8px] font-mono font-bold bg-[#F5F4F0] text-black shrink-0">
                              {item.label}
                            </div>
                          ) : (
                            <div className="w-7 h-7 flex items-center justify-center shrink-0">
                              <img
                                src={item.icon}
                                alt={item.name}
                                className="max-w-full max-h-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-black truncate">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Seamless Bottom Aspirational Strip: Interested In / Learning Next with Mesh Gradient */}
            <div className="w-full p-8 lg:p-12 relative overflow-hidden bg-[#F5F4F0]">
              <div
                className="absolute inset-0 pointer-events-none"
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
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-black/80 font-bold block mb-1">
                      ASPIRATIONAL ROADMAP
                    </span>
                    <h4 className="font-syne text-xl sm:text-2xl font-extrabold uppercase text-black">
                      INTERESTED IN / LEARNING NEXT
                    </h4>
                  </div>
                  <span className="text-xs font-mono px-3.5 py-1.5 bg-black text-white font-bold uppercase self-start sm:self-auto border border-black shadow-sm">
                    Future Stack
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {["LangChain", "RAG", "AI Agents", "TinyML"].map((tech) => (
                    <div
                      key={tech}
                      className="p-4 border border-black bg-white/95 flex items-center justify-center space-x-2 text-center shadow-sm"
                    >
                      <span className="text-xs font-mono text-black font-bold">
                        {" "}
                      </span>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* ================= HOVER PREVIEW CLICK OPEN PROJECTS SECTION (#projects) ================= */}
          <HoverPreviewClickOpenProjectsSection projects={projectsData} />
          {/* ================= OUR SERVICES SECTION (#services) ================= */}
          <section
            id="services"
            className="w-full max-md:border-b-0 border-b border-black bg-[#F5F4F0] text-black scroll-mt-16"
          >
            {/* Header same pattern as all other sections */}
            <div className="w-full border-b border-black px-8 py-16 lg:px-14 lg:py-24 bg-[#F5F4F0] flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-4">
                  05 / SERVICES
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-extrabold uppercase tracking-tight text-black leading-[0.95]">
                  Our Services.
                </h2>
              </div>
            </div>
            {/* 5 Cards in 1 Row same as tech stack layout */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-5 items-stretch">
              {[
                {
                  num: "01",
                  title: "Landing Pages",
                  desc: "One-page websites designed to get quick calls, WhatsApp inquiries, and customer leads.",
                  tag: "Lead Gen",
                },
                {
                  num: "02",
                  title: "Business Sites",
                  desc: "Multi-page websites that build trust and make your business look professional online.",
                  tag: "Branding",
                },
                {
                  num: "03",
                  title: "Redesign",
                  desc: "Upgrade your existing website to improve design, speed, and mobile experience.",
                  tag: "Revamp",
                },
                {
                  num: "04",
                  title: "Consultation",
                  desc: "Honest advice on what type of website your business actually needs.",
                  tag: "Strategy",
                },
              ].map((service, idx) => (
                <div
                  key={service.num}
                  className={`flex flex-col justify-between p-6 lg:p-8 min-h-[300px] bg-[#F5F4F0] border-black border-b lg:border-b-0 ${idx < 3 ? "lg:border-r" : ""}`}
                >
                  {/* Number */}
                  <div className="border-b border-black pb-3 mb-5 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold tracking-widest text-black">
                      {service.num} /
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                      {service.tag}
                    </span>
                  </div>
                  {/* Title + Desc */}
                  <div className="flex-1">
                    <h3 className="font-syne text-lg sm:text-xl lg:text-2xl font-extrabold uppercase tracking-tight mb-3 leading-[0.95]">
                      {service.title}
                    </h3>
                    <p className="text-sm font-outfit text-black/55 leading-relaxed font-medium">
                      {service.desc}
                    </p>
                  </div>
                </div>
              ))}
              <a
                href="https://wa.me/9726632563"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-between p-6 lg:p-8 min-h-[300px] border-black border-b lg:border-b-0 lg:border-r-0 cursor-pointer relative overflow-hidden bg-[#F5F4F0]"
              >
                <div
                  className="absolute inset-0 pointer-events-none"
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
                <div className="relative z-10 flex flex-col justify-between h-full w-full">
                  <div className="border-b border-black/30 pb-3 mb-5 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold tracking-widest text-black/50">
                      05 /
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-black/40">
                      CTA
                    </span>
                  </div>

                  <div className="flex-1 mb-6">
                    <h3 className="font-syne text-lg sm:text-xl lg:text-2xl font-extrabold uppercase tracking-tight mb-3 leading-[0.95] text-black">
                      Let's Build.
                    </h3>
                    <p className="text-sm font-outfit text-black/70 leading-relaxed font-medium">
                      Have a custom request or ready to start? Talk to us today on WhatsApp to get your project moving.
                    </p>
                  </div>

                  <div>
                    <span className="inline-flex items-center space-x-2 px-6 py-3 border border-black bg-[#F5F4F0] text-xs font-mono font-bold uppercase tracking-wider text-black transition-colors duration-300 hover:bg-neutral-300">
                      <span>Talk on WhatsApp</span>
                      <span>&#x2197;</span>
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </section>
          {/* ================= HOW WE WORK PROCESS SECTION (#process) ================= */}
          <section
            id="process"
            className="w-full border-b border-black bg-[#F5F4F0] text-black scroll-mt-16"
          >
            <div className="w-full grid grid-cols-12 items-stretch">
              {/* LEFT Big heading, same as About Me */}
              <div className="col-span-12 lg:col-span-6 px-8 py-16 lg:p-14 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-start bg-[#F5F4F0]">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-4">
                    06 / PROCESS
                  </span>
                  <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-extrabold uppercase tracking-tight text-black leading-[0.95]">
                    HOW WE WORK.
                  </h2>
                </div>
              </div>
              {/* RIGHT 5 process steps */}
              <div className="col-span-12 lg:col-span-6 px-8 py-16 lg:p-14 flex flex-col justify-between bg-[#F5F4F0]">
                <div className="space-y-6">
                  {[
                    {
                      phase: "Phase_001",
                      title: "STRATEGY",
                      desc: "We understand your business goals and plan the right website approach.",
                      status: "In_Progress",
                    },
                    {
                      phase: "Phase_002",
                      title: "FREE DEMO",
                      desc: "I create a basic demo website using your business details.",
                      status: "In_Progress",
                    },
                    {
                      phase: "Phase_003",
                      title: "ADVANCE",
                      desc: "Once you like the demo, a small advance confirms the project.",
                      status: "In_Progress",
                    },
                    {
                      phase: "Phase_004",
                      title: "PREVIEW",
                      desc: "You receive a full preview link to review content and layout.",
                      status: "In_Progress",
                    },
                    {
                      phase: "Phase_005",
                      title: "PAYMENT",
                      desc: "After your approval, the remaining payment is completed.",
                      status: "In_Progress",
                    },
                    {
                      phase: "Phase_006",
                      title: "LAUNCH",
                      desc: "Your website is published and connected to your domain.",
                      status: "Ready",
                    },
                  ].map((step, idx, arr) => (
                    <div key={step.title}>
                      <h3 className="text-lg font-syne font-extrabold uppercase tracking-tight text-black mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm font-outfit text-neutral-600 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                      {idx < arr.length - 1 && (
                        <div className="mt-6 w-full h-[1px] bg-black/10" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-neutral-300 mt-10 flex items-center justify-start">
                  <a
                    href="https://wa.me/9726632563"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-black font-syne font-bold uppercase tracking-wider text-xs text-black transition-all duration-300 hover:scale-105 relative overflow-hidden bg-[#F5F4F0]"
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
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
                    <span className="relative z-10">Talk on WhatsApp</span>
                    <span className="text-sm relative z-10"> </span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ================= TESTIMONIALS SECTION (#testimonials) ================= */}
          {/* ================= TESTIMONIALS SECTION (#testimonials) ================= */}
          <section id="testimonials" className="w-full border-b border-black bg-[#F5F4F0] text-black scroll-mt-16">
            {/* Top Header Strip — Full Width (Original Layout) */}
            <div className="w-full border-b border-black px-8 py-16 lg:px-14 lg:py-24 bg-[#F5F4F0]">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-4">
                {"\u2022"} 07 / TESTIMONIALS
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-extrabold uppercase tracking-tight text-black leading-[0.95]">
                WHAT CLIENTS SAY.
              </h2>
            </div>

            {/* 2-Part Content Area */}
            <div className="w-full grid grid-cols-12 items-stretch">
              {/* LEFT PART: Total Review Stats & Slider Controls positioned at the bottom */}
              <div className="col-span-12 lg:col-span-6 p-6 sm:p-8 lg:p-14 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between bg-[#F5F4F0]">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-4">
                    OVERALL RATING
                  </span>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-6xl font-syne font-black text-black">5.0</span>
                    <div className="flex flex-col">
                      <div className="flex text-lg">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <i
                            key={s}
                            className="ri-star-fill"
                            style={{
                              background: "linear-gradient(135deg, #3B82F6, #34D399)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-500 mt-1">6 CLIENT REVIEWS</span>
                    </div>
                  </div>
                  <p className="text-sm font-outfit text-neutral-600 leading-relaxed font-normal max-w-sm mt-6">
                    100% satisfaction rating across design excellence, modular clean code, transparent communication, and fast turnaround speeds.
                  </p>
                </div>

                {/* Navigation Controls positioned between Left and Right parts border */}
                <div className="mt-12 flex flex-col gap-6 border-t border-black/10 pt-8">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-black/40 uppercase tracking-widest font-bold">
                      {((currentTestimonialIndex) % 6 + 6) % 6 + 1} / 6
                    </span>
                    <div className="flex border border-black divide-x divide-black bg-[#F5F4F0]">
                      <button
                        onClick={() =>
                          setCurrentTestimonialIndex((prev) => prev - 1)
                        }
                        className="px-6 py-3 hover:bg-black/5 transition-colors font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        PREV
                      </button>
                      <button
                        onClick={() =>
                          setCurrentTestimonialIndex((prev) => prev + 1)
                        }
                        className="px-6 py-3 hover:bg-black/5 transition-colors font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        NEXT
                      </button>
                    </div>
                  </div>

                  {/* Navigation Dots */}
                  <div className="flex items-center gap-2 mt-2">
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const isActive = (((currentTestimonialIndex) % 6 + 6) % 6) === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            // Find closest matching index to prevent large jump animations
                            const diff = idx - (((currentTestimonialIndex) % 6 + 6) % 6);
                            setCurrentTestimonialIndex((prev) => prev + diff);
                          }}
                          className={`w-2.5 h-2.5 border border-black transition-all duration-300 ${isActive ? "bg-black scale-110" : "bg-transparent"}`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT PART: Testimonial slider (Infinite looping enabled) */}
              <div className="col-span-12 lg:col-span-6 relative overflow-hidden bg-[#F5F4F0] p-4 sm:p-8 lg:p-14 flex items-center">
                <div
                  className="flex transition-transform duration-500 ease-in-out gap-6 w-full max-md:cursor-grab max-md:active:cursor-grabbing"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    transform: `translateX(calc(-${(currentTestimonialIndex) * 300}px - ${(currentTestimonialIndex) * 24}px))`,
                  }}
                  onTransitionEnd={() => {
                    // If we slide past the original bounds, snap instantly to the real index
                    const count = 6;
                    const normalized = ((currentTestimonialIndex) % count + count) % count;
                    if (currentTestimonialIndex < 0 || currentTestimonialIndex >= count) {
                      // Temporarily disable transition style before snapping?
                      // Direct state change is standard for simple setups
                      setCurrentTestimonialIndex(normalized);
                    }
                  }}
                >
                  {/* Clone set before, real set, clone set after for infinite loop scroll padding */}
                  {[
                    ...[
                      {
                        quote: "Working with Krish was a great experience. The website was modern, fast, and exactly what our business needed. Communication was smooth, and every revision was handled quickly.",
                        name: "Sarah Mitchell",
                        role: "Founder, Bloom Studio",
                      },
                      {
                        quote: "Our website looks premium and performs flawlessly across all devices. The attention to detail and clean UI exceeded our expectations.",
                        name: "Daniel Carter",
                        role: "Marketing Manager, Nexa Solutions",
                      },
                      {
                        quote: "From design to deployment, everything was handled professionally. The final product helped improve our online presence and customer engagement.",
                        name: "Emma Rodriguez",
                        role: "Owner, Urban Café",
                        isGradient: true,
                      },
                      {
                        quote: "Krish transformed our ideas into a beautiful, responsive website. The loading speed, animations, and user experience are excellent.",
                        name: "James Wilson",
                        role: "CEO, BrightTech",
                      },
                      {
                        quote: "The project was delivered on time with exceptional quality. We appreciated the clear communication and willingness to go the extra mile.",
                        name: "Olivia Brown",
                        role: "Co-Founder, Elevate Agency",
                      },
                      {
                        quote: "Highly recommended! The website is clean, SEO-friendly, and easy to manage. We've already received positive feedback from our customers.",
                        name: "Michael Anderson",
                        role: "Director, Horizon Media",
                      },
                    ],
                    ...[
                      {
                        quote: "Working with Krish was a great experience. The website was modern, fast, and exactly what our business needed. Communication was smooth, and every revision was handled quickly.",
                        name: "Sarah Mitchell",
                        role: "Founder, Bloom Studio",
                      },
                      {
                        quote: "Our website looks premium and performs flawlessly across all devices. The attention to detail and clean UI exceeded our expectations.",
                        name: "Daniel Carter",
                        role: "Marketing Manager, Nexa Solutions",
                      },
                      {
                        quote: "From design to deployment, everything was handled professionally. The final product helped improve our online presence and customer engagement.",
                        name: "Emma Rodriguez",
                        role: "Owner, Urban Café",
                        isGradient: true,
                      },
                      {
                        quote: "Krish transformed our ideas into a beautiful, responsive website. The loading speed, animations, and user experience are excellent.",
                        name: "James Wilson",
                        role: "CEO, BrightTech",
                      },
                      {
                        quote: "The project was delivered on time with exceptional quality. We appreciated the clear communication and willingness to go the extra mile.",
                        name: "Olivia Brown",
                        role: "Co-Founder, Elevate Agency",
                      },
                      {
                        quote: "Highly recommended! The website is clean, SEO-friendly, and easy to manage. We've already received positive feedback from our customers.",
                        name: "Michael Anderson",
                        role: "Director, Horizon Media",
                      },
                    ],
                    ...[
                      {
                        quote: "Working with Krish was a great experience. The website was modern, fast, and exactly what our business needed. Communication was smooth, and every revision was handled quickly.",
                        name: "Sarah Mitchell",
                        role: "Founder, Bloom Studio",
                      },
                      {
                        quote: "Our website looks premium and performs flawlessly across all devices. The attention to detail and clean UI exceeded our expectations.",
                        name: "Daniel Carter",
                        role: "Marketing Manager, Nexa Solutions",
                      },
                      {
                        quote: "From design to deployment, everything was handled professionally. The final product helped improve our online presence and engagement.",
                        name: "Emma Rodriguez",
                        role: "Owner, Urban Café",
                        isGradient: true,
                      },
                      {
                        quote: "Krish transformed our ideas into a beautiful, responsive website. The loading speed, animations, and user experience are excellent.",
                        name: "James Wilson",
                        role: "CEO, BrightTech",
                      },
                      {
                        quote: "The project was delivered on time with exceptional quality. We appreciated the clear communication and willingness to go the extra mile.",
                        name: "Olivia Brown",
                        role: "Co-Founder, Elevate Agency",
                      },
                      {
                        quote: "Highly recommended! The website is clean, SEO-friendly, and easy to manage. We've already received positive feedback from our customers.",
                        name: "Michael Anderson",
                        role: "Director, Horizon Media",
                      },
                    ]
                  ].map((t, idx) => (
                    <div
                      key={`${t.name}-${idx}`}
                      className="w-[300px] shrink-0 flex flex-col justify-between p-8 min-h-[320px] border border-black shadow-sm relative overflow-hidden"
                      style={{ backgroundColor: "#F5F4F0" }}
                    >
                      {t.isGradient && (
                        <div
                          className="absolute inset-0 pointer-events-none"
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
                      )}
                      {/* Quote content */}
                      <div className="relative z-10">
                        <span className="text-4xl font-syne font-black text-black/20 leading-none block mb-3">"</span>
                        <p className="text-sm font-outfit text-black/90 leading-relaxed font-medium">
                          {t.quote}
                        </p>
                      </div>
                      {/* Attribution */}
                      <div className="mt-8 pt-5 border-t border-black/10 relative z-10">
                        <p className="text-lg font-syne font-extrabold uppercase tracking-tight text-black">
                          {t.name}
                        </p>
                        <p className="text-xs font-mono text-black/50 uppercase tracking-widest mt-1">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ================= FAQ SECTION (#faq) ================= */}
          <section id="faq" className="w-full border-b border-black bg-[#F5F4F0] text-black scroll-mt-16">
            <div className="w-full grid grid-cols-12 items-stretch">

              {/* LEFT COLUMN: Section Title */}
              <div className="col-span-12 lg:col-span-6 px-8 py-16 lg:p-14 border-b lg:border-b-0 lg:border-r border-black bg-[#F5F4F0]">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-4">
                  {"\u2022"} 08 / FAQ
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-extrabold uppercase tracking-tight text-black leading-[0.95]">
                  COMMON QUESTIONS.
                </h2>
              </div>

              {/* RIGHT COLUMN: FAQ Accordion items */}
              <div className="col-span-12 lg:col-span-6 bg-[#F5F4F0] divide-y divide-black">
                {[
                  {
                    num: "01",
                    q: "What's the turnaround time?",
                    a: "Most landing pages take 3-5 days. Business websites typically take 1-2 weeks depending on scope."
                  },
                  {
                    num: "02",
                    q: "How many revisions do I get?",
                    a: "Two rounds of revisions are included in every project before final delivery to ensure you're completely satisfied."
                  },
                  {
                    num: "03",
                    q: "Do you handle hosting and domain?",
                    a: "Yes — I can set it up for you completely, or work with your existing hosting/domain if you already have one."
                  },
                  {
                    num: "04",
                    q: "What's the payment structure?",
                    a: "50% advance to start the project, and the remaining 50% on completion before final code handover and launch."
                  },
                  {
                    num: "05",
                    q: "Will my website be mobile-friendly and optimized for SEO?",
                    a: "Absolutely. Every site is built mobile-first, load-speed optimized (scoring 95+ on Lighthouse), and structured with clean semantic markup for search engines."
                  },
                  {
                    num: "06",
                    q: "Do you offer custom designs or templates?",
                    a: "All projects are fully custom-built from scratch. I do not use generic page builders or repetitive templates, ensuring your site stands out."
                  }
                ].map((faq) => {
                  const isOpen = openFaqId === faq.num;
                  return (
                    <div key={faq.num} className="w-full border-black">
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : faq.num)}
                        className="w-full flex items-center justify-between p-6 sm:p-8 lg:p-10 text-left cursor-pointer select-none outline-none hover:bg-black/5 transition-colors"
                      >
                        <span className="text-lg font-syne font-extrabold uppercase tracking-tight text-black">
                          {faq.q}
                        </span>
                        <span className={`text-xl font-mono font-bold transition-transform duration-300 text-black shrink-0 ml-4 ${isOpen ? "rotate-45" : ""}`}>
                          +
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8">
                          <p className="text-sm font-outfit text-neutral-600 leading-relaxed font-normal">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ================= CONTACT SECTION (#contact) ================= */}
          <section id="contact" className="w-full bg-[#F5F4F0] text-black scroll-mt-16">
            {/* Top Header Strip */}
            <div className="w-full border-b border-black px-8 py-16 lg:px-14 lg:py-24 bg-[#F5F4F0]">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-4">
                09 / CONTACT
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-extrabold uppercase tracking-tight text-black leading-[0.95]">
                LET'S BUILD SOMETHING GREAT.
              </h2>
            </div>

            {/* Two-column contact info */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-stretch">
              {/* FOR RECRUITERS / HIRING */}
              <div className="p-8 lg:p-14 border-b lg:border-b-0 lg:border-r border-black flex flex-col gap-8 relative overflow-hidden bg-[#F5F4F0]">
                <div
                  className="absolute inset-0 pointer-events-none"
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
                <div className="relative z-10">
                  <span className="text-xs font-mono uppercase tracking-widest text-black font-bold block mb-6">
                    FOR RECRUITERS / HIRING
                  </span>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-black uppercase tracking-widest block mb-1">EMAIL</span>
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=krishrpatel09@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-mono font-bold text-black hover:text-black/80 transition-colors"
                      >
                        krishrpatel09@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <a
                        href="/krishpatel_resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-black bg-[#F5F4F0] font-syne font-bold uppercase tracking-wider text-xs text-black transition-colors duration-300 hover:bg-neutral-300"
                      >
                        <span>View Resume</span>
                        <span>&rarr;</span>
                      </a>
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                      <a
                        href="https://linkedin.com/in/krishrpatel25"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-black/80 transition-colors"
                      >
                        LinkedIn
                      </a>
                      <span className="text-black">·</span>
                      <a
                        href="https://github.com/krishrpatel25"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-black/80 transition-colors"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOR CLIENTS / PROJECTS */}
              <div className="p-8 lg:p-14 flex flex-col justify-between gap-8">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-6">
                    FOR CLIENTS / PROJECTS
                  </span>
                  <div className="space-y-6 mb-8">
                    <a
                      href="https://wa.me/9726632563"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-black bg-[#F5F4F0] font-syne font-bold uppercase tracking-wider text-xs text-black transition-colors duration-300 hover:bg-neutral-300"
                    >
                      <span>Talk on WhatsApp</span>
                      <span>&rarr;</span>
                    </a>
                    <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                      Based in Ahmedabad, IN. Available Worldwide.
                    </p>
                  </div>

                  {/* Form inside Clients Column */}
                  <div className="border-t border-black/10 pt-8">
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-6">
                      SEND A MESSAGE
                    </span>
                    {formStatus === "success" ? (
                      <div className="py-10 flex flex-col items-start gap-3">
                        <i className="ri-check-circle-line text-4xl text-black"></i>
                        <p className="text-sm font-syne font-bold uppercase tracking-wider text-black">
                          Message sent successfully!
                        </p>
                        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                          I'll get back to you within 24 hours.
                        </p>
                        <button
                          onClick={() => setFormStatus("idle")}
                          className="mt-4 text-xs font-mono font-bold uppercase tracking-wider text-black underline underline-offset-4 hover:text-neutral-500 transition-colors cursor-pointer"
                        >
                          Send another message
                        </button>
                      </div>
                    ) : (
                    <form
                      onSubmit={handleFormSubmit}
                      noValidate
                      className="space-y-6"
                    >
                      {/* Name */}
                      <div className="relative">
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder="NAME *"
                          className={`w-full bg-transparent border-b pb-2 text-xs font-mono uppercase tracking-wider text-black placeholder-neutral-400 focus:outline-none transition-colors ${formErrors.name ? "border-red-500" : "border-black/30 focus:border-black"}`}
                        />
                        {formErrors.name && (
                          <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider mt-1 block">{formErrors.name}</span>
                        )}
                      </div>
                      {/* Email */}
                      <div className="relative">
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="EMAIL ADDRESS *"
                          className={`w-full bg-transparent border-b pb-2 text-xs font-mono uppercase tracking-wider text-black placeholder-neutral-400 focus:outline-none transition-colors ${formErrors.email ? "border-red-500" : "border-black/30 focus:border-black"}`}
                        />
                        {formErrors.email && (
                          <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider mt-1 block">{formErrors.email}</span>
                        )}
                      </div>
                      {/* Mobile */}
                      <div className="relative">
                        <input
                          id="contact-mobile"
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleFormChange}
                          placeholder="MOBILE NUMBER *"
                          className={`w-full bg-transparent border-b pb-2 text-xs font-mono uppercase tracking-wider text-black placeholder-neutral-400 focus:outline-none transition-colors ${formErrors.mobile ? "border-red-500" : "border-black/30 focus:border-black"}`}
                        />
                        {formErrors.mobile && (
                          <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider mt-1 block">{formErrors.mobile}</span>
                        )}
                      </div>
                      {/* Project Type */}
                      <div className="relative">
                        <select
                          id="contact-project-type"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleFormChange}
                          className={`w-full bg-transparent border-b pb-2 text-xs font-mono uppercase tracking-wider focus:outline-none transition-colors appearance-none cursor-pointer ${formErrors.projectType ? "border-red-500 text-red-400" : "border-black/30 focus:border-black text-neutral-400"} ${formData.projectType ? "text-black" : ""}`}
                        >
                          <option value="">PROJECT TYPE *</option>
                          <option value="landing">Landing Page</option>
                          <option value="business">Business Website</option>
                          <option value="redesign">Redesign</option>
                          <option value="consultation">Consultation</option>
                        </select>
                        <span className="absolute right-0 top-1.5 pointer-events-none text-neutral-500 text-xs">&darr;</span>
                        {formErrors.projectType && (
                          <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider mt-1 block">{formErrors.projectType}</span>
                        )}
                      </div>
                      {/* Brief about project (optional) */}
                      <div className="relative">
                        <textarea
                          id="contact-brief"
                          name="brief"
                          value={formData.brief}
                          onChange={handleFormChange}
                          placeholder="BRIEF ABOUT YOUR PROJECT (OPTIONAL)"
                          rows={3}
                          className="w-full bg-transparent border-b border-black/30 pb-2 text-xs font-mono uppercase tracking-wider text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors resize-none"
                        />
                      </div>

                      {/* Error banner */}
                      {formStatus === "error" && (
                        <p className="text-[10px] font-mono text-red-500 uppercase tracking-wider">
                          Something went wrong. Please try again or email me directly.
                        </p>
                      )}

                      {/* Submit */}
                      <div className="pt-2 flex items-center gap-4">
                        <button
                          id="contact-submit"
                          type="submit"
                          disabled={formStatus === "submitting"}
                          className="px-6 py-2.5 border border-black bg-[#F5F4F0] text-black font-syne font-bold uppercase tracking-wider text-xs transition-colors duration-300 hover:bg-neutral-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {formStatus === "submitting" ? "SENDING..." : "SUBMIT"}
                        </button>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">* Required</span>
                      </div>
                    </form>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div >
      </main >

      <footer className="w-full border-t border-black bg-[#F5F4F0] pt-16 pb-10 px-4 sm:px-8 lg:px-14">
        <div className="px-0 sm:px-6 lg:px-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 border-b border-black pb-16">
            <div>
              <a
                href="#hero"
                className="font-syne text-xl sm:text-2xl font-bold tracking-tight text-black lowercase flex items-center gap-1.5 mb-4"
              >
                web aarc<span className="text-neutral-400">.</span>
              </a>
              <p className="text-sm font-outfit text-black font-semibold max-w-xs uppercase tracking-tight">
                Krish Patel — Web Developer
              </p>
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-4">
                QUICK LINKS
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {[
                  { label: "About", href: "#about" },
                  { label: "Tech Stack", href: "#tech-stack" },
                  { label: "Work", href: "#projects" },
                  { label: "Services", href: "#services" },
                  { label: "Contact", href: "#contact" }
                ].map((link, idx, arr) => (
                  <span key={link.href} className="text-sm font-mono font-bold uppercase tracking-wider text-black flex items-center">
                    <a href={link.href} className="hover:text-neutral-500 transition-colors">
                      {link.label}
                    </a>
                    {idx < arr.length - 1 && <span className="text-neutral-300 ml-3">&middot;</span>}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-4">
                CONNECT
              </span>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://github.com/krishrpatel25"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono font-bold uppercase tracking-wider text-black hover:text-neutral-500 transition-colors"
                  >
                    GitHub
                  </a>
                  <span className="text-neutral-300">&middot;</span>
                  <a
                    href="https://linkedin.com/in/krishrpatel25"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono font-bold uppercase tracking-wider text-black hover:text-neutral-500 transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
                {/* 4 Social Icon Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=krishrpatel09@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-black flex items-center justify-center text-lg text-black hover:bg-black hover:text-white transition-all duration-300 bg-[#F5F4F0]"
                    title="Email"
                  >
                    <i className="ri-mail-line"></i>
                  </a>
                  <a
                    href="https://wa.me/9726632563"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-black flex items-center justify-center text-lg text-black hover:bg-black hover:text-white transition-all duration-300 bg-[#F5F4F0]"
                    title="WhatsApp"
                  >
                    <i className="ri-whatsapp-line"></i>
                  </a>
                  <a
                    href="https://instagram.com/krish__2595"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-black flex items-center justify-center text-lg text-black hover:bg-black hover:text-white transition-all duration-300 bg-[#F5F4F0]"
                    title="Instagram"
                  >
                    <i className="ri-instagram-line"></i>
                  </a>
                  <a
                    href="tel:9726632563"
                    className="w-10 h-10 border border-black flex items-center justify-center text-lg text-black hover:bg-black hover:text-white transition-all duration-300 bg-[#F5F4F0]"
                    title="Call"
                  >
                    <i className="ri-phone-line"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-xs font-mono text-black/60 uppercase tracking-wider">
              Based in Ahmedabad, IN. Available Worldwide.
            </span>
            <span className="text-xs font-mono text-black/40 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Web Aarc Labs. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
function HoverPreviewClickOpenProjectsSection({ projects }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [openId, setOpenId] = useState(null);
  const signatureMultiColorGradient =
    "bg-[radial-gradient(at_top_left,#FFA3C5_0%,transparent_55%),radial-gradient(at_bottom_left,#6C7CFF_0%,transparent_55%),radial-gradient(at_top_right,#7B8CFF_0%,transparent_55%),radial-gradient(at_bottom_right,#FFD56B_0%,transparent_55%),linear-gradient(to_bottom_right,#FFB295,#F8B06C)]";
  return (
    <section
      id="projects"
      className="w-full border-b border-black bg-[#F5F4F0] text-black scroll-mt-16"
    >
      {/* Top Header Strip */}
      <div className="w-full border-b border-black px-8 py-16 lg:px-14 lg:py-24 bg-[#F5F4F0]">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-4">
          {"•"} 04 / SELECTED WORK
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-extrabold uppercase tracking-tight text-black leading-[0.95]">
          FEATURED PROJECTS.
        </h2>
      </div>
      {/* Stacked Project Strips */}
      <div
        className="w-full bg-[#F5F4F0] divide-y divide-black"
        onMouseLeave={() => setHoveredId(null)}
      >
        {projects.map((project, idx) => {
          const isHovered = hoveredId === project.id;
          const isOpen = openId === project.id;
          const showMiddleHoverImage = isHovered && !isOpen;
          return (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              className="w-full bg-[#F5F4F0] overflow-hidden"
            >
              {/* Project Strip Header Bar */}
              <button
                onClick={() => setOpenId(isOpen ? null : project.id)}
                className={`w-full grid grid-cols-12 items-stretch text-left cursor-pointer bg-[#F5F4F0] text-black transition-all duration-300 ${showMiddleHoverImage ? "h-28 lg:h-32" : "h-20 lg:h-24"
                  }`}
              >
                {/* Left Part */}
                <div className="col-span-10 lg:col-span-5 lg:border-r border-black flex items-center space-x-4 sm:space-x-6 px-6 sm:px-8">
                  <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-neutral-500 shrink-0">
                    0{idx + 1}.
                  </span>
                  <h3 className="font-syne text-sm sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-black truncate">
                    {project.title}
                  </h3>
                </div>
                {/* Middle Part: Hover Image */}
                <div className="hidden lg:flex lg:col-span-2 border-r border-black bg-neutral-200 overflow-hidden relative items-center justify-center p-0">
                  {showMiddleHoverImage ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F5F4F0]" />
                  )}
                </div>
                {/* Right Part */}
                <div className="col-span-2 lg:col-span-5 flex items-center justify-end space-x-4 sm:space-x-6 px-6 sm:px-8">
                  <span className="hidden sm:inline-block text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 truncate">
                    {project.category}
                  </span>
                  <span
                    className={`text-lg font-mono font-bold transition-transform duration-300 text-black ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </div>
              </button>
              {/* Expanded Content */}
              <div
                className="w-full grid transition-[grid-template-rows,opacity] duration-500 ease-in-out bg-white overflow-hidden"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  opacity: isOpen ? 1 : 0,
                  borderTop: isOpen ? "1px solid black" : "0px solid transparent",
                }}
              >
                <div className="overflow-hidden min-h-0 w-full grid grid-cols-12 items-stretch">
                  {/* Left Info Panel */}
                  <div className="col-span-12 lg:col-span-5 p-6 lg:p-8 lg:border-r border-black flex flex-col justify-between relative overflow-hidden bg-[#F5F4F0] text-black order-2 lg:order-1">
                    <div
                      className="absolute inset-0 pointer-events-none"
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
                    <div className="relative z-10 flex flex-col justify-between h-full w-full">
                      <div>
                        <span className="text-xs font-mono text-black/60 block mb-3 uppercase tracking-wider font-bold">
                          0{idx + 1} {project.category} // {project.year}
                        </span>
                        <h4 className="font-syne text-lg sm:text-2xl lg:text-3xl font-extrabold text-black uppercase tracking-tight mb-2">
                          {project.title}
                        </h4>
                        <p className="text-xs font-mono text-black/70 uppercase tracking-widest mb-4 font-semibold">
                          {project.subtitle}
                        </p>
                        <p className="text-sm font-outfit text-black/90 leading-relaxed font-medium mb-4">
                          {project.description}
                        </p>
                        <div className="text-xs font-mono text-black/80 font-bold uppercase tracking-wider space-y-1 mb-6">
                          <div>YEAR: {project.year}</div>
                          <div>TURNAROUND: {project.openingHours}</div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-black/20 flex items-center space-x-4">
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 border border-black bg-[#F5F4F0] text-black text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center space-x-2 transition-colors duration-300 hover:bg-neutral-300"
                        >
                          <span>Visit Site</span>
                          <span>&#x2197;</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* Right Image Panel */}
                  <div className="col-span-12 lg:col-span-7 relative overflow-hidden bg-[#F5F4F0] flex items-center justify-center p-0 order-1 lg:order-2 border-b lg:border-b-0 border-black">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}