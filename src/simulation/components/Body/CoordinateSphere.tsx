import KeplerBody from '@/simulation/classes/KeplerBody';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { Sphere, Wireframe } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { MutableRefObject, useContext, useMemo, useRef } from 'react';
import { type Mesh, Spherical } from 'three';

type Props = {
  radius: number;
  bodyRef: MutableRefObject<KeplerBody>;
};
export const CoordinateSphere = observer(({ radius, bodyRef }: Props) => {
  const { surfaceState, uiState } = useContext(RootStoreContext);

  const sphericalCoords = useMemo(() => {
    return new Spherical(radius, surfaceState.latitude, surfaceState.longitude);
  }, [radius, surfaceState.latitude, surfaceState.longitude]);

  const coordRef = useRef<Mesh>(null!);

  if (
    !bodyRef.current ||
    !uiState.selected ||
    bodyRef.current !== uiState.selected
  ) {
    return null;
  }

  return (
    <>
      <Sphere args={[radius]}>
        <Wireframe />
        <Sphere
          args={[radius / 20]}
          ref={(sphere) => {
            if (!sphere || sphere === coordRef.current) return;
            coordRef.current = sphere;
            sphere.position.setFromSpherical(sphericalCoords);
          }}
        >
          <meshBasicMaterial color={'red'} />
        </Sphere>
      </Sphere>
    </>
  );
});
