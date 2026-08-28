import { Link } from "react-router-dom";
import { Mail, ArrowUpRight } from "lucide-react";

function Footer() {
  const shopLinks = [
    { label: "Women", href: "/products?category=women" },
    { label: "Men", href: "/products?category=men" },
    { label: "Kids", href: "/products?category=kids" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Virtual Try-On", href: "/try-on" },
  ];

  const helpLinks = [
    { label: "My Orders", href: "/orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Contact Us", href: "/contact" },
  ];

  const companyLinks = [
    { label: "About Raritone", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <footer className="border-t border-neutral-200 bg-neutral-950 text-white">
      {/* =====================================================
          NEWSLETTER
      ====================================================== */}

      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                STAY IN THE LOOP
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Get the latest from Raritone.
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-400">
                Be the first to discover new collections, exclusive drops and
                everything happening at Raritone.
              </p>
            </div>

            <div className="w-full max-w-md">
              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  const email = event.currentTarget.email.value.trim();

                  if (!email) return;

                  console.log("Newsletter subscription:", email);

                  event.currentTarget.reset();
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-full border border-white/15 bg-white/5 pl-11 pr-5 text-sm text-white outline-none placeholder:text-neutral-500 transition focus:border-white/40"
                  />
                </div>

                <button
                  type="submit"
                  className="h-12 rounded-full bg-white px-7 text-sm font-medium text-black transition hover:bg-neutral-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* BRAND */}

          <div>
            <Link to="/" className="text-xl font-bold tracking-[0.28em]">
              RARITONE
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-neutral-400">
              Fashion designed around you. Discover modern styles and experience
              the future of shopping with virtual try-on.
            </p>

            {/* SOCIAL */}

            <div className="mt-7 flex items-center gap-2">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-white/30 hover:text-white"
              >
                Instagram
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-white/30 hover:text-white"
              >
                <span className="text-sm font-bold">f</span>
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-white/30 hover:text-white"
              >
                <span className="text-sm font-bold">𝕏</span>
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition hover:border-white/30 hover:text-white"
              >
                <span className="text-xs font-bold">YT</span>
              </a>
            </div>
          </div>

          {/* SHOP */}

          <FooterColumn title="Shop" links={shopLinks} />

          {/* HELP */}

          <FooterColumn title="Help" links={helpLinks} />

          {/* COMPANY */}

          <FooterColumn title="Company" links={companyLinks} />
        </div>
      </div>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Raritone. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/privacy"
              className="text-xs text-neutral-500 transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-neutral-500 transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-1 text-xs text-neutral-500 transition hover:text-white"
            >
              Contact
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/*
|--------------------------------------------------------------------------
| Footer Column
|--------------------------------------------------------------------------
*/

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
        {title}
      </h3>

      <nav className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="w-fit text-sm text-neutral-400 transition hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Footer;
