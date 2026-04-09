import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronUp, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import TransactionModal from '../components/TransactionModal';

const CAT_COLOR = {
  Food: '#f97316', Transport: '#06b6d4', Shopping: '#8b5cf6', Health: '#10b981',
  Entertainment: '#f59e0b', Utilities: '#6366f1', Salary: '#22c55e', Freelance: '#3b82f6', Investment: '#ec4899',
};

const selectCls = [
  'px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700',
  'bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all',
].join(' ');

export default function Transactions() {
  const { transactions, deleteTransaction, role, filters, setFilters } = useApp();
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { search, type, category, sort } = filters;

  const filtered = transactions
    .filter(t => {
      const q = search.toLowerCase();
      const matchSearch = t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchType   = type === 'all'     || t.type     === type;
      const matchCat    = category === 'all' || t.category === category;
      return matchSearch && matchType && matchCat;
    })
    .sort((a, b) => {
      if (sort === 'date-desc')   return new Date(b.date) - new Date(a.date);
      if (sort === 'date-asc')    return new Date(a.date) - new Date(b.date);
      if (sort === 'amount-desc') return b.amount - a.amount;
      if (sort === 'amount-asc')  return a.amount - b.amount;
      return 0;
    });

  const openAdd    = () => { setEditing(null); setShowModal(true); };
  const openEdit   = (tx) => { setEditing(tx); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const SortBtn = ({ field }) => {
    const isActive = sort.startsWith(field);
    const isDesc   = sort === `${field}-desc`;
    return (
      <button
        onClick={() => setFilters({ ...filters, sort: isDesc ? `${field}-asc` : `${field}-desc` })}
        className={`ml-1 transition-colors ${isActive ? 'text-indigo-500' : 'text-slate-300 dark:text-slate-600'}`}
      >
        {isDesc ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
      </button>
    );
  };

  const totalIncome  = filtered.filter(t => t.type === 'income').reduce((s, t)  => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Transactions</h1>
          <p className="text-sm text-slate-400 mt-0.5">{filtered.length} of {transactions.length} records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={[
              'p-2 rounded-xl border transition-all',
              showFilters
                ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-500'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 bg-white dark:bg-slate-900',
            ].join(' ')}
          >
            <SlidersHorizontal size={16} />
          </button>
          {role === 'admin' && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              <Plus size={15} strokeWidth={2.5} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Income</span>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">${totalIncome.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-500/10 rounded-2xl">
          <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">Expenses</span>
          <span className="text-sm font-black text-rose-500 dark:text-rose-400">${totalExpense.toLocaleString()}</span>
        </div>
      </div>

      {/* Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search by description or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <select value={type} onChange={e => setFilters({ ...filters, type: e.target.value })} className={selectCls}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={category} onChange={e => setFilters({ ...filters, category: e.target.value })} className={selectCls}>
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={() => setFilters({ search: '', type: 'all', category: 'all', sort: 'date-desc' })}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">--</p>
            <p className="font-bold text-slate-500 dark:text-slate-400">No transactions found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center">Date <SortBtn field="date" /></span>
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden md:table-cell">Category</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:table-cell">Type</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center justify-end">Amount <SortBtn field="amount" /></span>
                  </th>
                  {role === 'admin' && <th className="px-5 py-3.5 w-20" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap font-medium">{tx.date}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                          style={{ background: CAT_COLOR[tx.category] || '#6366f1' }}
                        >
                          {tx.category[0]}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">{tx.category}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className={[
                        'px-2.5 py-1 rounded-xl text-xs font-bold',
                        tx.type === 'income'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400',
                      ].join(' ')}>
                        {tx.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className={[
                      'px-5 py-3.5 text-right text-sm font-black tabular-nums',
                      tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500',
                    ].join(' ')}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                    {role === 'admin' && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(tx)} className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-500 transition-all">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-300 hover:text-rose-500 transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <TransactionModal onClose={closeModal} existing={editing} />}
    </div>
  );
}
