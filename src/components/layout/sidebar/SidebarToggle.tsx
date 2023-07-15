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
        'inline-flex aspect-square h-full flex-row items-center justify-center rounded-md border-2 bg-background text-foreground hover:bg-muted  hover:text-muted-foreground data-[state=on]:bg-muted'
      )}
    >
      {sidebarOpen ? (
        <PanelLeftCloseIcon className="aspect-square h-full w-full" />
      ) : (
        <PanelLeftOpenIcon className="aspect-square h-full w-full" />
      )}
      {/* <span className="h-full w-full bg-transparent text-[2em] text-white data-[state=off]:icon-[mdi--menu-close] data-[state=on]:icon-[mdi--menu-open]" /> */}
    </RadixToggle.Root>
  );
}
