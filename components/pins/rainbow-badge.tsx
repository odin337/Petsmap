import { Badge } from "@/components/ui/badge";

export function RainbowBadge() {
  return (
    <Badge
      variant="warning"
      className="border border-white/60 bg-linear-to-r from-pink-100 via-amber-100 to-sky-100 text-amber-900 shadow-[var(--shadow-sm)]"
    >
      <span aria-hidden="true">🌈</span>
      Ушёл на радугу
    </Badge>
  );
}
