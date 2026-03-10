import { Download, FileUp, Printer, Sparkles, Trash2 } from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';

import { EditorButton } from '@/components/editor-button';

type LyricsEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onImport: (text: string) => void;
  onExport: () => void;
  onAutoFurigana: () => void;
  onClear: () => void;
  onPrint: () => void;
  isAutoFuriganaLoading: boolean;
  labels: {
    title: string;
    autoFurigana: string;
    importTxt: string;
    exportTxt: string;
    print: string;
    clear: string;
    placeholder: string;
    dropToImport: string;
  };
};

export default function LyricsEditor({
  value,
  onChange,
  onImport,
  onExport,
  onAutoFurigana,
  onClear,
  onPrint,
  isAutoFuriganaLoading,
  labels,
}: LyricsEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    readAndImportFile(file);
    event.target.value = '';
  };

  const readAndImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      onImport(String(reader.result ?? ''));
    };
    reader.readAsText(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.txt'))) {
      readAndImportFile(file);
    }
  };

  return (
    <div
      className={`relative rounded-3xl border transition-colors ${
        isDragging
          ? 'border-foreground/30 bg-surface-hover'
          : 'border-border bg-surface'
      } p-6 shadow-sm backdrop-blur`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-[0.2em] text-muted">
          {labels.title}
        </h2>
        <div className="flex gap-1">
          <EditorButton
            onClick={onAutoFurigana}
            disabled={isAutoFuriganaLoading}
            label={labels.autoFurigana}
            icon={Sparkles}
            iconClassName={isAutoFuriganaLoading ? 'animate-pulse' : ''}
          />
          <EditorButton
            onClick={handleImportClick}
            label={labels.importTxt}
            icon={FileUp}
          />
          <EditorButton
            onClick={onExport}
            label={labels.exportTxt}
            icon={Download}
          />
          <EditorButton onClick={onPrint} label={labels.print} icon={Printer} />
          <EditorButton
            onClick={onClear}
            label={labels.clear}
            icon={Trash2}
            className="hover:text-error"
          />
        </div>
      </div>
      <textarea
        className="min-h-[240px] w-full resize-y bg-transparent text-lg leading-relaxed text-foreground placeholder:text-subtle focus:outline-none"
        placeholder={labels.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={handleImportChange}
      />
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl bg-overlay backdrop-blur-[2px]">
          <p className="text-sm font-medium text-muted-strong">
            {labels.dropToImport}
          </p>
        </div>
      )}
    </div>
  );
}
