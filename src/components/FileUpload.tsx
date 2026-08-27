'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface Props {
  onFileSelect: (file: File | null) => void;
  file: File | null;
}

export default function FileUpload({ onFileSelect, file }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const handleFile = useCallback((f: File) => {
    if (!validTypes.includes(f.type)) {
      setError('Only PDF and Word documents are supported');
      return;
    }
    setError('');
    onFileSelect(f);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  }, [handleFile]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={clsx(
              'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300',
              dragOver ? 'border-primary bg-primary-lighter scale-[1.01]' : 'border-border hover:border-primary/40 hover:bg-surface-hover'
            )}
          >
            <Upload size={32} className={clsx('mb-3 transition-colors', dragOver ? 'text-primary' : 'text-text-muted')} />
            <p className="text-sm font-medium text-foreground">Drop resume here or click to browse</p>
            <p className="text-xs text-text-muted mt-1">PDF or DOCX, max 10 MB</p>
            <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleChange} />
          </motion.label>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-4 p-4 bg-primary-lighter rounded-xl border border-primary/20"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-text-muted">{formatSize(file.size)}</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary uppercase">
                  {file.name.split('.').pop()}
                </span>
              </div>
            </div>
            <button
              onClick={() => onFileSelect(null)}
              className="p-1.5 rounded-lg hover:bg-danger-bg text-text-muted hover:text-danger transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 mt-2 text-danger text-xs"
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
