import clsx from 'clsx';
import { CriterionStatus } from '@/lib/types';

const statusStyles: Record<CriterionStatus, string> = {
  'Met': 'bg-success-bg text-success',
  'Partially Met': 'bg-warning-bg text-warning',
  'Not Met': 'bg-danger-bg text-danger',
};

export default function StatusChip({ status }: { status: CriterionStatus }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', statusStyles[status])}>
      {status}
    </span>
  );
}
