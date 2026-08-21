"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import {
  LayoutGrid,
  Search,
  Building2,
  Heart,
  Waves,
} from "lucide-react";

const navItems = [
  {
    href: "/",
    label: "Overview",
    icon: LayoutGrid,
  },
  {
    href: "/deals",
    label: "Deal Explorer",
    icon: Search,
  },
  {
    href: "/investments",
    label: "My Investments",
    icon: Heart,
  },
  {
    href: "/corporate",
    label: "Corporate Analytics",
    icon: Building2,
  },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] transition-transform duration-300",
          open
            ? "translate-x-0"
            : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:flex lg:h-screen lg:sticky lg:top-0"
        )}
      >

        {/* Logo Header */}
        <div className="px-6 py-6 flex items-center justify-between gap-2.5 border-b border-[var(--border)]">

          <div className="flex items-center gap-2.5">

            <div className="h-8 w-8 rounded-lg bg-[var(--gold)] flex items-center justify-center">
              <Waves
                size={17}
                className="text-[#191307]"
                strokeWidth={2.5}
              />
            </div>

            <div>
              <p
                className="text-sm font-semibold leading-none text-[var(--text-primary)]"
                style={{
                  fontFamily:
                    "var(--font-display)",
                }}
              >
                3D Bharat
              </p>

              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Deal Intelligence
              </p>
            </div>

          </div>

          {/* Close Button - Mobile Only */}
          <button
            onClick={onClose}
            className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-2xl leading-none"
            aria-label="Close menu"
          >
            ×
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">

          {navItems.map(
            ({
              href,
              label,
              icon: Icon,
            }) => {

              const active =
                pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={clsx(
                    "flex items-center gap-3 rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm font-medium transition-colors",

                    active
                      ? "bg-[var(--gold-soft)] text-[var(--gold)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  )}
                >

                  <Icon
                    size={17}
                    strokeWidth={2}
                  />

                  {label}

                </Link>
              );
            }
          )}

        </nav>

      </aside>
    </>
  );
}