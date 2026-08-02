import {
  Activity,
  BarChart3,
  Boxes,
  BrainCircuit,
  CloudCog,
  CreditCard,
  FileText,
  Fingerprint,
  Focus,
  Gauge,
  Globe2,
  Minus,
  MonitorCheck,
  Network,
  Radar,
  Search,
  ShieldCheck,
  ShieldHalf,
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
  BarChart3,
  Boxes,
  BrainCircuit,
  CloudCog,
  CreditCard,
  FileText,
  Fingerprint,
  Focus,
  Gauge,
  Globe2,
  Minus,
  MonitorCheck,
  Network,
  Radar,
  Search,
  ShieldCheck,
  ShieldHalf,
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
