'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Mail, Phone, MapPin, Building2, Download, ArrowLeft, FileSearch, Flag, AlertTriangle, Star } from 'lucide-react';
import Link from 'next/link';
import ScoreRing from '@/components/ScoreRing';
import RecommendationBadge from '@/components/RecommendationBadge';
import StatusChip from '@/components/StatusChip';
import { mockScreenings } from '@/lib/mock-data';

export default function ScorecardPage() {
  const { id } = useParams();
  const screening = mockScreenings.find((s) => s.id === id) || mockScreenings[0];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-4">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-xl border border-border p-6 mb-6"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-lighter flex items-center justify-center text-primary font-bold text-lg shrink-0">
                {screening.candidateName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{screening.candidateName}</h1>
                <p className="text-sm text-text-secondary">{screening.currentRole} at {screening.currentCompany}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-muted">
              {screening.candidateEmail && (
                <span className="flex items-center gap-1.5"><Mail size={13} />{screening.candidateEmail}</span>
              )}
              {screening.candidatePhone && (
                <span className="flex items-center gap-1.5"><Phone size={13} />{screening.candidatePhone}</span>
              )}
              {screening.candidateLocation && (
                <span className="flex items-center gap-1.5"><MapPin size={13} />{screening.candidateLocation}</span>
              )}
              <span className="flex items-center gap-1.5"><Building2 size={13} />Applied for: <span className="font-semibold text-primary">{screening.role}</span></span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <RecommendationBadge recommendation={screening.recommendation} size="lg" />
            <ScoreRing score={screening.overallScore} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-xl border border-border overflow-hidden mb-6"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Criteria evaluation</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Criterion</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider w-28">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">AI reasoning</th>
              </tr>
            </thead>
            <tbody>
              {screening.criteriaResults.map((cr, i) => (
                <motion.tr
                  key={cr.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.03 }}
                  className="border-b border-border-light last:border-0 hover:bg-surface-hover transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      {cr.isMustHave && <Flag size={12} className="text-danger shrink-0" />}
                      <span className={cr.isMustHave ? 'font-semibold text-foreground' : 'text-foreground'}>
                        {cr.criterionName}
                      </span>
                      {cr.isMustHave && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-danger-bg text-danger font-semibold">MUST</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusChip status={cr.status} />
                  </td>
                  <td className="px-6 py-3.5 text-xs text-text-secondary leading-relaxed max-w-md">
                    {cr.reasoning}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface rounded-xl border border-border p-6"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <Star size={16} className="text-accent" /> Key highlights
          </h3>
          <ul className="space-y-2">
            {screening.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-surface rounded-xl border border-border p-6"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <AlertTriangle size={16} className="text-warning" /> Red flags
          </h3>
          {screening.redFlags.length > 0 ? (
            <ul className="space-y-2">
              {screening.redFlags.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">No red flags identified</p>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap gap-3"
      >
        <Link
          href={`/screen?role=${screening.role}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors shadow-md"
        >
          <FileSearch size={16} /> Screen another resume
        </Link>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors">
          <Download size={16} /> Download scorecard
        </button>
      </motion.div>
    </div>
  );
}
