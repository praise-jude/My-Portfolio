import {
  Activity,
  Ban,
  BarChart3,
  Boxes,
  Clock,
  CloudCog,
  Compass,
  CreditCard,
  FileText,
  Fingerprint,
  Focus,
  FolderKanban,
  History,
  Layers,
  LineChart,
  ListChecks,
  MessageSquareWarning,
  Minus,
  Network,
  Newspaper,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkle,
  Sparkles,
  UsersRound,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Activity,
  Ban,
  BarChart3,
  Boxes,
  Clock,
  CloudCog,
  Compass,
  CreditCard,
  FileText,
  Fingerprint,
  Focus,
  FolderKanban,
  History,
  Layers,
  LineChart,
  ListChecks,
  MessageSquareWarning,
  Minus,
  Network,
  Newspaper,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkle,
  Sparkles,
  UsersRound,
  Users,
  Wallet,
  Zap,
};

export function DynamicIcon({
  name,
  className,
  size = 20,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = iconMap[name] ?? Sparkles;
  return <Icon className={className} size={size} strokeWidth={1.75} />;
}
