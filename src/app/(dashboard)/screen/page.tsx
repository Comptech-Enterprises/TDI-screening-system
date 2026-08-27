'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { Role } from '@/lib/types';
import clsx from 'clsx';

const roles: Role[] = ['Sales', 'HR', 'Technology'];

export default function ScreenPage() {
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as Role) || 'Sales';
  const [selectedRole, setSelectedRole] = useState<Role>(defaultRole);
  const [file, setFile] = useState<File | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const router = useRouter();

  const handleEvaluate = async () => {
    if (!file || !selectedRole) return;
    setEvaluating(true);
    await new Promise((r) => setTimeout(r, 3000));
    router.push('/screen/result/1');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Screen Resume</h1>
        <p className="text-sm text-text-muted mb-8">Select role, upload resume, get instant AI evaluation</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!evaluating ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface rounded-xl border border-border p-6"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <label className="block text-sm font-semibold text-foreground mb-3">Select role</label>
              <div className="flex gap-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={clsx(
                      'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border',
                      selectedRole === role
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-background text-text-secondary border-border hover:border-primary/30 hover:bg-surface-hover'
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface rounded-xl border border-border p-6"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <label className="block text-sm font-semibold text-foreground mb-3">Upload resume</label>
              <FileUpload file={file} onFileSelect={setFile} />
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleEvaluate}
              disabled={!file || !selectedRole}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Sparkles size={18} />
              Evaluate candidate
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface rounded-xl border border-border p-12 flex flex-col items-center justify-center"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="mb-6"
            >
              <Loader2 size={40} className="text-primary" />
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Analyzing resume</h3>
            <p className="text-sm text-text-muted text-center">
              Evaluating against {selectedRole} criteria...
            </p>
            <div className="w-48 h-1.5 bg-border-light rounded-full mt-6 overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '90%' }}
                transition={{ duration: 3, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
