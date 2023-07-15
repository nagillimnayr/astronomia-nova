import { cn } from '@/lib/cn';

export function Sidebar() {
  return (
    <aside
      aria-label="Sidenav"
      className={cn(
        'fixed left-0 top-0 z-50 min-h-full w-64 -translate-x-full transition-transform'
      )}
    >
      <div
        className={cn('h-full overflow-y-auto bg-background px-3 py-5')}
      ></div>
    </aside>
  );
}
