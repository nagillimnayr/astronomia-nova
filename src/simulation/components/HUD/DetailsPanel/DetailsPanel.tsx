import KeplerBody from '@/simulation/classes/KeplerBody';
import { MutableRefObject } from 'react';
import { useSelectionStore } from '@/simulation/state/zustand/selection-store';
import { useFloating } from '@floating-ui/react';

export function DetailsPanel() {
  const body = useSelectionStore((state) => state.selected);

  if (!body) return null; // If nothing selected, display nothing.

  return (
    <div className="absolute flex h-96 w-48 flex-col items-center justify-start rounded-sm border bg-card text-card-foreground">
      <header className="w-full">
        <h4 className="text-xl">{body.name}</h4>
      </header>
      <div className="flex w-full flex-col items-start justify-start">
        <span>
          Mass:&nbsp;<span>{}</span>
        </span>
        <span>
          Mean radius:&nbsp;<span>{}</span>
        </span>
        <span>
          Orbital speed:&nbsp;<span>{}</span>
        </span>
      </div>
    </div>
  );
}
