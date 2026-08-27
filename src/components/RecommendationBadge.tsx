'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Recommendation } from '@/lib/types';
import clsx from 'clsx';

interface Props {
  recommendation: Recommendation;
  size?: 'sm' | 'lg';
}

export default function RecommendationBadge({ recommendation, size = 'sm' }: Props) {
  const isInterview = recommendation === 'Interview';
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold rounded-full',
        size === 'lg' ? 'px-5 py-2.5 text-base' : 'px-3 py-1 text-xs',
        isInterview ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
      )}
    >
      {isInterview ? <CheckCircle2 size={size === 'lg' ? 20 : 14} /> : <XCircle size={size === 'lg' ? 20 : 14} />}
      {recommendation}
    </motion.span>
  );
}
