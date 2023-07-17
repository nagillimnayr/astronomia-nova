import KeplerBody from '@/simulation/classes/KeplerBody';
import { MutableRefObject } from 'react';
import { useSelectionStore } from '@/simulation/state/zustand/selection-store';
import { useFloating } from '@floating-ui/react';

export function DetailsPanel() {
  const body = useSelectionStore((state) => state.selected);

  if (!body) return null; // If nothing selected, display nothing.

  return (
    <div className="absolute right-0 top-0 flex h-80 w-60 flex-col items-center justify-start gap-2 rounded-sm border bg-muted p-2 text-muted-foreground">
      <header className="flex w-full flex-row items-center justify-center">
        <h4 className="text-xl">{body.name}</h4>
      </header>
      <div className="flex w-full flex-col items-start justify-start">
        <span>
          Mass:&nbsp;<span>{}</span>
        </span>
        <span>
          Mean radius:&nbsp;<span>{}</span>
        </span>
      </div>
    </div>
  );
}
