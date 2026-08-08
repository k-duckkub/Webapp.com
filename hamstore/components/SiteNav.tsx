"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { T } from "@/lib/motion";
import { CoinBalance } from "./CoinBalance";
import { CartButton } from "./CartButton";
import { CartPanel } from "./CartPanel";
import { Announcer } from "./Announcer";
import { Icon } from "./Icon";
import { COPY } from "@/lib/content";

const LINKS = [
  { href: "/", label: COPY.nav.storeLabel },
  { href: "/library", label: COPY.nav.libraryLabel },
];

/**
 * Static hosts serve the same route as `/library`, `/library/` or
 * `/library.html` depending on their rewrite rules. Fold all three onto the
 * canonical form so the active tab is right everywhere — and so the client
 * agrees with the prerendered markup instead of tripping a hydration mismatch.
 */
function canonicalPath(pathname: string | null) {
  const stripped = (pathname ?? "/")
    .replace(/(?:index)?\.html$/, "")
    .replace(/(.+)\/$/, "$1");
  return stripped || "/";
}

export function SiteNav() {
  const pathname = canonicalPath(usePathname());
  const [lifted, setLifted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  /* The bar is transparent over the hero and frosts once you leave it. */
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* The panel is a sibling of the bar, not a child. The bar carries
       `backdrop-blur`, and a backdrop-filter makes an element the containing
       block for its `fixed` descendants — so nested inside, the cart was
       clipped to the 48px height of the nav instead of covering the page. */
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          lifted
            ? "border-b border-hairline/60 bg-paper/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav className="shell flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 text-[15px] font-bold tracking-tight text-graphite"
          >
            {/* A solid mark rather than a loose glyph — the wordmark next to it
                needs something with weight to sit against. */}
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
              <Icon name="hamster" className="h-5 w-5" strokeWidth={1.9} />
            </span>
            {/* The wordmark costs more width than the links can spare on a phone. */}
            <span className="hidden sm:inline">{COPY.nav.wordmark}</span>
            <span className="sr-only sm:hidden">{COPY.nav.wordmark}</span>
          </Link>

          <div className="flex min-w-0 items-center gap-0.5 sm:gap-6">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap px-2 py-1 text-[12px] font-medium transition-colors sm:text-[13px] ${
                    active ? "text-graphite" : "text-slate hover:text-graphite"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-rule"
                      className="absolute inset-x-2 -bottom-1.5 h-[3px] rounded-full bg-brand"
                      transition={T.hover}
                    />
                  )}
                </Link>
              );
            })}

            <CoinBalance />
            <CartButton onOpen={() => setCartOpen(true)} />
          </div>
        </nav>
      </header>

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
      <Announcer />
    </>
  );
}
