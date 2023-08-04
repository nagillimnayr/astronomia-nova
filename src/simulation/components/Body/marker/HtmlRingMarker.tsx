import { Html } from '@react-three/drei';
import type KeplerBody from '@/simulation/classes/kepler-body';
import {
  useCallback,
  type MutableRefObject,
  useContext,
  type MouseEventHandler,
  useRef,
} from 'react';
// import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

import { useActor, useSelector } from '@xstate/react';
import { cn } from '@/lib/cn';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { EARTH_RADIUS } from '@/simulation/utils/constants';

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();

type Props = {
  bodyRef: MutableRefObject<KeplerBody>;
};
export function HtmlRingMarker({ bodyRef }: Props) {
  const { selectionActor, visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // Check if marker visibility is on.
  const markers = useSelector(
    visibilityActor,
    ({ context }) => context.markers
  );
  const isVisible = useSelector(markers, (state) => state.matches('active'));

  const ref = useRef<HTMLDivElement>(null!);

  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      e.stopPropagation();
      const body = bodyRef.current;
      //// uiState.select(body);
      selectionActor.send({ type: 'SELECT', selection: body });
      // useSelectionStore.getState().select(body);
    },
    [bodyRef, selectionActor]
  );

  useFrame(({ camera }) => {
    // Reduce the opacity when close enough to the camera.

    if (!bodyRef.current || !ref.current) return;

    const body = bodyRef.current;

    // Get world position of body.
    body.getWorldPosition(_bodyWorldPos);
    // Get world position of camera.
    camera.getWorldPosition(_camWorldPos);

    // Get distance to camera.
    const sqDistance = _bodyWorldPos.distanceToSquared(_camWorldPos);

    const opacity = Math.min(
      sqDistance / (1e4 * (bodyRef.current.meanRadius / EARTH_RADIUS)),
      1
    );

    ref.current.style.opacity = `${opacity ** 2}`;
  });

  return (
    <object3D visible={isVisible}>
      <Html occlude="blending" center className="h-fit w-fit bg-transparent">
        <div
          ref={ref}
          onClick={handleClick}
          className={cn(
            'aspect-square w-[24px] origin-center cursor-pointer rounded-full border-[3px] border-white bg-transparent transition-all hover:scale-150 ',
            isVisible ? 'border-white' : 'border-transparent'
          )}
        />
      </Html>
    </object3D>
  );
}
