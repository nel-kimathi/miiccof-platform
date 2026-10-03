"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImgWithFallback } from "./img-with-fallback";

const NAV_BEFORE = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

const TRADE_CHILDREN = [
  { label: "Investment Opportunities", href: "/investment-opportunities" },
  { label: "Consumer Fair", href: "/trade-fair" },
];

const NAV_AFTER = [
  { label: "Programme", href: "/conference-programme" },
  { label: "Sponsors & Partners", href: "/sponsors-partners" },
  { label: "News", href: "/news" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

function NavLink({
  href,
  label,
  pathname,
  className,
}: {
  href: string;
  label: string;
  pathname: string;
  className?: string;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-[20px] px-3 py-1.5 text-sm font-bold tracking-wide transition-colors ${
        isActive
          ? "bg-white text-primary"
          : "text-white hover:bg-white hover:text-primary active:bg-white active:text-primary"
      } ${className ?? ""}`}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTradeOpen, setMobileTradeOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setTradeOpen(false);
    setMobileOpen(false);
    setMobileTradeOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const solid = scrolled || pathname !== "/";
  const tradeActive = TRADE_CHILDREN.some((c) => c.href === pathname);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        solid ? "bg-primary/95 shadow-md backdrop-blur" : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between transition-all duration-300 ${
          solid ? "px-4 py-2 sm:px-6" : "px-4 py-3 sm:px-6"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white p-0.5 shadow-lg ring-1 ring-black/5 transition-all duration-300 sm:h-[78px] sm:w-[78px] sm:p-[2px]"
          aria-label="MIICCOF home"
        >
          <ImgWithFallback
            src="/images/logos/logo-no-bg.png"
            alt="MIICCOF logo"
            className="h-full w-full object-contain transition-all duration-300"
            fallback={
              <span className="font-heading text-sm font-bold tracking-tight text-primary sm:text-xl">
                MIICCOF
              </span>
            }
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center justify-center gap-x-4 px-4 lg:flex">
          {NAV_BEFORE.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} />
          ))}

          {/* Trade & Investment dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setTradeOpen(true)}
            onMouseLeave={() => setTradeOpen(false)}
          >
            <button
              type="button"
              onClick={() => setTradeOpen((o) => !o)}
              aria-expanded={tradeOpen}
              className={`flex items-center gap-1 whitespace-nowrap rounded-[20px] px-3 py-1.5 text-sm font-bold tracking-wide transition-colors ${
                tradeActive
                  ? "bg-white text-primary"
                  : "text-white hover:bg-white hover:text-primary"
              }`}
            >
              Trade &amp; Investment
              <ChevronDown
                className={`h-4 w-4 transition-transform ${tradeOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`absolute left-0 top-full z-50 pt-2 transition-all duration-200 ${
                tradeOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="min-w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5">
                {TRADE_CHILDREN.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`block rounded-lg px-4 py-2 text-sm font-bold tracking-wide transition-colors ${
                      pathname === child.href
                        ? "bg-secondary text-primary"
                        : "text-foreground hover:bg-secondary hover:text-primary"
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {NAV_AFTER.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} />
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Button
            variant="ghost"
            size="sm"
            className="whitespace-nowrap rounded-[20px] border border-white/70 px-4 py-1.5 text-sm font-bold tracking-wide text-white hover:bg-white hover:text-primary"
            render={<Link href="/login" />}
          >
            Login
          </Button>
          <Button
            size="sm"
            className="whitespace-nowrap rounded-[20px] bg-primary px-4 py-1.5 text-sm font-bold tracking-wide text-primary-foreground hover:bg-white hover:text-primary"
            render={<Link href="/register" />}
          >
            Register
          </Button>
        </div>

        {/* Mobile burger button */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex items-center justify-center rounded-lg p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 top-0 z-40 bg-primary transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{ paddingTop: solid ? "64px" : "68px" }}
      >
        <nav className="flex h-full flex-col overflow-y-auto px-6 py-6">
          {NAV_BEFORE.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`border-b border-white/10 py-3 text-lg font-bold tracking-wide transition-colors ${
                pathname === item.href
                  ? "text-accent"
                  : "text-white hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Trade & Investment accordion */}
          <button
            type="button"
            onClick={() => setMobileTradeOpen((o) => !o)}
            className={`flex items-center justify-between border-b border-white/10 py-3 text-lg font-bold tracking-wide transition-colors ${
              tradeActive ? "text-accent" : "text-white hover:text-accent"
            }`}
          >
            Trade &amp; Investment
            <ChevronDown
              className={`h-5 w-5 transition-transform ${mobileTradeOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              mobileTradeOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {TRADE_CHILDREN.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={`block border-b border-white/5 py-2 pl-4 text-base font-semibold tracking-wide transition-colors ${
                  pathname === child.href
                    ? "text-accent"
                    : "text-white/80 hover:text-accent"
                }`}
              >
                {child.label}
              </Link>
            ))}
          </div>

          {NAV_AFTER.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`border-b border-white/10 py-3 text-lg font-bold tracking-wide transition-colors ${
                pathname === item.href
                  ? "text-accent"
                  : "text-white hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile auth buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <Button
              variant="ghost"
              size="lg"
              className="w-full whitespace-nowrap rounded-[20px] border border-white/50 px-6 py-3 text-base font-bold tracking-wide text-white hover:bg-white hover:text-primary"
              render={<Link href="/login" />}
            >
              Login
            </Button>
            <Button
              size="lg"
              className="w-full whitespace-nowrap rounded-[20px] bg-primary px-6 py-3 text-base font-bold tracking-wide text-primary-foreground hover:bg-white hover:text-primary"
              render={<Link href="/register" />}
            >
              Register
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
