import KeplerBody from '@/simulation/classes/kepler-body';
import { colorMap } from '@/simulation/utils/color-map';
import { RootActorContext } from '@/state/xstate/MachineProviders';
import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import { ArrowHelper, Mesh, Object3D, Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

const _pos = new Vector3();
const _otherPos = new Vector3();
const _diff = new Vector3();
const _direction = new Vector3();
const _projectedPos = new Vector3();

type Props = {
  body: KeplerBody;
  radius: number;
};

export const ProjectedSphere = ({ body, radius }: Props) => {
  const ref = useRef<Mesh | null>(null);
  const centerRef = useRef<Object3D | null>(null);
  const arrowRef = useRef<ArrowHelper>(null!);

  useFrame(() => {
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
        <Sphere ref={ref} args={[1e-1]} position={[0, 0, radius]}>
          <meshBasicMaterial color={color} />
        </Sphere>
      </object3D>
    </>
  );
};
