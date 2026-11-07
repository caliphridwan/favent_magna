import {
  Wifi,
  ShieldCheck,
  Cctv,
  Network,
  Server,
  Globe,
  GraduationCap,
  Layers,
  Building2,
  Database,
  Cloud,
  Cable,
  Lock,
  Router,
  Landmark,
  HeartPulse,
  Hotel,
  Factory,
  ShoppingBag,
  School,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export const icons: Record<string, LucideIcon> = {
  wifi: Wifi,
  shield: ShieldCheck,
  cctv: Cctv,
  network: Network,
  server: Server,
  globe: Globe,
  graduation: GraduationCap,
  layers: Layers,
  building: Building2,
  database: Database,
  cloud: Cloud,
  cable: Cable,
  lock: Lock,
  router: Router,
  landmark: Landmark,
  health: HeartPulse,
  hotel: Hotel,
  factory: Factory,
  retail: ShoppingBag,
  school: School,
  briefcase: Briefcase,
};

export const iconOptions = Object.keys(icons).map((k) => ({ value: k, label: k }));

export function getIcon(key?: string | null): LucideIcon {
  return (key && icons[key]) || Layers;
}
