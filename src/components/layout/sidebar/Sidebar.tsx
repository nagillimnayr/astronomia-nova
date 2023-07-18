import Outliner from '@/components/Outliner/Outliner';
import { Separator } from '@/components/gui/Separator';
import { cn } from '@/lib/cn';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';

const Sidebar = observer(() => {
  const { uiState } = useContext(RootStoreContext);

  return (
    <aside
      aria-label="Sidenav"
      // data-sidebar={sidebarOpen ? 'open' : 'closed'}
      data-sidebar={uiState.isOutlinerOpen ? 'open' : 'closed'}
      className={cn(
        'fixed -bottom-0 left-0 top-[5rem] z-50 h-auto w-64 -translate-x-full bg-muted transition-transform data-[sidebar=open]:translate-x-0'
      )}
    >
      <div
        className={cn(
          'flex h-full flex-col items-center justify-start gap-2 overflow-y-auto border-r-2 px-3 py-5'
        )}
      >
        <header className="text-foreground">
          <h3>Sidebar</h3>
        </header>
        <Separator className="h-px w-full border-y bg-border" />

        <section className="mb-6 flex h-full min-h-fit w-full flex-col items-center justify-start border-2 p-2">
          <Outliner />
        </section>
      </div>
    </aside>
  );
});

export { Sidebar };
