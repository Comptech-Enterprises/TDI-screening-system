'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { mockScreenings } from '@/lib/mock-data';
import { Role } from '@/lib/types';
import clsx from 'clsx';

const roles: Role[] = ['Sales', 'HR', 'Technology'];
const dateFilters = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'];

export default function Top5Page() {
  const [selectedRole, setSelectedRole] = useState<Role>('Sales');
  const [dateFilter, setDateFilter] = useState('Last 30 days');

  const top5 = mockScreenings
    .filter((s) => s.role === selectedRole && s.recommendation === 'Interview')
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5);

  const rankColors = ['bg-amber-100 text-amber-700 border-amber-300', 'bg-gray-100 text-gray-600 border-gray-300', 'bg-orange-50 text-orange-600 border-orange-300'];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Top 5 Candidates</h1>
        <p className="text-sm text-text-muted mb-6">Best-fit candidates ranked by AI evaluation score</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-xl border border-border p-5 mb-6 flex flex-wrap gap-4 items-center"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">Role</label>
          <div className="flex gap-1.5">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
                  selectedRole === role
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-text-secondary hover:bg-surface-hover'
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">Period</label>
          <div className="flex gap-1.5">
            {dateFilters.map((df) => (
              <button
                key={df}
                onClick={() => setDateFilter(df)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
                  dateFilter === df
                    ? 'bg-primary-lighter text-primary border-primary/20'
                    : 'border-border text-text-muted hover:bg-surface-hover'
                )}
              >
                {df}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {top5.length > 0 ? (
        <div className="space-y-3">
          {top5.map((candidate, i) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="bg-surface rounded-xl border border-border p-5 hover:border-primary/20 transition-all duration-300 group"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border shrink-0',
                    i < 3 ? rankColors[i] : 'bg-background text-text-muted border-border'
                  )}>
                    #{i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{candidate.candidateName}</h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {candidate.currentRole} · {candidate.candidateLocation} · Screened {new Date(candidate.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-muted">Score</span>
                      <span className="text-sm font-bold" style={{ color: candidate.overallScore >= 80 ? 'var(--success)' : 'var(--warning)' }}>
                        {candidate.overallScore}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border-light overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${candidate.overallScore}%` }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: candidate.overallScore >= 80 ? 'var(--success)' : 'var(--warning)' }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/screen/result/${candidate.id}`}
                      className="p-2 rounded-lg hover:bg-primary-lighter text-text-muted hover:text-primary transition-colors"
                      title="View scorecard"
                    >
                      <Eye size={16} />
                    </Link>
                    <button className="p-2 rounded-lg hover:bg-primary-lighter text-text-muted hover:text-primary transition-colors" title="Download resume">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-3 mt-6"
          >
            <Link
              href={`/top5/compare?role=${selectedRole}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors shadow-md"
            >
              <Users size={16} /> Compare top 3
            </Link>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors">
              <Download size={16} /> Export shortlist
            </button>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-xl border border-border p-12 text-center"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <Trophy size={40} className="mx-auto text-text-muted/30 mb-4" />
          <h3 className="text-base font-semibold text-foreground mb-1">No candidates ranked yet</h3>
          <p className="text-sm text-text-muted">
            No candidates have received an Interview recommendation for {selectedRole} yet. Screen more resumes to build your shortlist.
          </p>
        </motion.div>
      )}
    </div>
  );
}
