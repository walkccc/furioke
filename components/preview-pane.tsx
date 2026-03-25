'use client';

import { useLanguage } from '@/lib/i18n';

interface PreviewPaneProps {
  html: string;
}

export function PreviewPane({ html }: PreviewPaneProps) {
  const { t } = useLanguage();

  return (
    <div className="print-area h-full overflow-y-auto p-4 lg:p-6">
      {html ? (
        <div
          className="prose prose-lg [&_rt]:text-muted-foreground max-w-none leading-[3] [&_rt]:text-[0.55em]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="text-muted-foreground/50 text-sm select-none">
          {t.previewEmpty}
        </p>
      )}
    </div>
  );
}
