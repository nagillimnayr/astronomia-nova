import Outliner from '@/components/Outliner/Outliner';
import { Separator } from '@/components/gui/Separator';
import { cn } from '@/lib/cn';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { type ClassNameValue } from 'tailwind-merge';

type Props = {
  className?: ClassNameValue;
};
const Sidebar = observer(({ className }: Props) => {
  const { uiState } = useContext(RootStoreContext);

  return (
    <aside
      aria-label="Sidenav"
      // data-sidebar={sidebarOpen ? 'open' : 'closed'}
      data-sidebar={uiState.isOutlinerOpen ? 'open' : 'closed'}
      className={cn(
        'top-[5rem] z-50 h-full w-full -translate-x-full bg-muted transition-transform data-[sidebar=open]:translate-x-0',
        className
      )}
    >
      <div
        className={cn(
          'flex h-full flex-col items-center justify-start gap-2 overflow-y-auto border-r-2 px-3 py-5'
        )}
      >
        <section className="mb-6 flex h-full min-h-fit w-full flex-col items-center justify-start border-2 p-2">
          <Outliner />
        </section>
      </div>
    </aside>
  );
});

export { Sidebar };
