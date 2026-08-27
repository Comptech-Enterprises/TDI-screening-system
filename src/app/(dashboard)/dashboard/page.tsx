'use client';

import { motion } from 'framer-motion';
import { Users, CalendarDays, TrendingUp, Award, Briefcase, UserCog, Cpu, Eye, ChevronRight } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import RecommendationBadge from '@/components/RecommendationBadge';
import { dashboardStats, mockScreenings } from '@/lib/mock-data';
import Link from 'next/link';

const roleCards = [
  { role: 'Sales', icon: Briefcase, description: 'Real estate & property sales', color: 'from-blue-500/10 to-blue-600/5', border: 'hover:border-blue-300' },
  { role: 'HR', icon: UserCog, description: 'Human resources & recruitment', color: 'from-emerald-500/10 to-emerald-600/5', border: 'hover:border-emerald-300' },
  { role: 'Technology', icon: Cpu, description: 'IT & technical roles', color: 'from-violet-500/10 to-violet-600/5', border: 'hover:border-violet-300' },
];

export default function DashboardPage() {
  const recentScreenings = mockScreenings.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">Welcome back, Priya</h1>
        <p className="text-sm text-text-muted mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Screened today" value={dashboardStats.todayCount} icon={Users} color="blue" index={0} />
        <StatsCard label="This week" value={dashboardStats.weekCount} icon={CalendarDays} color="green" index={1} />
        <StatsCard label="Avg fit score" value={`${dashboardStats.avgScore}%`} icon={TrendingUp} color="amber" index={2} />
        <StatsCard label="Interview rate" value={`${dashboardStats.passRate}%`} icon={Award} color="purple" index={3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Screen by role</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roleCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`bg-surface rounded-xl border border-border ${card.border} p-6 transition-all duration-300 group`}
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{card.role}</h3>
                <p className="text-xs text-text-muted mt-1 mb-5">{card.description}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/screen?role=${card.role}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-colors shadow-sm"
                  >
                    Screen resume
                  </Link>
                  <Link
                    href={`/top5?role=${card.role}`}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-border text-text-secondary text-xs font-medium hover:bg-surface-hover transition-colors"
                  >
                    Top 5
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent screenings</h2>
          <Link href="/history" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="bg-surface rounded-xl border border-border overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Candidate</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Score</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                  <th className="text-right px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recentScreenings.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="border-b border-border-light last:border-0 hover:bg-surface-hover transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">{s.candidateName}</p>
                      <p className="text-xs text-text-muted">{s.currentRole}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary-lighter text-primary">
                        {s.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-border-light overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${s.overallScore}%`,
                              backgroundColor: s.overallScore >= 80 ? 'var(--success)' : s.overallScore >= 60 ? 'var(--warning)' : 'var(--danger)',
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-foreground">{s.overallScore}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <RecommendationBadge recommendation={s.recommendation} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-text-muted">
                      {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/screen/result/${s.id}`}
                        className="inline-flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye size={14} /> View
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
