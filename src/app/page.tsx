"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Playfair_Display, Open_Sans } from "next/font/google";
import MobileNav from "./MobileNav";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const steps = [
  {
    title: "Register",
    desc: "Sign up with your business profile and goals.",
    svg: (
      <svg viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: "Get Matched",
    desc: "Our algorithm pairs you with ideal connections.",
    svg: (
      <svg viewBox="0 0 24 24">
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M13 6h3a2 2 0 0 1 2 2v7" />
        <path d="M11 18H8a2 2 0 0 1-2-2V9" />
      </svg>
    ),
  },
  {
    title: "Attend Meetings",
    desc: "Join curated Offline & Online networking Events.",
    svg: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: "Build Connections",
    desc: "Grow partnerships and close deals.",
    svg: (
      <svg viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const events = [
  {
    date: "12 JUNE",
    year: "2026",
    title: "1 to 1 Networking",
    type: "Offline",
    venue: "Kapila Business Hotel",
    time: "4:00 PM – 6:00 PM",
  },
];

export default function HomePage() {
  return (
    <>
      <style>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .fade-in.show {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-in.d1 { transition-delay: 0.08s; }
        .fade-in.d2 { transition-delay: 0.16s; }
        .fade-in.d3 { transition-delay: 0.24s; }
        .fade-in.d4 { transition-delay: 0.32s; }
        .step-icon-circle {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: #F0F4F8;
          border: 2px solid #D8E2EC;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          transition: background 0.2s, border-color 0.2s;
        }
        .step-card:hover .step-icon-circle {
          background: #E8F0F8;
          border-color: #3D5A7A;
        }
        .step-icon-circle svg {
          width: 22px; height: 22px;
          stroke: #3D5A7A;
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .social-btn {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid #DDDDDD;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s;
          color: #555;
        }
        .social-btn:hover {
          background: #3D5A7A;
          border-color: #3D5A7A;
          color: #fff;
        }
        .social-btn svg {
          width: 15px; height: 15px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.8;
        }
        .card-premium {
          transition: box-shadow 0.25s, transform 0.2s;
        }
        .card-premium:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.14);
          transform: translateY(-2px);
        }
      `}</style>

      <div className={`min-h-screen ${playfair.variable} ${openSans.variable}`}>

        {/* ═══ HERO ═══ */}
        <section
          className="relative overflow-hidden text-center lg:min-h-dvh lg:flex lg:flex-col lg:items-center lg:justify-center"
          style={{
            background: "linear-gradient(160deg, #3D5A7A 0%, #2E4A6A 100%)",
            paddingBottom: "80px",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
            <Link href="/" className="flex flex-col items-center gap-1">
              <Image src="/businessmatrix-logo-crop.png" alt="BusinessMatrix.Network" width={100} height={100} className="h-20 sm:h-24 w-auto p-1" />
              <span className="text-white text-[6px] sm:text-[8px] tracking-[0.15em]">BUSINESSMATRIX.NETWORK</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/directory" className="text-sm font-bold text-white/80 hover:text-white transition-colors">Directory</Link>
              <Link href="/directory/auth/login" className="text-sm font-bold text-white/80 hover:text-white transition-colors">Sign In</Link>
              <Link href="/directory/auth/signup" className="inline-block font-bold text-xs px-5 py-2 rounded-full transition-all hover:-translate-y-0.5" style={{ background: '#C9A84C', color: '#FFFFFF' }}>Register</Link>
            </div>
            <MobileNav />
          </div>

          <div className="relative z-10 w-full max-w-[820px] mx-auto px-10 max-md:px-6 lg:py-12">
            <h1
              className="font-[var(--font-display)] font-extrabold leading-[1.12] tracking-tight mb-7 text-white"
              style={{ fontSize: "clamp(40px, 6vw, 76px)" }}
            >
              Where Business<br />
              <span style={{ color: "#C9A84C" }}>Connections</span> Happen
            </h1>
            <p className="font-[var(--font-body)] text-[19px] leading-[1.72] text-white/80 max-w-[580px] mx-auto mb-10 font-light max-sm:text-[16px]">
              Curated in-person matchmaking meetings that connect entrepreneurs,
              and professionals for real growth opportunities.
            </p>
            <Link
              href="/directory/auth/signup"
              className="inline-block font-bold text-[15px] tracking-wide px-10 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "#C9A84C",
                color: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
              }}
            >
              Register Now
            </Link>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="py-20 px-4 sm:px-6 bg-white max-md:py-16">
          <div className="max-w-6xl mx-auto">
            <h2
              className="font-[var(--font-display)] font-bold text-center mb-14 text-[#1A1A1A] tracking-tight"
              style={{ fontSize: "clamp(32px, 3.5vw, 44px)" }}
            >
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className={`step-card text-center px-3 fade-in d${i + 1}`}
                >
                  <div className="step-icon-circle">{step.svg}</div>
                  <h3 className="font-[var(--font-display)] font-normal text-[19px] text-[#1A1A1A] mb-2.5 tracking-[0.01em]">
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-[1.65] text-[#666666] font-normal">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ UPCOMING EVENTS ═══ */}
        <section className="py-20 px-4 sm:px-6 max-md:py-16" style={{ background: "#F8F8F8" }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-12">
              {/* Left */}
              <div className="fade-in">
                <h2
                  className="font-[var(--font-display)] font-bold text-[#1A1A1A] leading-[1.15] mb-5 tracking-tight"
                  style={{ fontSize: "clamp(34px, 4vw, 48px)" }}
                >
                  Upcoming<br />Events
                </h2>
                <p className="text-[14px] leading-[1.72] text-[#666666] font-normal">
                  Explore upcoming business matchmaking events designed to
                  connect entrepreneurs, and professionals through meaningful
                  offline networking.
                  <br />
                  <br />
                  Participate in curated one-on-one meetings, speed networking
                  sessions, and collaboration opportunities to expand your
                  business connections.
                  <br />
                  <br />
                  Stay updated with event dates, venues, and registration
                  details to be part of high-value networking experiences.
                </p>
              </div>

              {/* Right — 2x2 event cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {events.map((event, i) => (
                  <div
                    key={event.title}
                    className={`fade-in d${i + 1} card-premium bg-white border border-[#E5E5E5] rounded-[6px] pt-5 px-5 pb-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)]`}
                  >
                    <div className="font-bold text-[16px] text-[#1A1A1A] leading-[1.3] mb-[2px]">
                      {event.date}
                    </div>
                    <div className="font-normal text-[15px] text-[#1A1A1A] mb-[10px]">
                      {event.year}
                    </div>
                    <h3 className="font-bold text-[16px] text-[#1A1A1A] mb-2.5 leading-[1.35]">
                      {event.title}
                    </h3>
                    <p className="text-[14px] text-[#666666] mb-[2px]">
                      {event.type}
                    </p>
                    <p className="text-[14px] text-[#666666] leading-[1.5]">
                      {event.venue}
                    </p>
                    <p className="text-[14px] text-[#666666] leading-[1.5] mb-3.5">
                      {event.time}
                    </p>
                    <div className="text-center">
                      <a
                        href="https://nas.com/acinnovationsandventures/events/1-to-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block font-semibold text-[14px] tracking-wide px-6 py-2 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background: "#1A6FD4",
                          color: "#FFFFFF",
                        }}
                      >
                        Register Now
                      </a>
                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Balkrishna+Sakharam+Dhole+Patil+Rd+Sangamvadi+Pune+Maharashtra+411001"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block -mx-5 mt-3 rounded-none overflow-hidden border-t border-[#DDDDDD] hover:border-t-[#1A6FD4] transition-colors"
                        style={{ borderBottom: 'none', borderLeft: 'none', borderRight: 'none', height: 165 }}
                      >
                        <iframe
                          src="https://maps.google.com/maps?q=Balkrishna+Sakharam+Dhole+Patil+Rd+Sangamvadi+Pune+411001&t=m&z=14&output=embed&iwloc=near"
                          width="100%"
                          height="200"
                          style={{ border: 0, display: 'block', pointerEvents: 'none', marginTop: -35 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Map"
                        />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ DIVIDER ═══ */}
        <hr
          className="border-none border-t border-dashed m-0"
          style={{ borderTop: "1px dashed #CCCCCC" }}
        />

        {/* ═══ CONTACT ═══ */}
        <section className="py-[72px] px-4 sm:px-6 pb-20 bg-white max-md:py-14 max-md:pb-16">
          <div className="max-w-[700px] mx-auto">
            <div className="font-bold text-[19px] text-[#1A1A1A] mb-7">
              Contact us
            </div>

            {/* Row: First + Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="fn"
                  className="text-[14px] font-semibold text-[#333333] tracking-[0.01em] block mb-1.5"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="fn"
                  name="firstName"
                  placeholder="First name"
                  className="w-full bg-white border border-[#CCCCCC] rounded-[4px] px-3.5 py-3 text-[15px] text-[#333333] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#AAAAAA] focus:border-[#1A6FD4] focus:shadow-[0_0_0_3px_rgba(26,111,212,0.12)]"
                />
              </div>
              <div>
                <label
                  htmlFor="ln"
                  className="text-[14px] font-semibold text-[#333333] tracking-[0.01em] block mb-1.5"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="ln"
                  name="lastName"
                  placeholder="Last name"
                  className="w-full bg-white border border-[#CCCCCC] rounded-[4px] px-3.5 py-3 text-[15px] text-[#333333] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#AAAAAA] focus:border-[#1A6FD4] focus:shadow-[0_0_0_3px_rgba(26,111,212,0.12)]"
                />
              </div>
            </div>

            {/* Row: Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="em"
                  className="text-[14px] font-semibold text-[#333333] tracking-[0.01em] block mb-1.5"
                >
                  Email <span style={{ color: "#E02020" }}>*</span>
                </label>
                <input
                  type="email"
                  id="em"
                  name="email"
                  placeholder="Email"
                  className="w-full bg-white border border-[#CCCCCC] rounded-[4px] px-3.5 py-3 text-[15px] text-[#333333] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#AAAAAA] focus:border-[#1A6FD4] focus:shadow-[0_0_0_3px_rgba(26,111,212,0.12)]"
                />
              </div>
              <div>
                <label
                  htmlFor="ph"
                  className="text-[14px] font-semibold text-[#333333] tracking-[0.01em] block mb-1.5"
                >
                  Phone
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[14px] text-[#666666] pointer-events-none select-none">
                    <svg
                      viewBox="0 0 24 24"
                      style={{ width: 16, height: 16, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    ▾
                  </span>
                  <input
                    type="tel"
                    id="ph"
                    name="phone"
                    placeholder="Phone"
                    className="w-full bg-white border border-[#CCCCCC] rounded-[4px] px-3.5 py-3 text-[15px] text-[#333333] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#AAAAAA] focus:border-[#1A6FD4] focus:shadow-[0_0_0_3px_rgba(26,111,212,0.12)]"
                    style={{ paddingLeft: 58 }}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-4">
              <label
                htmlFor="msg"
                className="text-[14px] font-semibold text-[#333333] tracking-[0.01em] block mb-1.5"
              >
                Message <span style={{ color: "#E02020" }}>*</span>
              </label>
              <textarea
                id="msg"
                name="message"
                placeholder="Message"
                rows={4}
                className="w-full bg-white border border-[#CCCCCC] rounded-[4px] px-3.5 py-3 text-[15px] text-[#333333] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#AAAAAA] focus:border-[#1A6FD4] focus:shadow-[0_0_0_3px_rgba(26,111,212,0.12)] resize-vertical min-h-[100px]"
              />
            </div>

            <button
              type="button"
              onClick={(e) => {
                const btn = e.currentTarget;
                const email = (
                  document.getElementById("em") as HTMLInputElement
                )?.value.trim();
                const msg = (
                  document.getElementById("msg") as HTMLTextAreaElement
                )?.value.trim();
                if (!email || !msg) {
                  btn.textContent = "Please fill required fields";
                  btn.style.background = "#888";
                  setTimeout(() => {
                    btn.textContent = "Submit";
                    btn.style.background = "";
                  }, 2500);
                  return;
                }
                btn.textContent = "✓ Message Sent!";
                btn.style.background = "#28A745";
                setTimeout(() => {
                  btn.textContent = "Submit";
                  btn.style.background = "";
                  ["fn", "ln", "em", "ph", "msg"].forEach(
                    (id) =>
                      (
                        document.getElementById(id) as HTMLInputElement
                      )?.value && (
                        (document.getElementById(id) as HTMLInputElement).value =
                          ""
                      )
                  );
                }, 3000);
              }}
              className="block w-full max-w-[340px] font-semibold text-[15px] tracking-wide py-3.5 rounded-[4px] border-none text-center mt-1 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "#1A6FD4",
                color: "#FFFFFF",
              }}
            >
              Submit
            </button>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{ background: "#F0F0F0", borderTop: "4px solid #C9A84C" }}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 items-start">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Image
                  src="/businessmatrix-logo-crop.png"
                  alt="BusinessMatrix.Network"
                  width={100}
                  height={100}
                  className="h-20 sm:h-24 w-auto"
                />
                <span className="text-slate-500 text-[7px] sm:text-[9px] tracking-[0.18em] font-semibold">BUSINESSMATRIX.NETWORK</span>
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.12em] mb-3">Contact</h4>
                <div className="text-[14px] text-slate-500 leading-relaxed space-y-1">
                  <p>Tel. +91 9156272076</p>
                  <p>Pune, Maharashtra</p>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.12em] mb-3">Follow Us</h4>
                <div className="flex gap-3 justify-center sm:justify-start">
                  <a
                    href="https://www.facebook.com/profile.php?id=61590113681574"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "#3D5A7A", color: "#fff" }}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/businessmatrix.network/"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "#3D5A7A", color: "#fff" }}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div
              className="text-center text-[12px] text-[#999999] pt-6 mt-8"
              style={{ borderTop: "1px solid #DDDDDD" }}
            >
              &copy; 2026 by BusinessMatrix.Network
            </div>
          </div>
        </footer>
      </div>

      <Script id="scroll-reveal" strategy="afterInteractive">
        {`
          const els = document.querySelectorAll('.fade-in');
          const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
              if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
            });
          }, { threshold: 0.1 });
          els.forEach(el => io.observe(el));
        `}
      </Script>

      <Script id="smooth-scroll" strategy="afterInteractive">
        {`
          document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
              const id = a.getAttribute('href').slice(1);
              const el = document.getElementById(id);
              if (el) {
                e.preventDefault();
                window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 76, behavior: 'smooth' });
              }
            });
          });
        `}
      </Script>
    </>
  );
}
