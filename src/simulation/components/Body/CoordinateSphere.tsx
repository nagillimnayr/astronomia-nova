import KeplerBody from '@/simulation/classes/KeplerBody';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { Sphere, Wireframe } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { MutableRefObject, useContext, useMemo, useRef } from 'react';
import { type Mesh, Spherical } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

type Props = {
  radius: number;
  bodyRef: MutableRefObject<KeplerBody>;
};
export const CoordinateSphere = observer(({ radius, bodyRef }: Props) => {
  const { surfaceState, uiState } = useContext(RootStoreContext);

  const sphericalCoords = useMemo(() => {
    return new Spherical(
      radius,
      degToRad(90 - surfaceState.latitude),
      degToRad(90 + surfaceState.longitude)
    );
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
      <Sphere
        args={[radius / 20]}
        ref={(sphere) => {
          if (!sphere) return;
          if (coordRef.current !== sphere) {
            coordRef.current = sphere;
          }
          sphere.position.setFromSpherical(sphericalCoords);
        }}
      >
        <meshBasicMaterial color={'red'} />
      </Sphere>
    </>
  );
});
