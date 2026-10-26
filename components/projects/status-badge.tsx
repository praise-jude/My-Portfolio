import { Badge } from "@/components/ui/badge";
import { statusLabel, type ProjectStatus } from "@/lib/projects/types";

const accent = {
  live: "emerald",
  in_development: "gold",
  planned: "electric",
  archived: "neutral",
} as const;

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge accent={accent[status]}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {statusLabel[status]}
    </Badge>
  );
}
