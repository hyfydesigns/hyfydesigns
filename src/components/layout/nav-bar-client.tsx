"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, User, X, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CartButton } from "@/components/layout/cart-button";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import type { CollectionSummary } from "@/sanity/types";

export function NavBarClient({
  collections,
}: {
  collections: CollectionSummary[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-hairline">
        <Container>
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 sm:flex-none">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="lg:hidden -ml-2 h-11 w-11 inline-flex items-center justify-center text-navy tap"
              >
                <Menu className="h-5 w-5" strokeWidth={2} />
              </button>
              <Link
                href="/"
                aria-label="HyFy Designs home"
                className="inline-flex items-center"
              >
                <Image
                  src="/hyfy-logo.png"
                  alt="HyFy Designs"
                  width={520}
                  height={400}
                  priority
                  className="h-9 sm:h-11 w-auto"
                />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-7 text-sm text-navy">
              {site.nav.map((item) =>
                item.href === "/shop" ? (
                  <DesktopShopMenu key={item.href} collections={collections} />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:text-blue transition-colors"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2 text-navy">
              <Link
                href="/shop"
                aria-label="Search products"
                className="h-11 w-11 hidden sm:inline-flex items-center justify-center hover:text-blue tap"
              >
                <Search className="h-5 w-5" strokeWidth={2} />
              </Link>
              <Link
                href="/account"
                aria-label="Account"
                className="h-11 w-11 hidden sm:inline-flex items-center justify-center hover:text-blue tap"
              >
                <User className="h-5 w-5" strokeWidth={2} />
              </Link>
              <CartButton />
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-navy/40"
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[85%] max-w-sm bg-cream shadow-lift flex flex-col transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between px-5 h-14 border-b border-hairline">
            <Image
              src="/hyfy-logo.png"
              alt="HyFy Designs"
              width={520}
              height={400}
              className="h-9 w-auto"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="h-11 w-11 -mr-2 inline-flex items-center justify-center text-navy tap"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          <nav className="flex flex-col px-5 py-4 flex-1 overflow-y-auto">
            {site.nav.map((item) =>
              item.href === "/shop" ? (
                <MobileShopSection
                  key={item.href}
                  collections={collections}
                  onNavigate={() => setOpen(false)}
                />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-3.5 text-base font-medium text-navy border-b border-hairline last:border-b-0 tap"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="p-5 border-t border-hairline flex items-center gap-3 text-sm text-navy">
            <Link href="/account" className="tap" onClick={() => setOpen(false)}>
              Account
            </Link>
            <span className="text-ink-400">·</span>
            <Link href="/contact" className="tap" onClick={() => setOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function DesktopShopMenu({
  collections,
}: {
  collections: CollectionSummary[];
}) {
  if (collections.length === 0) {
    return (
      <Link href="/shop" className="hover:text-blue transition-colors">
        Shop
      </Link>
    );
  }

  return (
    <div className="relative group">
      <Link
        href="/shop"
        className="hover:text-blue transition-colors inline-flex items-center gap-1 py-2"
      >
        Shop
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform group-hover:rotate-180"
          strokeWidth={2}
        />
      </Link>
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto transition-opacity">
        <div className="min-w-[220px] bg-white border border-hairline rounded-xl shadow-lift overflow-hidden">
          <Link
            href="/shop"
            className="block px-4 py-2.5 text-sm text-navy hover:bg-blue-tint transition-colors border-b border-hairline"
          >
            All products
          </Link>
          {collections.map((c) => (
            <Link
              key={c._id}
              href={`/shop/collection/${c.slug}`}
              className="block px-4 py-2.5 text-sm text-navy hover:bg-blue-tint transition-colors"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileShopSection({
  collections,
  onNavigate,
}: {
  collections: CollectionSummary[];
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-hairline">
      <Link
        href="/shop"
        onClick={onNavigate}
        className="block py-3.5 text-base font-medium text-navy tap"
      >
        Shop
      </Link>
      {collections.length > 0 && (
        <div className="pb-2 pl-4 space-y-0.5">
          {collections.map((c) => (
            <Link
              key={c._id}
              href={`/shop/collection/${c.slug}`}
              onClick={onNavigate}
              className="block py-2 text-sm text-ink-600 tap"
            >
              {c.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
