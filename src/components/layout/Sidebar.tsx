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
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/deals", label: "Deal Explorer", icon: Search },
  { href: "/investments", label: "My Investments", icon: Heart },
  { href: "/corporate", label: "Corporate Analytics", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] h-screen sticky top-0">
      <div className="px-6 py-6 flex items-center gap-2.5 border-b border-[var(--border)]">
        <div className="h-8 w-8 rounded-lg bg-[var(--gold)] flex items-center justify-center">
          <Waves size={17} className="text-[#191307]" strokeWidth={2.5} />
        </div>
        <div>
          <p
            className="text-sm font-semibold leading-none text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            3D Bharat
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Deal Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--gold-soft)] text-[var(--gold)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

     
    </aside>
  );
}
