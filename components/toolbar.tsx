'use client';

import {
  Download,
  Printer,
  Sparkles,
  SquareSplitHorizontal,
  Trash2,
  Upload,
} from 'lucide-react';
import { useRef } from 'react';

import { ToolbarButton } from '@/components/toolbar-button';
import { Input } from '@/components/ui/input';
import { type Layout, useLanguage } from '@/lib/i18n';

interface ToolbarProps {
  onGenerate: () => void;
  isAnalyzing: boolean;
  layout: Layout;
  onToggleLayout: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onPrint: () => void;
  onClear: () => void;
  title: string;
  onTitleChange: (title: string) => void;
}

export function Toolbar({
  onGenerate,
  isAnalyzing,
  layout,
  onToggleLayout,
  onExport,
  onImport,
  onPrint,
  onClear,
  title,
  onTitleChange,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  }

  return (
    <>
      <div className="no-print border-border bg-background/80 border-b px-4 py-2 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2">
          <ToolbarButton onClick={onGenerate} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <span className="border-primary-foreground inline-block h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
                <span className="hidden md:inline">{t.analyzing}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden md:inline">{t.generate}</span>
              </>
            )}
          </ToolbarButton>

          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={t.titlePlaceholder}
            className="h-8 min-w-0 flex-1 text-sm"
          />

          <div className="flex items-center gap-2">
            <ToolbarButton
              variant="outline"
              onClick={onToggleLayout}
              title={
                layout === 'both'
                  ? t.hideEditor
                  : layout === 'preview'
                    ? t.hidePreview
                    : t.showBoth
              }
            >
              <SquareSplitHorizontal className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">
                {layout === 'both'
                  ? t.hideEditor
                  : layout === 'preview'
                    ? t.hidePreview
                    : t.showBoth}
              </span>
            </ToolbarButton>

            <ToolbarButton
              variant="outline"
              onClick={onExport}
              title={t.export}
            >
              <Download className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">{t.export}</span>
            </ToolbarButton>

            <ToolbarButton
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              title={t.import}
            >
              <Upload className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">{t.import}</span>
            </ToolbarButton>

            <ToolbarButton variant="outline" onClick={onPrint} title={t.print}>
              <Printer className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">{t.print}</span>
            </ToolbarButton>

            <ToolbarButton
              variant="destructive"
              onClick={onClear}
              title={t.clear}
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">{t.clear}</span>
            </ToolbarButton>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </>
  );
}
