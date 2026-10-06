import BengalCat from './BengalCat'

/**
 * Fixed-position layer pinned to the bottom of the viewport.
 *
 * Mounted from within a page (not from Layout) so it only appears on the
 * pages that opt in. Currently mounted on the About page only.
 *
 * In 7B-2 this component gains motion; for now the cats sit still.
 */
export default function CatsLayer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 select-none"
    >
      <div className="mx-auto flex max-w-6xl items-end justify-between px-4 sm:px-6 lg:px-8">
        {/* Mango — warm Bengal, sits on the left */}
        <div className="w-24 translate-y-1 sm:w-28">
          <BengalCat palette="mango" className="h-auto w-full drop-shadow-sm" />
        </div>

        {/* Pixel — silver Bengal, sits on the right */}
        <div className="w-24 translate-y-1 scale-x-[-1] sm:w-28">
          <BengalCat palette="pixel" className="h-auto w-full drop-shadow-sm" />
        </div>
      </div>
    </div>
  )
}