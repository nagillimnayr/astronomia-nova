import { Sphere } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh, Vector3 } from 'three';

const orbiterStart = new Vector3(10, 0, 0);
export default function TestScene() {
  const centerRef = useRef<Mesh>(null!);
  const orbiterRef = useRef<Mesh>(null!);
  return (
    <>
      <Sphere ref={centerRef}>
        <meshBasicMaterial color={'yellow'} />
      </Sphere>
      <Sphere ref={orbiterRef} position={orbiterStart}>
        <meshBasicMaterial color={'green'} />
      </Sphere>
    </>
  );
}
