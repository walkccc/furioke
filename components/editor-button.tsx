import type { LucideIcon } from 'lucide-react';

type EditorButtonProps = {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
};

export function EditorButton({
  onClick,
  icon: Icon,
  label,
  disabled,
  className = '',
  iconClassName = '',
}: EditorButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`group relative flex cursor-pointer items-center justify-center rounded-lg p-2 text-subtle transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50 ${className}`}
    >
      <Icon className={`h-4 w-4 ${iconClassName}`} />
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 scale-90 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
        <span className="block whitespace-nowrap rounded bg-tooltip-bg px-2 py-1 text-[10px] font-medium text-tooltip-text shadow-sm">
          {label}
        </span>
        <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-tooltip-bg" />
      </span>
    </button>
  );
}
