import type KeplerBody from '@/simulation/classes/kepler-body';
import { colorMap } from '@/simulation/utils/color-map';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Circle, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import { type ArrowHelper, type Mesh, type Object3D, Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { useSelector } from '@xstate/react';

const _pos = new Vector3();
const _otherPos = new Vector3();
const _diff = new Vector3();
const _direction = new Vector3();
const _projectedPos = new Vector3();
const _cameraPos = new Vector3();

type Props = {
  body: KeplerBody;
  radius: number;
};

export const ProjectedSphere = ({ body, radius }: Props) => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const surfaceView = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );

  const ref = useRef<Mesh | null>(null);
  const centerRef = useRef<Object3D | null>(null);
  const arrowRef = useRef<ArrowHelper>(null!);

  useFrame(({ camera }) => {
    if (!surfaceView) return; // Only update if in surface view.
    if (!ref.current || !centerRef.current || !body) return;
    const center = centerRef.current;
    center.getWorldPosition(_pos);
    body.getWorldPosition(_otherPos);
    _diff.subVectors(_otherPos, _pos);
    _direction.copy(_diff);
    _direction.normalize();

    // Local coords.
    _projectedPos.copy(_pos);
    _projectedPos.addScaledVector(_direction, radius);

    // Set position of projected sphere.
    center.lookAt(_projectedPos);

    // const arrow = arrowRef.current;
    // arrow.setDirection(_direction);
    // arrow.setLength(_diff.length());

    // Rotate to face camera.
    camera.getWorldPosition(_cameraPos);
    ref.current.lookAt(_cameraPos);
  });

  if (!body) return;
  const color = colorMap.get(body.name);
  return (
    <>
      {/* <arrowHelper
        ref={(arrow) => {
          if (!arrow) return;
          arrowRef.current = arrow;
          if (!color) return;
          arrow.setColor(color);
        }}
      /> */}
      <object3D ref={centerRef}>
        <Circle
          visible={surfaceView} // Should only be visible in surface view.
          ref={ref}
          args={[1e-3]}
          position={[0, 0, radius]} // Distance from center point.
        >
          <meshBasicMaterial color={color} />
        </Circle>
      </object3D>
    </>
  );
};
