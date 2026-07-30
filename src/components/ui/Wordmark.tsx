/**
 * Wordmark. A single connected pair of nodes stands in for the whole idea: two
 * things, and the relationship between them. No abstract globes or gradients.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M5.6 6.4 14.4 13.6" stroke="var(--color-blue-400)" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M5.6 6.4h8.8" stroke="var(--color-blue-700)" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M5.6 6.4v7.2" stroke="var(--color-blue-700)" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="5.6" cy="6.4" r="2.4" fill="var(--color-blue-400)" />
        <circle cx="14.4" cy="13.6" r="2" fill="var(--color-blue-300)" />
        <circle cx="14.4" cy="6.4" r="1.4" fill="var(--color-blue-700)" />
        <circle cx="5.6" cy="13.6" r="1.4" fill="var(--color-blue-700)" />
      </svg>
      <span className="text-[0.9375rem] font-medium tracking-[0.16em] text-fg">EZEKIEL</span>
    </span>
  );
}
