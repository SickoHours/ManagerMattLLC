import Link from "next/link";

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
    <footer className="bg-foreground text-background">
      <div className="container-wide mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="text-h4 font-semibold">
              Manager Matt LLC
            </Link>
            <p className="mt-4 text-body-sm text-background/60">
              AI-accelerated dev,
              <br />
              openly honest.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-label font-medium uppercase tracking-wider text-background/40 mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-label font-medium uppercase tracking-wider text-background/40 mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empty column for spacing */}
          <div className="hidden md:block" />
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-body-sm text-background/40">
            &copy; {new Date().getFullYear()} Manager Matt LLC. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-sm text-background/40 hover:text-background/70 transition-colors"
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
