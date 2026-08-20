"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, ChevronDown, Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadInvestors, setActiveInvestor } from "@/store/slices/investorsSlice";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const { list, activeInvestorId, status } = useAppSelector((s) => s.investors);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to avoid theme hydration mismatch
    setMounted(true);
  }, []);
  useEffect(() => {
    if (status === "idle") dispatch(loadInvestors());
  }, [status, dispatch]);

  const activeInvestor = list.find((i) => i.id === activeInvestorId);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur px-5 lg:px-8 py-3.5">
      <button className="lg:hidden text-[var(--text-secondary)]">
        <Menu size={20} />
      </button>

      <div className="flex-1 max-w-md hidden md:block">
        <p className="text-xs text-[var(--text-muted)]">
          Simulated live desk &middot; last synced moments ago
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative group">
          <button className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <span className="h-6 w-6 rounded-full bg-[var(--gold-soft)] text-[var(--gold)] flex items-center justify-center text-[11px] font-semibold">
              {activeInvestor?.name?.[0] ?? "?"}
            </span>
            <span className="hidden sm:inline max-w-[120px] truncate">
              {activeInvestor?.name ?? "Select investor"}
            </span>
            <ChevronDown size={14} />
          </button>
          <div className="absolute right-0 mt-1 w-64 max-h-72 overflow-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1.5 z-40">
            <p className="px-3 py-1.5 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              Viewing as
            </p>
            {list.map((inv) => (
              <button
                key={inv.id}
                onClick={() => dispatch(setActiveInvestor(inv.id))}
                className="w-full text-left px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] flex items-center justify-between"
              >
                <span className="truncate">{inv.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{inv.type}</span>
              </button>
            ))}
          </div>
        </div>

        {mounted && (
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--gold)]"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}
      </div>
    </header>
  );
}
