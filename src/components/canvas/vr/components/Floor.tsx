import { PI_OVER_TWO } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import {
  Grid,
  Plane,
  type GridProps,
  MeshDiscardMaterial,
} from '@react-three/drei';
import { type Object3DProps } from '@react-three/fiber';
import { Interactive, XRInteractionEvent } from '@react-three/xr';

type Props = GridProps & Object3DProps;
export const Floor = ({ position = [0, 0, 0], ...props }: Props) => {
  const { vrActor } = MachineContext.useSelector(({ context }) => context);
  return (
    <>
      <Interactive
        onHover={(event: XRInteractionEvent) => {
          //
          if (!event.intersection) return;

          // event.intersection.point;
        }}
      >
        <group position={position}>
          <Grid infiniteGrid />
          <Plane
            name="floor-mesh"
            args={[1000, 1000]}
            rotation={[-PI_OVER_TWO, 0, 0]}
          >
            <MeshDiscardMaterial />
          </Plane>
        </group>
      </Interactive>
    </>
  );
};
