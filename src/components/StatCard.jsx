export default function StatCard({ title, value, icon: Icon, gradient, sub, change }) {
  const gradients = {
    indigo: 'from-indigo-500 to-violet-600',
    green:  'from-emerald-400 to-teal-500',
    red:    'from-rose-400 to-pink-600',
  };

  const bgSoft = {
    indigo: 'bg-indigo-50 dark:bg-indigo-500/10',
    green:  'bg-emerald-50 dark:bg-emerald-500/10',
    red:    'bg-rose-50 dark:bg-rose-500/10',
  };

  const textColor = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    green:  'text-emerald-600 dark:text-emerald-400',
    red:    'text-rose-500 dark:text-rose-400',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      {/* Subtle glow */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradients[gradient]} opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-xl`} />

      <div className="flex items-start justify-between relative">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{title}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">${value}</p>
          {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">{sub}</p>}
          {change !== undefined && (
            <div className={`inline-flex items-center gap-1 mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
              change >= 0
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400'
            }`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-2xl ${bgSoft[gradient]} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={textColor[gradient]} />
        </div>
      </div>
    </div>
  );
}
