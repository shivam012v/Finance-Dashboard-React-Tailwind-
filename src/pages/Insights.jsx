import { TrendingUp, TrendingDown, Award, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899'];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-2 font-semibold">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-bold" style={{ color: p.fill || p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function Insights() {
  const { transactions } = useApp();

  const now          = new Date();
  const curMonth     = now.getMonth();
  const curYear      = now.getFullYear();
  const prevMonth    = curMonth === 0 ? 11 : curMonth - 1;
  const prevYear     = curMonth === 0 ? curYear - 1 : curYear;

  const isCur  = t => { const d = new Date(t.date); return d.getMonth() === curMonth  && d.getFullYear() === curYear;  };
  const isPrev = t => { const d = new Date(t.date); return d.getMonth() === prevMonth && d.getFullYear() === prevYear; };

  const curIncome   = transactions.filter(t => isCur(t)  && t.type === 'income').reduce((s, t)  => s + t.amount, 0);
  const curExpense  = transactions.filter(t => isCur(t)  && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const prevIncome  = transactions.filter(t => isPrev(t) && t.type === 'income').reduce((s, t)  => s + t.amount, 0);
  const prevExpense = transactions.filter(t => isPrev(t) && t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const catMap = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const topCat     = sortedCats[0];
  const totalExp   = sortedCats.reduce((s, [, v]) => s + v, 0);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const barData = [
    { name: months[prevMonth], Income: prevIncome, Expenses: prevExpense },
    { name: months[curMonth],  Income: curIncome,  Expenses: curExpense  },
  ];

  const fmt = n => `$${n.toLocaleString()}`;
  const diff = (cur, prev) => prev === 0 ? 0 : Math.round(((cur - prev) / prev) * 100);

  const incomeDiff  = diff(curIncome,  prevIncome);
  const expenseDiff = diff(curExpense, prevExpense);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Insights</h1>
        <p className="text-sm text-slate-400 mt-0.5">Spending patterns and monthly analysis</p>
      </div>

      {/* Top 3 insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Top category */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <Award size={17} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Category</p>
            </div>
          </div>
          {topCat ? (
            <>
              <p className="text-xl font-black text-slate-900 dark:text-white">{topCat[0]}</p>
              <p className="text-sm text-slate-400 mt-1">{fmt(topCat[1])} spent</p>
              <div className="mt-3 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, (topCat[1] / totalExp) * 100).toFixed(0)}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">{((topCat[1] / totalExp) * 100).toFixed(0)}% of total</p>
            </>
          ) : (
            <p className="text-slate-400 text-sm">No data</p>
          )}
        </div>

        {/* Income this month */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp size={17} className="text-emerald-500" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">This Month Income</p>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{fmt(curIncome)}</p>
          <p className="text-sm text-slate-400 mt-1">vs {fmt(prevIncome)} last month</p>
          <div className={`inline-flex items-center gap-1 mt-2 text-xs font-bold px-2.5 py-1 rounded-full ${
            incomeDiff >= 0
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500'
          }`}>
            {incomeDiff >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {incomeDiff >= 0 ? '+' : ''}{incomeDiff}% vs last month
          </div>
        </div>

        {/* Expenses this month */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
              <Zap size={17} className="text-rose-500" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">This Month Spend</p>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{fmt(curExpense)}</p>
          <p className="text-sm text-slate-400 mt-1">vs {fmt(prevExpense)} last month</p>
          <div className={`inline-flex items-center gap-1 mt-2 text-xs font-bold px-2.5 py-1 rounded-full ${
            expenseDiff <= 0
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500'
          }`}>
            {expenseDiff <= 0 ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
            {expenseDiff >= 0 ? '+' : ''}{expenseDiff}% vs last month
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="mb-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">Monthly Comparison</h2>
          <p className="text-xs text-slate-400 mt-0.5">{months[prevMonth]} vs {months[curMonth]}</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} barCategoryGap="50%" barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} width={40} />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="Income"   fill="#10b981" radius={[8,8,0,0]} />
            <Bar dataKey="Expenses" fill="#ef4444" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="mb-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">Spending Breakdown</h2>
          <p className="text-xs text-slate-400 mt-0.5">All time by category</p>
        </div>
        {sortedCats.length === 0 ? (
          <p className="text-center text-slate-400 py-10 text-sm">No expense data available</p>
        ) : (
          <div className="space-y-4">
            {sortedCats.map(([cat, amount], i) => (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{cat}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{((amount / totalExp) * 100).toFixed(0)}%</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200">{fmt(amount)}</span>
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${((amount / totalExp) * 100).toFixed(0)}%`,
                      background: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
