import { cn } from '@/lib/cn';
import { useStore } from '@/state/store';
import * as RadixToggle from '@radix-ui/react-toggle';
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';

export function SidebarToggle() {
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const setSidebarOpen = useStore((state) => state.setSidebarOpen);

  return (
    <RadixToggle.Root
      aria-label="Toggle Sidenav"
      pressed={sidebarOpen}
      onPressedChange={setSidebarOpen}
      className={cn(
        'inline-flex aspect-square h-full flex-row items-center justify-center rounded-md p-0 text-muted-foreground hover:bg-subtle hover:text-subtle-foreground data-[state=on]:bg-subtle'
      )}
    >
      {sidebarOpen ? (
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
}
