'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { mockScreenings } from '@/lib/mock-data';
import StatusChip from '@/components/StatusChip';
import RecommendationBadge from '@/components/RecommendationBadge';
import ScoreRing from '@/components/ScoreRing';

export default function ComparePage() {
  const candidates = mockScreenings
    .filter((s) => s.role === 'Sales' && s.recommendation === 'Interview')
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 3);

  const allCriteria = candidates[0]?.criteriaResults.map((cr) => cr.criterionName) || [];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link href="/top5" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Top 5
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Compare Candidates</h1>
        <p className="text-sm text-text-muted mt-1">Side-by-side comparison of top 3 Sales candidates</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-xl border border-border overflow-hidden"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider w-48 bg-background/50">Criterion</th>
                {candidates.map((c, i) => (
                  <th key={c.id} className="text-center px-5 py-4 border-l border-border-light min-w-[200px]">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-primary-lighter flex items-center justify-center text-primary font-bold text-sm">
                          {c.candidateName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <p className="font-semibold text-foreground text-sm">{c.candidateName}</p>
                        <ScoreRing score={c.overallScore} size={70} />
                        <RecommendationBadge recommendation={c.recommendation} />
                      </div>
                    </motion.div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allCriteria.map((criterion, ci) => {
                const statuses = candidates.map((c) => c.criteriaResults[ci]?.status);
                const hasDiff = new Set(statuses).size > 1;
                return (
                  <tr
                    key={ci}
                    className={`border-b border-border-light last:border-0 ${hasDiff ? 'bg-warning-bg/30' : 'hover:bg-surface-hover'} transition-colors`}
                  >
                    <td className="px-5 py-3 text-xs font-medium text-foreground bg-background/30">
                      {candidates[0]?.criteriaResults[ci]?.isMustHave && (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-danger-bg text-danger font-bold mr-1.5">MUST</span>
                      )}
                      {criterion}
                    </td>
                    {candidates.map((c) => (
                      <td key={c.id} className="px-5 py-3 text-center border-l border-border-light">
                        <StatusChip status={c.criteriaResults[ci]?.status || 'Not Met'} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
