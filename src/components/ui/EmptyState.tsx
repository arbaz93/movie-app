interface EmptyStateProps {
  title: string
  description: string
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-8 text-center">
    <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">{description}</p>
  </div>
)
