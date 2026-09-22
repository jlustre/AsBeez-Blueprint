import type { ChangeEvent, ReactNode } from 'react';
import { Upload } from 'lucide-react';

import { useTranslation } from '../../../i18n';

export const fieldClass = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500';

export function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}{required ? <span className="text-red-600"> *</span> : null}
      {children}
      {error ? <span className="mt-1 block text-xs font-normal text-red-600">{error}</span> : null}
      {hint && !error ? <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function UploadDrop({
  label,
  hint,
  accept,
  multiple,
  files,
  disabled,
  onFiles,
}: {
  label: string;
  hint: string;
  accept: string;
  multiple?: boolean;
  files: string[];
  disabled?: boolean;
  onFiles: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const { t } = useTranslation();

  return (
    <label className={`mt-5 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 p-7 text-center hover:border-amber-500 hover:bg-amber-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-500 ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
      <Upload className="h-8 w-8 text-amber-600" aria-hidden />
      <span className="mt-2 font-semibold">{label}</span>
      <span className="text-xs text-slate-500">{hint}</span>
      {files.length > 0 ? <span className="mt-2 text-xs font-medium text-slate-700">{t('sell.filesSelected', { count: files.length })}</span> : null}
      <input type="file" multiple={multiple} accept={accept} className="sr-only" disabled={disabled} onChange={onFiles} />
    </label>
  );
}
