import { useFrame } from '@react-three/fiber';
import { RayGrab } from '@react-three/xr';
import { PropsWithChildren, useRef, useState } from 'react';
import { Group, Object3D, Vector3, Vector3Tuple } from 'three';

const rotRate = 0.2;

const _camWorldPos = new Vector3();

type Props = PropsWithChildren & {
  position?: Vector3Tuple;
};
export const RotatingObject = ({ children, position = [0, 0, 0] }: Props) => {
  const groupRef = useRef<Group>(null!);
  const objRef = useRef<Object3D>(null!);
  const textCenterRef = useRef<Object3D>(null!);
  const textRef = useRef<Object3D>(null!);

  const [text, setText] = useState<string>('idle');

  useFrame(({ camera }, delta, frame) => {
    const obj = objRef.current;
    obj.rotateX(delta * rotRate);
    obj.rotateY(delta * rotRate);
    obj.rotateZ(delta * rotRate);

    // const center = textCenterRef.current;
    // center.up.set(...getLocalUpInWorldCoords(camera));
    // camera.getWorldPosition(_camWorldPos);
    // center.lookAt(_camWorldPos);
  });

  return (
    <>
      <RayGrab
        onBlur={() => setText('blur')}
        onHover={() => setText('hover')}
        // onMove={() => setText('move')}
        onSelectStart={() => setText('selectstart')}
        onSelectEnd={() => setText('selectend')}
        onSqueezeStart={() => setText('squeezestart')}
        onSqueezeEnd={() => setText('squeezeend')}
      >
        <group
          ref={groupRef}
          position={position}
          onPointerEnter={() => {
            setText('hover');
          }}
          onPointerLeave={() => {
            setText('idle');
          }}
          onClick={() => {
            setText('click');
          }}
        >
          <object3D ref={objRef}>{children}</object3D>

          {/* <object3D ref={textCenterRef}>
            <Text ref={textRef} position={[0, 0, 1]}>
              {text}
            </Text>
          </object3D> */}
        </group>
      </RayGrab>
    </>
  );
};
