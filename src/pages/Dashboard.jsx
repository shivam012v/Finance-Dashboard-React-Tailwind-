import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, ArrowRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { balanceTrend } from '../data/mockData';
import StatCard from '../components/StatCard';
import TransactionModal from '../components/TransactionModal';

const PIE_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899'];

const CAT_COLOR = {
  Food: '#f97316', Transport: '#06b6d4', Shopping: '#8b5cf6', Health: '#10b981',
  Entertainment: '#f59e0b', Utilities: '#6366f1', Salary: '#22c55e', Freelance: '#3b82f6', Investment: '#ec4899',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-base font-bold text-slate-900 dark:text-white">${payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function Dashboard({ setActivePage }) {
  const { transactions, role } = useApp();
  const [showModal, setShowModal] = useState(false);

  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  const categoryMap = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });
  const pieData = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const totalExp = pieData.reduce((s, d) => s + d.value, 0);

  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Transaction
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Net Balance"    value={fmt(balance)} icon={Wallet}      gradient="indigo" sub="Income minus expenses" />
        <StatCard title="Total Income"   value={fmt(income)}  icon={TrendingUp}  gradient="green"  sub="All time earnings"    />
        <StatCard title="Total Expenses" value={fmt(expense)} icon={TrendingDown} gradient="red"   sub="All time spending"    />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Area chart */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">Balance Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
            </div>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
              ↑ 14.8%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={balanceTrend} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2.5} fill="url(#balanceGrad)" dot={false} activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">Spending Split</h2>
            <p className="text-xs text-slate-400 mt-0.5">By category</p>
          </div>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">No data yet</div>
          ) : (
            <>
              <div className="flex justify-center">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => [`$${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {pieData.slice(0, 4).map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {((d.value / totalExp) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 dark:border-slate-800">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">Recent Transactions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest activity</p>
          </div>
          <button
            onClick={() => setActivePage('Transactions')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-3xl mb-2 text-slate-300">--</p>
            <p className="text-sm font-medium text-slate-400">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {recent.map(tx => (
              <div key={tx.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white text-xs font-black flex-shrink-0`}
                    style={{ background: CAT_COLOR[tx.category] || '#6366f1' }}
                  >
                    {tx.category[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{tx.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{tx.date} · {tx.category}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold tabular-nums ${
                  tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <TransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
