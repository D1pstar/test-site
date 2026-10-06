export type CatPalette = 'mango' | 'pixel'

type Props = {
  palette: CatPalette
  /** 'sit' for now; more poses land in 7B-2. */
  pose?: 'sit'
  className?: string
}

type Colors = {
  base: string
  baseShadow: string
  rosette: string
  rosetteDark: string
  belly: string
  nose: string
  eye: string
  innerEar: string
}

const PALETTES: Record<CatPalette, Colors> = {
  // Warm brown Bengal — Mango
  mango: {
    base: '#c97a3d',
    baseShadow: '#a55f28',
    rosette: '#6b3a12',
    rosetteDark: '#3f2008',
    belly: '#f0d9bd',
    nose: '#d98a8a',
    eye: '#8fc24a',
    innerEar: '#e7a68f',
  },
  // Silver Bengal — Pixel
  pixel: {
    base: '#b9bfc6',
    baseShadow: '#8f969e',
    rosette: '#4a525b',
    rosetteDark: '#2a3038',
    belly: '#eef1f4',
    nose: '#c9a3a3',
    eye: '#e0b84a',
    innerEar: '#d9a6b3',
  },
}

export default function BengalCat({ palette, className = '' }: Props) {
  const c = PALETTES[palette]

  // The SVG is drawn facing RIGHT. Callers flip with scaleX(-1) for left.
  // viewBox is 120x80. Ground line is y=76.
  return (
    <svg
      viewBox="0 0 120 80"
      role="img"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tail — curled around, tip up */}
      <path
        d="M 34 68 C 22 68 14 60 16 50 C 18 42 26 40 30 46 C 32 50 30 54 26 54"
        fill="none"
        stroke={c.baseShadow}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 16 50 C 18 42 26 40 30 46"
        fill="none"
        stroke={c.rosette}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Body — seated, haunch visible */}
      <path
        d="M 34 66
           C 34 48 44 38 60 38
           C 78 38 88 48 88 66
           Z"
        fill={c.base}
      />
      {/* Body shading on the lower right */}
      <path
        d="M 60 38 C 78 38 88 48 88 66 L 74 66 C 74 54 68 44 60 38 Z"
        fill={c.baseShadow}
        opacity="0.35"
      />
      {/* Belly / chest highlight */}
      <path
        d="M 46 64 C 46 54 52 48 60 48 C 68 48 72 54 72 64 Z"
        fill={c.belly}
        opacity="0.9"
      />

      {/* Rosettes on the body */}
      <ellipse cx="52" cy="52" rx="3.4" ry="2.6" fill={c.rosette} opacity="0.85" />
      <ellipse cx="52" cy="52" rx="1.6" ry="1.1" fill={c.rosetteDark} />
      <ellipse cx="70" cy="50" rx="3" ry="2.4" fill={c.rosette} opacity="0.85" />
      <ellipse cx="70" cy="50" rx="1.4" ry="1" fill={c.rosetteDark} />
      <ellipse cx="62" cy="58" rx="3.6" ry="2.6" fill={c.rosette} opacity="0.85" />
      <ellipse cx="62" cy="58" rx="1.7" ry="1.2" fill={c.rosetteDark} />
      <ellipse cx="80" cy="60" rx="3" ry="2.2" fill={c.rosette} opacity="0.8" />
      <ellipse cx="80" cy="60" rx="1.4" ry="1" fill={c.rosetteDark} />
      <ellipse cx="44" cy="60" rx="2.4" ry="1.8" fill={c.rosette} opacity="0.8" />
      <ellipse cx="44" cy="60" rx="1.1" ry="0.8" fill={c.rosetteDark} />

      {/* Front legs — planted */}
      <rect x="70" y="58" width="7" height="10" rx="3" fill={c.base} />
      <rect x="70" y="66" width="7" height="3" rx="1.4" fill={c.belly} />
      <rect x="60" y="60" width="7" height="8" rx="3" fill={c.base} />
      <rect x="60" y="66" width="7" height="3" rx="1.4" fill={c.belly} />

      {/* Head */}
      <path
        d="M 78 46
           C 74 38 78 30 86 30
           C 94 30 98 38 94 46
           C 92 50 88 52 86 52
           C 84 52 80 50 78 46 Z"
        fill={c.base}
      />
      {/* Head shading on the right side */}
      <path
        d="M 86 30 C 94 30 98 38 94 46 C 92 50 88 52 86 52 C 90 46 90 36 86 30 Z"
        fill={c.baseShadow}
        opacity="0.35"
      />
      {/* Cheek fluff (Bengals have a slight ruff) */}
      <ellipse cx="80" cy="44" rx="4" ry="3" fill={c.belly} opacity="0.8" />
      <ellipse cx="92" cy="44" rx="4" ry="3" fill={c.belly} opacity="0.8" />

      {/* Ears — rounded, larger than a typical cat to read as Bengal */}
      <path d="M 79 32 L 77 24 L 84 28 Z" fill={c.base} />
      <path d="M 79.5 31 L 78.5 26 L 82.5 28.5 Z" fill={c.innerEar} />
      <path d="M 93 32 L 95 24 L 88 28 Z" fill={c.base} />
      <path d="M 92.5 31 L 93.5 26 L 89.5 28.5 Z" fill={c.innerEar} />

      {/* Face markings — the classic Bengal "M" */}
      <path
        d="M 82 34 Q 86 36 90 34"
        fill="none"
        stroke={c.rosette}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M 83 37 Q 86 39 89 37"
        fill="none"
        stroke={c.rosette}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Eyes — almond-shaped, green/amber, slit pupil */}
      <ellipse cx="82" cy="41" rx="3.2" ry="2.6" fill={c.eye} />
      <ellipse cx="90" cy="41" rx="3.2" ry="2.6" fill={c.eye} />
      <ellipse cx="82" cy="41" rx="0.9" ry="2.2" fill="#1a1a1a" />
      <ellipse cx="90" cy="41" rx="0.9" ry="2.2" fill="#1a1a1a" />
      {/* Eye shine */}
      <circle cx="83.4" cy="39.8" r="0.6" fill="#ffffff" opacity="0.9" />
      <circle cx="91.4" cy="39.8" r="0.6" fill="#ffffff" opacity="0.9" />

      {/* Nose + mouth */}
      <path d="M 85.6 45 L 86 45.8 L 86.4 45 Z" fill={c.nose} />
      <path
        d="M 86 45.8 Q 84.5 47 83.5 46"
        fill="none"
        stroke={c.rosetteDark}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M 86 45.8 Q 87.5 47 88.5 46"
        fill="none"
        stroke={c.rosetteDark}
        strokeWidth="0.8"
        strokeLinecap="round"
      />

      {/* Whiskers */}
      <path d="M 80 45 L 73 44" stroke={c.rosetteDark} strokeWidth="0.5" strokeLinecap="round" opacity="0.6" />
      <path d="M 80 46 L 73 47" stroke={c.rosetteDark} strokeWidth="0.5" strokeLinecap="round" opacity="0.6" />
      <path d="M 92 45 L 99 44" stroke={c.rosetteDark} strokeWidth="0.5" strokeLinecap="round" opacity="0.6" />
      <path d="M 92 46 L 99 47" stroke={c.rosetteDark} strokeWidth="0.5" strokeLinecap="round" opacity="0.6" />

      {/* Paw detail on planted legs */}
      <circle cx="73.5" cy="68.5" r="0.9" fill={c.rosetteDark} opacity="0.6" />
      <circle cx="63.5" cy="68.5" r="0.9" fill={c.rosetteDark} opacity="0.6" />
    </svg>
  )
}