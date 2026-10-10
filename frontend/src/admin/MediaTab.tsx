import MediaLibrary from './MediaLibrary'

export default function MediaTab() {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="mb-5 text-sm text-ink-600 dark:text-ink-400">
        Upload images here, then pick them from any image field (logo, hero picture, testimonials…). An image that is
        in use on the site can’t be deleted until you remove it from the pages and publish.
      </p>
      <MediaLibrary />
    </div>
  )
}
