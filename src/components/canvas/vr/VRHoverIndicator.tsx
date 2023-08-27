import { VRControls } from './vr-controls/VRControls';
import { VRPlayer } from './VRPlayer';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useController, useXR } from '@react-three/xr';
import { Circle, Ring } from '@react-three/drei';
import { DoubleSide, Group, Intersection, Line, Mesh, Vector3 } from 'three';
import { Y_AXIS } from '@/simulation/utils/constants';

const _worldPos = new Vector3();
const _objWorldPos = new Vector3();
const _worldNormal = new Vector3();
const _lookPos = new Vector3();

type VRHoverIndicatorProps = {
  handedness: XRHandedness;
  radius?: number;
};
export const VRHoverIndicator = ({
  handedness,
  radius = 0.02,
}: VRHoverIndicatorProps) => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const getXR = useXR(({ get }) => get);
  const controller = useController(handedness);
  console.log('controller:', controller);
  const indicatorRef = useRef<Group>(null!);

  useFrame(() => {
    if (!controller) return;
    const rayLength = 1e5;

    // Get hover state.
    const { hoverState } = getXR();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const intersection: Intersection = hoverState[handedness]
      .values()
      .next().value;
    if (!intersection) {
      const ray = controller.controller.children[0];
      if (!(ray instanceof Line)) return;

      ray.scale.setZ(rayLength);
      return;
    }

    const point = intersection.point;
    const indicator = indicatorRef.current;
    indicator.position.copy(point);

    const face = intersection.face;
    if (face) {
      const obj = intersection.object;
      const normal = face.normal;
      obj.getWorldPosition(_objWorldPos);
      _worldNormal.copy(normal);
      // Get the normal in world coordinates.
      obj.localToWorld(_worldNormal);
      // Subtract object's world position so that we just get the direction.
      _worldNormal.sub(_objWorldPos);
      // Add the direction to the point of intersection to get the position to look at.
      _lookPos.addVectors(point, _worldNormal);
      indicator.translateZ(0.01); // Slight offset to prevent z-fighting.
    } else {
      controller.controller.getWorldPosition(_lookPos);
      //
    }

    indicator.lookAt(_lookPos);
  });
  return (
    <>
      <group ref={indicatorRef}>
        <axesHelper args={[radius * 2]} />
        <Circle name={`hover-indicator-${handedness}`} args={[radius * 0.2]}>
          <meshBasicMaterial side={DoubleSide} color={'red'} />
        </Circle>
        <Ring args={[radius * 0.9, radius]}>
          <meshBasicMaterial side={DoubleSide} color={'red'} />
        </Ring>
      </group>
    </>
  );
};
