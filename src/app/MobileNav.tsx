"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MobileNav({ isDirectory }: { isDirectory?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = [
    {
      href: isDirectory ? "/" : "/directory",
      label: isDirectory ? "Home" : "Directory",
      svg: isDirectory ? (
        <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ) : (
        <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      href: "/directory/auth/login",
      label: "Sign In",
      svg: (
        <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      ),
    },
    {
      href: "/directory/auth/signup",
      label: "Register",
      svg: (
        <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      ),
    },
  ];

  return (
    <div className="md:hidden">
      <style>{`
        .gg-burger {
          --line-width: 1.125em;
          --line-height: 0.125em;
          --offset: 0.625em;
          --diameter: 2.125em;
          --line-radius: 0.1875em;
          --line-transition: 0.3s;
          --burger-transition: all 0.1s ease-in-out;
          display: flex;
          position: relative;
          align-items: center;
          justify-content: center;
          width: var(--diameter);
          height: var(--diameter);
          border-radius: calc(var(--diameter) / 2);
          border: none;
          cursor: pointer;
          overflow: hidden;
          transition: var(--burger-transition);
          outline: 0.125em solid transparent;
          outline-offset: 0;
          background: rgba(0,0,0,0.08);
        }
        .gg-burger span {
          height: var(--line-height);
          width: var(--line-width);
          background: #333;
          border-radius: var(--line-radius);
          position: absolute;
          transition: var(--line-transition);
        }
        .gg-burger span:nth-child(1) { top: var(--offset); }
        .gg-burger span:nth-child(2) { bottom: var(--offset); }
        .gg-burger span:nth-child(3) { top: 50%; transform: translateY(-50%); }

        .gg-burger.active span:nth-child(1) {
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }
        .gg-burger.active span:nth-child(2) {
          bottom: 50%;
          transform: translateY(50%) rotate(-45deg);
        }
        .gg-burger.active span:nth-child(3) {
          transform: translateX(calc(var(--diameter) * -1 - var(--line-width)));
        }

        .gg-burger:hover { transform: scale(1.08); }
        .gg-burger:active { transform: scale(0.95); }

        .gg-popup {
          position: fixed;
          top: 68px;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100;
          visibility: hidden;
          opacity: 0;
          transform: scale(0.96);
          transition: all 0.2s ease;
          transform-origin: top right;
        }
        .gg-popup.active {
          visibility: visible;
          opacity: 1;
          transform: scale(1);
        }

        .gg-popup-inner {
          background: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          padding: 8px;
          margin: 8px 12px;
          font-family: inherit;
        }

        .gg-popup-inner ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .gg-popup-inner ul li a {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 14px;
          border: none;
          background: none;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          text-decoration: none;
        }
        .gg-popup-inner ul li a:hover {
          background: #406090;
          color: #fff;
        }
        .gg-popup-inner ul li a:hover svg {
          color: #fff;
        }
        .gg-popup-inner ul li a svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          color: #666;
          transition: color 0.15s;
        }
        .gg-popup-backdrop {
          position: fixed;
          inset: 0;
          z-index: -1;
        }
      `}</style>

      <div className="relative">
        <button
          className={`gg-burger ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`gg-popup ${open ? "active" : ""}`}>
          <div className="gg-popup-backdrop" onClick={() => setOpen(false)} />
          <div className="gg-popup-inner relative z-10">
            <ul>
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setOpen(false)}>
                    {link.svg}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
