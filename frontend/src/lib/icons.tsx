/**
 * Maps an icon name stored in the database / site content to a Lucide
 * component. Keeps stored data decoupled from the icon library; unknown names
 * fall back to Sparkles.
 */
import {
  Award,
  BarChart3,
  Briefcase,
  Camera,
  Check,
  Clock,
  CodeXml,
  Compass,
  Globe,
  Heart,
  Layers,
  LifeBuoy,
  Lightbulb,
  Lock,
  Mail,
  Megaphone,
  MessageCircle,
  Palette,
  PenTool,
  Phone,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wand2,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Award,
  BarChart3,
  Briefcase,
  Camera,
  Check,
  Clock,
  CodeXml,
  Compass,
  Globe,
  Heart,
  Layers,
  LifeBuoy,
  Lightbulb,
  Lock,
  Mail,
  Megaphone,
  MessageCircle,
  Palette,
  PenTool,
  Phone,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wand2,
  Wrench,
  Zap,
  // Back-compat alias so rows storing the old name still resolve.
  Code2: CodeXml,
}

/** Names offered in the admin icon picker. */
export const ICON_NAMES = Object.keys(ICONS).filter((n) => n !== 'Code2')

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Sparkles
}
