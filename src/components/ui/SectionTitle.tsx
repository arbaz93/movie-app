interface SectionTitleProps {
  title: string
  subtitle?: string
}

export const SectionTitle = ({ title, subtitle }: SectionTitleProps) => (
  <div className="mb-4 flex items-end justify-between gap-4">
    <h2 className="text-xl font-semibold text-slate-100 md:text-2xl">{title}</h2>
    {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
  </div>
)
