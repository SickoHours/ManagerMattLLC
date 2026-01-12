import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerLinks = {
  product: [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/estimate", label: "Estimate" },
  ],
  resources: [
    { href: "/process", label: "Process" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/legal/privacy", label: "Privacy" },
    { href: "/legal/terms", label: "Terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black footer-glow relative">
      <div className="vibe-container px-6 py-16">
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
              So was the estimation tool you just used.
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
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
