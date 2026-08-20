import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Ticker } from "./Ticker";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <Ticker />
        <main className="flex-1 px-5 lg:px-8 py-6 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
