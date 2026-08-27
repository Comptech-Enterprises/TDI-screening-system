'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface Props {
  onFilesChange: (files: File[]) => void;
  files: File[];
  multiple?: boolean;
}

export default function FileUpload({ onFilesChange, files, multiple = true }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];

  const handleIncomingFiles = useCallback(
    (newFilesList: FileList | File[]) => {
      const incoming = Array.from(newFilesList);
      const invalidFiles = incoming.filter((f) => {
        const isExtValid = f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.doc');
        return !validTypes.includes(f.type) && !isExtValid;
      });

      if (invalidFiles.length > 0) {
        setError('Only PDF and Word (.docx/.doc) files are supported');
        return;
      }

      setError('');
      if (multiple) {
        // Prevent duplicate file additions by name & size
        const combined = [...files];
        incoming.forEach((f) => {
          if (!combined.some((cf) => cf.name === f.name && cf.size === f.size)) {
            combined.push(f);
          }
        });
        onFilesChange(combined);
      } else {
        onFilesChange([incoming[0]]);
      }
    },
    [files, multiple, onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleIncomingFiles(e.dataTransfer.files);
      }
    },
    [handleIncomingFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleIncomingFiles(e.target.files);
        // Reset input value so same files can be re-selected if deleted
        e.target.value = '';
      }
    },
    [handleIncomingFiles]
  );

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  const clearAll = () => {
    onFilesChange([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="w-full space-y-4">
      <motion.label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={clsx(
          'flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 relative',
          files.length === 0 ? 'h-48' : 'h-36',
          dragOver
            ? 'border-primary bg-primary-lighter scale-[1.01]'
            : 'border-border bg-surface hover:border-primary/40 hover:bg-surface-hover'
        )}
      >
        <div className="flex flex-col items-center justify-center p-4 text-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Upload size={24} className={clsx('transition-colors', dragOver ? 'text-primary' : 'text-primary')} />
          </div>
          <p className="text-sm font-semibold text-foreground">
            {files.length > 0 ? 'Add more resumes or drop here' : 'Drop resumes here or click to browse'}
          </p>
          <p className="text-xs text-text-muted mt-1">
            Upload multiple PDF or DOCX files at once (Batch screening supported)
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.docx,.doc"
          multiple={multiple}
          onChange={handleChange}
        />
      </motion.label>

      {/* Selected Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                {files.length} {files.length === 1 ? 'Resume' : 'Resumes'} Selected ({formatSize(totalSize)})
              </span>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-danger hover:underline flex items-center gap-1 transition-colors"
              >
                <Trash2 size={13} /> Clear all
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border hover:border-primary/30 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-text-muted">{formatSize(file.size)}</span>
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold bg-primary/10 text-primary uppercase">
                        {file.name.split('.').pop()}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1.5 rounded-lg text-text-muted hover:bg-danger-bg hover:text-danger transition-colors shrink-0"
                    title="Remove file"
                  >
                    <X size={15} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 bg-danger-bg text-danger rounded-xl text-xs"
          >
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
