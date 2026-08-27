'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'amber' | 'purple';
  index: number;
}

const colorMap = {
  blue: { bg: 'bg-primary-lighter', text: 'text-primary', icon: 'text-primary' },
  green: { bg: 'bg-success-bg', text: 'text-success', icon: 'text-success' },
  amber: { bg: 'bg-warning-bg', text: 'text-warning', icon: 'text-warning' },
  purple: { bg: 'bg-[#f3e8ff]', text: 'text-[#7c3aed]', icon: 'text-[#7c3aed]' },
};

export default function StatsCard({ label, value, subtitle, icon: Icon, color, index }: StatsCardProps) {
  const colors = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="bg-surface rounded-xl border border-border p-5 hover:border-primary/20 transition-all duration-300 group"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-muted mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
        </div>
        <div className={`${colors.bg} p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} className={colors.icon} />
        </div>
      </div>
    </motion.div>
  );
}
