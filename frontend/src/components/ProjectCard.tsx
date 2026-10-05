import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../lib/types'

type Props = {
  project: Project
  featured?: boolean
}

export default function ProjectCard({ project, featured = false }: Props) {
  const tags = project.tags.split(',').filter(Boolean)

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-md ${
        featured ? 'sm:col-span-2' : ''
      }`}
    >
      <div className={`relative overflow-hidden bg-ink-100 ${featured ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
        <img
          src={project.cover_image_url}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ink-700 shadow-sm backdrop-blur">
          {project.year}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
            {project.client}
          </p>
          <ArrowUpRight className="size-4 text-ink-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
        </div>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
          {project.summary}
        </p>
        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-ink-200 bg-ink-50 px-2.5 py-0.5 text-xs font-medium text-ink-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}