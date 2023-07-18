import { Html } from '@react-three/drei';
import KeplerBody from '../classes/KeplerBody';
import {
  useCallback,
  MutableRefObject,
  useContext,
  MouseEventHandler,
} from 'react';
import { useSelectionStore } from '../state/zustand/selection-store';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';

/** I don't know what to call this, but its the circle around the bodies to identify their positions when zoomed out really far */

type Props = {
  bodyRef: MutableRefObject<KeplerBody>;
};
export function BillboardCircle({ bodyRef }: Props) {
  const { uiState } = useContext(RootStoreContext);
  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      e.stopPropagation();
      const body = bodyRef.current;

      uiState.select(body);
      // useSelectionStore.getState().select(body);
    },
    [bodyRef, uiState]
  );

  return (
    <object3D>
      <Html center className="h-fit w-fit bg-transparent">
        <div
          onClick={handleClick}
          className="aspect-square w-4 origin-center cursor-pointer rounded-full border-2 border-white bg-transparent transition-transform hover:scale-150 "
        />
      </Html>
    </object3D>
  );
}
