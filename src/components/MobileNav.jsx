import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';

const pages = [
  { name: 'Dashboard',    icon: LayoutDashboard },
  { name: 'Transactions', icon: ArrowLeftRight  },
  { name: 'Insights',     icon: Lightbulb       },
];

export default function MobileNav({ activePage, setActivePage }) {
  const { darkMode } = useApp();

  return (
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 dark:border-slate-800/80 flex"
      style={{
        background: darkMode ? 'rgba(2,6,23,0.92)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {pages.map(({ name, icon: Icon }) => (
        <button
          key={name}
          onClick={() => setActivePage(name)}
          className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition-all duration-200 ${
            activePage === name
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <Icon size={20} strokeWidth={activePage === name ? 2.5 : 1.8} />
          {name}
        </button>
      ))}
    </div>
  );
}
