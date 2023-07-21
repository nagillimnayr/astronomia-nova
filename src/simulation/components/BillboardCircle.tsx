import { Html } from '@react-three/drei';
import type KeplerBody from '../classes/KeplerBody';
import {
  useCallback,
  type MutableRefObject,
  useContext,
  type MouseEventHandler,
  useRef,
} from 'react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();

/** I don't know what to call this, but its the circle around the bodies to identify their positions when zoomed out really far */

type Props = {
  bodyRef: MutableRefObject<KeplerBody>;
};
export function BillboardCircle({ bodyRef }: Props) {
  const { uiState } = useContext(RootStoreContext);

  const ref = useRef<HTMLDivElement>(null!);
  // const getThree = useThree((state) => state.get);

  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      e.stopPropagation();
      const body = bodyRef.current;

      uiState.select(body);
      // useSelectionStore.getState().select(body);
    },
    [bodyRef, uiState]
  );

  useFrame(({ camera, controls }) => {
    // Reduce the opacity when close enough to the camera.

    if (!bodyRef.current || !ref.current) return;

    const body = bodyRef.current;

    // Get world position of body.
    body.getWorldPosition(_bodyWorldPos);
    // Get world position of camera.
    camera.getWorldPosition(_camWorldPos);

    // Get distance to camera.
    const sqDistance = _bodyWorldPos.distanceToSquared(_camWorldPos);

    const opacity = Math.min(sqDistance / 1e4, 1);

    ref.current.style.opacity = `${opacity ** 2}`;
  });

  return (
    <object3D>
      <Html occlude="blending" center className="h-fit w-fit bg-transparent">
        <div
          ref={ref}
          onClick={handleClick}
          className="aspect-square w-[30px] origin-center cursor-pointer rounded-full border-[3px] border-white bg-transparent transition-all hover:scale-150 "
        />
      </Html>
    </object3D>
  );
}
