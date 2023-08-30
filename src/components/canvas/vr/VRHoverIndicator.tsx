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
  rayLength?: number;
};
export const VRHoverIndicator = ({
  handedness,
  radius = 0.02,
  rayLength = 1e6,
}: VRHoverIndicatorProps) => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const getXR = useXR(({ get }) => get);
  const isPresenting = useXR(({ isPresenting }) => isPresenting);

  const controller = useController(handedness);
  // console.log(`${handedness} controller:`, controller?.uuid);
  const indicatorRef = useRef<Group>(null!);
  const circleRef = useRef<Mesh>(null!);
  const ringRef = useRef<Mesh>(null!);

  useEffect(() => {
    const subscription = cameraActor.subscribe((state) => {
      if (state.event.type !== 'UPDATE') return;
      if (!controller) return;
      const indicator = indicatorRef.current;

      // Get hover state.
      const hoverState = getXR().hoverState[handedness];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const intersection: Intersection = hoverState.values().next().value;

      if (!intersection) {
        const ray = controller.controller.children[0];
        if (!(ray instanceof Line)) return;

        ray.scale.setZ(rayLength);
        indicator.visible = false;
        return;
      }

      indicator.visible = true;
      const obj = intersection.object;

      const point = intersection.point;
      indicator.position.copy(point);

      const face = intersection.face;
      if (face) {
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

      // Look in direction of the normal.
      indicator.lookAt(_lookPos);
    });

    return () => subscription.unsubscribe();
  }, [cameraActor, controller, getXR, handedness, rayLength]);

  return (
    <>
      <group
        visible={isPresenting}
        name={`hover-indicator-${handedness}`}
        ref={indicatorRef}
      >
        <axesHelper args={[radius * 2]} />
        <Circle
          name={`hover-indicator-circle-${handedness}`}
          args={[radius * 0.2]}
          ref={circleRef}
        >
          <meshBasicMaterial side={DoubleSide} color={'red'} />
        </Circle>
        <Ring
          name={`hover-indicator-ring-${handedness}`}
          args={[radius * 0.9, radius]}
          ref={ringRef}
        >
          <meshBasicMaterial side={DoubleSide} color={'red'} />
        </Ring>
      </group>
    </>
  );
};
