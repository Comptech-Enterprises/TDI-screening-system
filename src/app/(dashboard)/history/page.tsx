'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ChevronLeft, ChevronRight, ArrowUpDown, Eye } from 'lucide-react';
import Link from 'next/link';
import { mockScreenings } from '@/lib/mock-data';
import RecommendationBadge from '@/components/RecommendationBadge';
import clsx from 'clsx';

const roleFilters = ['All', 'Sales', 'HR', 'Technology'];
const recFilters = ['All', 'Interview', 'Do Not Interview'];

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [rec, setRec] = useState('All');
  const [sortKey, setSortKey] = useState<'score' | 'date'>('date');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = mockScreenings.filter((s) => {
      const matchesSearch = s.candidateName.toLowerCase().includes(search.toLowerCase());
      const matchesRole = role === 'All' || s.role === role;
      const matchesRec = rec === 'All' || s.recommendation === rec;
      return matchesSearch && matchesRole && matchesRec;
    });
    result = result.sort((a, b) => {
      if (sortKey === 'score') return b.overallScore - a.overallScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [search, role, rec, sortKey]);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Screening History</h1>
        <p className="text-sm text-text-muted">Browse and search all past evaluations</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-xl border border-border p-4 mb-4 flex flex-wrap gap-3 items-center"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search candidate name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {roleFilters.map((r) => <option key={r} value={r}>{r === 'All' ? 'All roles' : r}</option>)}
        </select>
        <select
          value={rec}
          onChange={(e) => setRec(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {recFilters.map((r) => <option key={r} value={r}>{r === 'All' ? 'All recommendations' : r}</option>)}
        </select>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-xl border border-border overflow-hidden"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Candidate</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                <th
                  className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-foreground"
                  onClick={() => setSortKey('score')}
                >
                  <span className="flex items-center gap-1">Score <ArrowUpDown size={12} /></span>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Recommendation</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Screened by</th>
                <th
                  className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-foreground"
                  onClick={() => setSortKey('date')}
                >
                  <span className="flex items-center gap-1">Date <ArrowUpDown size={12} /></span>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="border-b border-border-light last:border-0 hover:bg-surface-hover transition-colors group cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-medium text-foreground">{s.candidateName}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary-lighter text-primary">{s.role}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-foreground">{s.overallScore}%</td>
                  <td className="px-5 py-3.5"><RecommendationBadge recommendation={s.recommendation} /></td>
                  <td className="px-5 py-3.5 text-text-muted hidden md:table-cell">{s.userName}</td>
                  <td className="px-5 py-3.5 text-text-muted">{new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/screen/result/${s.id}`} className="inline-flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye size={14} /> View
                    </Link>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-text-muted text-sm">No screenings match your filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <p className="text-xs text-text-muted">Showing {filtered.length} of {mockScreenings.length} results</p>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-border hover:bg-surface-hover transition-colors disabled:opacity-40" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft size={14} />
            </button>
            <span className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white')}>{page}</span>
            <button className="p-1.5 rounded-lg border border-border hover:bg-surface-hover transition-colors disabled:opacity-40" onClick={() => setPage(page + 1)}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
