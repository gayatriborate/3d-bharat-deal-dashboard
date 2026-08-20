import { AlertTriangle, InboxIcon } from "lucide-react";
import { Button, Card } from "./primitives";

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="p-10 flex flex-col items-center text-center gap-3">
      <div className="h-11 w-11 rounded-full bg-[var(--rose-soft)] text-[var(--rose)] flex items-center justify-center">
        <AlertTriangle size={20} />
      </div>
      <div>
        <p className="font-medium text-[var(--text-primary)]">Couldn&apos;t load this data</p>
        <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm">{message}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </Card>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="p-10 flex flex-col items-center text-center gap-3">
      <div className="h-11 w-11 rounded-full bg-[var(--surface-hover)] text-[var(--text-muted)] flex items-center justify-center">
        <InboxIcon size={20} />
      </div>
      <div>
        <p className="font-medium text-[var(--text-primary)]">{title}</p>
        <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm">{description}</p>
      </div>
    </Card>
  );
}
