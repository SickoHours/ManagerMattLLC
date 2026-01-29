"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const footerLinks = {
  product: [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/contact", label: "Contact" },
  ],
  resources: [
    { href: "https://github.com/SickoHours", label: "GitHub" },
    { href: "https://twitter.com/ManagerMattLLC", label: "Twitter" },
  ],
};

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current || !contentRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Parallax reveal - content starts lower and rises up
    gsap.fromTo(
      contentRef.current,
      {
        yPercent: -30,
        opacity: 0.5,
      },
      {
        yPercent: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "top 60%",
          scrub: 1,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === footerRef.current) {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-black footer-glow relative overflow-hidden">
      <div ref={contentRef} className="vibe-container px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-xl font-semibold text-white hover:opacity-80 transition-opacity"
            >
              Manager Matt LLC
            </Link>
            <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
              Vibe-coded software,
              <br />
              production-grade results.
            </p>

            {/* Social hint */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-white transition-colors group"
              >
                <span className="text-sm flex items-center gap-1">
                  Twitter
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-white transition-colors group"
              >
                <span className="text-sm flex items-center gap-1">
                  GitHub
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-zinc-600 mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-zinc-600 mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Easter Egg */}
          <div className="md:text-right">
            <p className="text-sm text-zinc-600 leading-relaxed">
              This website was vibe-coded.
              <br />
              So is everything I build.
            </p>
            <p className="mt-4 text-sm text-zinc-500 italic">
              Still works though. Funny how that happens.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-700">
            &copy; {new Date().getFullYear()} Manager Matt LLC. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
