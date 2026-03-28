'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type TranslationTarget } from '@/lib/translate';
import { useLanguage } from '@/lib/i18n';

interface TranslationDialogProps {
  open: boolean;
  onClose: () => void;
  target: TranslationTarget;
  result: string;
  isTranslating: boolean;
  error: string;
}

const TARGET_LABEL: Record<TranslationTarget, string> = {
  en: 'English',
  'zh-TW': '繁體中文',
};

export function TranslationDialog({
  open,
  onClose,
  target,
  result,
  isTranslating,
  error,
}: TranslationDialogProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {t.translationResult} — {TARGET_LABEL[target]}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-32">
          {isTranslating ? (
            <div className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
              <span className="border-primary inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              {t.translating}
            </div>
          ) : error ? (
            <p className="text-destructive py-4 text-sm">{error}</p>
          ) : (
            <pre className="text-foreground max-h-96 overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {result}
            </pre>
          )}
        </div>

        {!isTranslating && !error && result && (
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {t.copyTranslation}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
