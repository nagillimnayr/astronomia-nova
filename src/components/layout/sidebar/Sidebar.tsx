import { Separator } from '@/components/gui/Separator';
import { cn } from '@/lib/cn';
import { useStore } from '@/state/store';

export function Sidebar() {
  const sidebarOpen = useStore((state) => state.sidebarOpen);

  return (
    <aside
      aria-label="Sidenav"
      data-sidebar={sidebarOpen ? 'open' : 'closed'}
      className={cn(
        'fixed -bottom-0 left-0 top-[5rem] z-50 h-auto w-64 -translate-x-full transition-transform data-[sidebar=open]:translate-x-0'
      )}
    >
      <div
        className={cn(
          'flex h-full flex-col items-center justify-start gap-2 overflow-y-auto border-r-2 bg-background px-3 py-5'
        )}
      >
        <header className="text-foreground">
          <h3>Sidebar</h3>
        </header>
        <Separator className="w-full bg-foreground" />

        <section className="h-96 min-h-fit w-full border"></section>
      </div>
    </aside>
  );
}
