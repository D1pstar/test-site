/**
 * Maps the backend's `icon` string field (stored on services) to a Lucide
 * component. Keeps the DB decoupled from the frontend icon library.
 *
 * Only uses icons that are stable across recent Lucide versions — no
 * brand icons, no `*2` aliases that get deprecated.
 */
import {
  CodeXml,
  Compass,
  Megaphone,
  Palette,
  PenTool,
  Search,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  CodeXml,
  Compass,
  Megaphone,
  Palette,
  PenTool,
  Search,
  Sparkles,
  TrendingUp,
  // Back-compat aliases so DB rows storing old names still resolve.
  Code2: CodeXml,
}

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Sparkles
}