import { EARTH_RADIUS } from '@/lib/utils/constants';
import KeplerBody from '@/simulation/classes/kepler-body';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { Sphere, Wireframe } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Mesh, Object3D } from 'three';
import { Projector } from '../projector/Projector';
import { degToRad } from 'three/src/math/MathUtils';

export const SkySphere = () => {
  const { selectionService, cameraService } = useContext(GlobalStateContext);
  const selected = useSelector(
    selectionService,
    ({ context }) => context.selected
  );
  const focusTarget = useSelector(
    cameraService,
    ({ context }) => context.focusTarget
  );
  const [isVisible, setVisible] = useState(true);
  const sphereRef = useRef<Mesh | null>(null);
  const centerRef = useRef<Object3D | null>(null);

  useEffect(() => {
    if (
      !centerRef.current ||
      !focusTarget ||
      !(focusTarget instanceof KeplerBody)
    )
      return;
    const body = focusTarget;
    if (!body || !body.meshRef || !body.meshRef.current) return;
    // Attach to body.
    body.add(centerRef.current);
  }, [focusTarget]);

  const body = focusTarget instanceof KeplerBody ? focusTarget : null;
  if (!body) return;
  const radius = (5 * body.meanRadius) / EARTH_RADIUS;
  return (
    <>
      <object3D ref={centerRef} rotation={[degToRad(90), 0, 0]}>
        <Sphere
          name="sky-sphere"
          visible={isVisible}
          ref={sphereRef}
          args={[radius]}
          rotation={[0, 0, degToRad(body.obliquity)]}
        >
          <Wireframe
            simplify
            stroke="white"
            squeeze
            fillMix={1}
            fillOpacity={0}
            strokeOpacity={0.75}
            // fill="white"
          />
          {/* <axesHelper args={[1e-1]} /> */}
        </Sphere>
      </object3D>
    </>
  );
};
