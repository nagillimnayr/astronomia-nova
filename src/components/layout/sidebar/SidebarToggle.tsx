import { cn } from '@/lib/cn';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import * as RadixToggle from '@radix-ui/react-toggle';
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

const SidebarToggle = observer(() => {
  // Get uiState from context.
  const { uiState } = useContext(RootStoreContext);

  return (
    <RadixToggle.Root
      aria-label="Toggle Sidenav"
      pressed={uiState.isOutlinerOpen}
      onPressedChange={() => {
        uiState.toggleOutliner();
      }}
      className={cn(
        'inline-flex aspect-square h-full flex-row items-center justify-center rounded-md p-0 text-muted-foreground hover:bg-subtle hover:text-subtle-foreground data-[state=on]:bg-subtle'
      )}
    >
      {uiState.isOutlinerOpen ? (
        <PanelLeftCloseIcon
          strokeWidth={0.7}
          className="aspect-square h-full w-full"
        />
      ) : (
        <PanelLeftOpenIcon
          strokeWidth={0.7}
          className="aspect-square h-full w-full "
        />
      )}
    </RadixToggle.Root>
  );
});

export { SidebarToggle };
