'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Users,
  Award,
  TrendingUp,
  Download,
  ArrowRight,
  RefreshCw,
  Eye,
  FileCheck2,
  Filter,
} from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import RecommendationBadge from '@/components/RecommendationBadge';
import ScoreRing from '@/components/ScoreRing';
import { Role, Recommendation, Screening } from '@/lib/types';
import { mockScreenings } from '@/lib/mock-data';
import Link from 'next/link';
import clsx from 'clsx';

const roles: Role[] = ['Sales', 'HR', 'Technology'];

interface AnalyzedResult {
  id: string;
  fileName: string;
  candidateName: string;
  role: Role;
  currentRole: string;
  currentCompany: string;
  overallScore: number;
  recommendation: Recommendation;
  highlights: string[];
  redFlags: string[];
  matchedMustHaves: number;
  totalMustHaves: number;
}

function ScreenContent() {
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as Role) || 'Sales';
  const [selectedRole, setSelectedRole] = useState<Role>(defaultRole);
  const [files, setFiles] = useState<File[]>([]);
  const [processingState, setProcessingState] = useState<'idle' | 'analyzing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);
  const [results, setResults] = useState<AnalyzedResult[]>([]);
  const [filterRec, setFilterRec] = useState<'All' | 'Interview' | 'Do Not Interview'>('All');

  const startAnalysis = async () => {
    if (files.length === 0 || !selectedRole) return;
    setProcessingState('analyzing');
    setProgress(0);
    setCurrentProcessingIndex(0);

    const relevantPool = mockScreenings.filter((s) => s.role === selectedRole);
    const backupPool = mockScreenings;

    // Generate smart mock results for each uploaded file
    const generatedResults: AnalyzedResult[] = files.map((file, idx) => {
      const matched = relevantPool[idx % relevantPool.length] || backupPool[idx % backupPool.length];
      // Clean up candidate name from filename if possible, otherwise use matched candidate name
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/resume|cv/gi, '')
        .trim();

      const candidateName =
        cleanName.length > 2 && !/^\d+$/.test(cleanName)
          ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
          : matched.candidateName;

      return {
        id: matched.id || `${idx + 1}`,
        fileName: file.name,
        candidateName: candidateName,
        role: selectedRole,
        currentRole: matched.currentRole,
        currentCompany: matched.currentCompany,
        overallScore: matched.overallScore,
        recommendation: matched.recommendation,
        highlights: matched.highlights,
        redFlags: matched.redFlags,
        matchedMustHaves: matched.recommendation === 'Interview' ? 3 : 1,
        totalMustHaves: 3,
      };
    });

    // Simulate batch progress
    const totalFiles = files.length;
    for (let i = 0; i < totalFiles; i++) {
      setCurrentProcessingIndex(i);
      await new Promise((r) => setTimeout(r, 900));
      setProgress(Math.round(((i + 1) / totalFiles) * 100));
    }

    setResults(generatedResults);
    setProcessingState('completed');
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setProcessingState('idle');
    setProgress(0);
    setCurrentProcessingIndex(0);
  };

  const interviewCount = results.filter((r) => r.recommendation === 'Interview').length;
  const avgScore = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.overallScore, 0) / results.length) : 0;
  const filteredResults = results.filter((r) => filterRec === 'All' || r.recommendation === filterRec);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Bulk Resume Screening</h1>
        <p className="text-sm text-text-muted">
          Upload candidate resumes in bulk — AI will parse, evaluate criteria, and rank all candidates.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1: Upload & Configuration Form */}
        {processingState === 'idle' && (
          <motion.div
            key="upload-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Role Selection */}
            <div className="bg-surface rounded-xl border border-border p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">Target Role for Screening</label>
                <span className="text-xs text-text-muted">Evaluates against role-specific criteria</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={clsx(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border text-center flex flex-col items-center justify-center gap-1',
                      selectedRole === role
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-background text-text-secondary border-border hover:border-primary/40 hover:bg-surface-hover'
                    )}
                  >
                    <span className="font-semibold">{role}</span>
                    <span className={clsx('text-[11px]', selectedRole === role ? 'text-white/80' : 'text-text-muted')}>
                      {role === 'Sales' && 'Real estate & properties'}
                      {role === 'HR' && 'Talent & HR ops'}
                      {role === 'Technology' && 'Full stack & Cloud'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk File Upload */}
            <div className="bg-surface rounded-xl border border-border p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">Upload Resumes (Bulk Supported)</label>
                <span className="text-xs text-text-muted">Drop multiple files or click to select</span>
              </div>
              <FileUpload files={files} onFilesChange={setFiles} multiple={true} />
            </div>

            {/* Start Screening Action */}
            <motion.button
              type="button"
              onClick={startAnalysis}
              disabled={files.length === 0}
              whileHover={{ scale: files.length > 0 ? 1.01 : 1 }}
              whileTap={{ scale: files.length > 0 ? 0.99 : 1 }}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary text-white text-base font-semibold hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Sparkles size={20} />
              {files.length === 0
                ? 'Select resumes to evaluate'
                : `Start AI Analysis (${files.length} ${files.length === 1 ? 'Resume' : 'Resumes'})`}
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Live AI Batch Analysis Screen */}
        {processingState === 'analyzing' && (
          <motion.div
            key="analyzing-view"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-surface rounded-2xl border border-border p-8 md:p-12 text-center"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary"
            >
              <Loader2 size={36} />
            </motion.div>

            <h2 className="text-xl font-bold text-foreground mb-2">Analyzing Resumes in Bulk</h2>
            <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
              AI is extracting candidate details, matching against {selectedRole} must-have criteria, and scoring overall fit.
            </p>

            {/* Overall Progress Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-medium">
                <span>
                  Processing {Math.min(currentProcessingIndex + 1, files.length)} of {files.length} resumes
                </span>
                <span className="font-semibold text-primary">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-border-light rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current Files Processing Status */}
            <div className="max-w-lg mx-auto space-y-2 text-left">
              {files.map((file, idx) => {
                const isDone = idx < currentProcessingIndex || progress === 100;
                const isCurrent = idx === currentProcessingIndex && progress < 100;
                return (
                  <div
                    key={file.name + idx}
                    className={clsx(
                      'flex items-center justify-between p-3 rounded-xl border transition-all text-xs',
                      isDone
                        ? 'bg-success/5 border-success/20 text-success'
                        : isCurrent
                        ? 'bg-primary/5 border-primary/30 text-primary font-medium'
                        : 'bg-background border-border text-text-muted'
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-success shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 size={16} className="animate-spin text-primary shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-border-light shrink-0" />
                      )}
                      <span className="truncate">{file.name}</span>
                    </div>
                    <span className="shrink-0 text-[11px]">
                      {isDone ? 'Evaluated' : isCurrent ? 'Analyzing...' : 'Queued'}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 3: Analysis Results View ("What they got") */}
        {processingState === 'completed' && (
          <motion.div
            key="results-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Batch Overview Banner */}
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold mb-2">
                    <CheckCircle2 size={14} /> Batch Screening Complete
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    Evaluated {results.length} Resumes for {selectedRole}
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    Ranked by AI Fit Score and Must-Have Criteria Match
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-xs font-medium text-text-secondary hover:bg-surface-hover transition-colors"
                  >
                    <RefreshCw size={14} /> Screen New Batch
                  </button>
                  <Link
                    href={`/top5/compare?role=${selectedRole}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-colors shadow-sm"
                  >
                    <Users size={14} /> Compare Candidates
                  </Link>
                </div>
              </div>

              {/* Batch KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
                <div className="p-3.5 bg-background rounded-xl border border-border">
                  <p className="text-xs text-text-muted mb-1">Total Resumes</p>
                  <p className="text-2xl font-bold text-foreground">{results.length}</p>
                </div>
                <div className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                  <p className="text-xs text-emerald-700 font-medium mb-1">Shortlisted</p>
                  <p className="text-2xl font-bold text-emerald-700">{interviewCount}</p>
                </div>
                <div className="p-3.5 bg-background rounded-xl border border-border">
                  <p className="text-xs text-text-muted mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
                </div>
                <div className="p-3.5 bg-violet-500/5 rounded-xl border border-violet-500/20">
                  <p className="text-xs text-violet-700 font-medium mb-1">Pass Rate</p>
                  <p className="text-2xl font-bold text-violet-700">
                    {results.length > 0 ? Math.round((interviewCount / results.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(['All', 'Interview', 'Do Not Interview'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterRec(filter)}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      filterRec === filter
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-surface text-text-secondary border-border hover:bg-surface-hover'
                    )}
                  >
                    {filter === 'All' ? `All (${results.length})` : filter}
                  </button>
                ))}
              </div>
              <span className="text-xs text-text-muted">Showing {filteredResults.length} candidates</span>
            </div>

            {/* Ranked Candidates Cards List */}
            <div className="space-y-4">
              {filteredResults.map((candidate, idx) => (
                <motion.div
                  key={candidate.id + idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-surface rounded-2xl border border-border p-5 hover:border-primary/30 transition-all group"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Rank Badge & Initials */}
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx(
                          'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border shrink-0',
                          idx === 0
                            ? 'bg-amber-100 text-amber-700 border-amber-300'
                            : idx === 1
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : idx === 2
                            ? 'bg-orange-50 text-orange-700 border-orange-300'
                            : 'bg-background text-text-muted border-border'
                        )}
                      >
                        #{idx + 1}
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {candidate.candidateName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                    </div>

                    {/* Candidate Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-1">
                        <h3 className="font-bold text-foreground text-base">{candidate.candidateName}</h3>
                        <RecommendationBadge recommendation={candidate.recommendation} size="sm" />
                      </div>
                      <p className="text-xs text-text-muted mb-3">
                        {candidate.currentRole} at {candidate.currentCompany} · File: <span className="font-mono text-text-secondary">{candidate.fileName}</span>
                      </p>

                      {/* Top Highlights Preview */}
                      <div className="space-y-1">
                        {candidate.highlights.slice(0, 2).map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs text-text-secondary">
                            <span className="text-success mt-0.5">✓</span>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Score & Action Button */}
                    <div className="flex items-center md:flex-col justify-between md:justify-center items-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                      <div className="flex items-center gap-3">
                        <ScoreRing score={candidate.overallScore} size={58} strokeWidth={5} />
                      </div>
                      <Link
                        href={`/screen/result/${candidate.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-colors shadow-sm"
                      >
                        <Eye size={13} /> Full Scorecard
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredResults.length === 0 && (
                <div className="p-12 text-center bg-surface rounded-xl border border-border text-text-muted text-sm">
                  No candidates match the selected filter.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ScreenPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-muted">Loading screening form...</div>}>
      <ScreenContent />
    </Suspense>
  );
}
