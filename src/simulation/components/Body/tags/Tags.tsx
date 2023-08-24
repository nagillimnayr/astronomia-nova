import KeplerBody from '@/simulation/classes/kepler-body';
import {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Annotation } from '@/simulation/components/Body/tags/annotation/Annotation';
import { RingMarker } from '@/simulation/components/Body/tags/marker/RingMarker';
import { CircleMarker } from '@/simulation/components/Body/tags/marker/CircleMarker';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { colorMap } from '@/simulation/utils/color-map';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { AxesHelper, Group, Mesh, Object3D, Vector3 } from 'three';
import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';
import { clamp } from 'lodash';
import { DIST_MULT, ORIGIN, Y_AXIS } from '@/simulation/utils/constants';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';
import { Interactive } from '@react-three/xr';
import { useCursor } from '@react-three/drei';

const threshold = 0.02;

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();
const _direction = new Vector3();
const _lookPos = new Vector3();

type Props = {
  name: string;
  bodyRef: MutableRefObject<KeplerBody>;
  meanRadius: number;
};
export const Tags = ({ name, bodyRef, meanRadius }: Props) => {
  const { cameraActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const getThree = useThree(({ get }) => get);

  const color = useMemo(() => {
    const color = colorMap.get(name);
    return color;
  }, [name]);

  const groupRef = useRef<Group>(null!);
  const textRef = useRef<Object3D>(null!);
  const ringRef = useRef<Mesh>(null!);
  const circleRef = useRef<Mesh>(null!);
  const markerRef = useRef<Group>(null!);
  const axesRef = useRef<AxesHelper>(null!);

  const [isHovered, setHovered] = useState<boolean>(false);
  useCursor(isHovered, 'pointer');

  const handleSelect = useCallback(() => {
    const body = bodyRef.current;
    selectionActor.send({ type: 'SELECT', selection: body });
  }, [bodyRef, selectionActor]);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      handleSelect();
    },
    [handleSelect]
  );

  useFrame(({ camera, gl }, _, frame) => {
    const body = bodyRef.current;
    if (!body) return;
    const group = groupRef.current;
    if (!group) return;

    // Get context from state machine.
    const snapshot = cameraActor.getSnapshot()!;
    const { controls, focusTarget } = snapshot.context;

    // Check if in surface view.
    const onSurface = snapshot.matches('surface');
    if (body === focusTarget && onSurface) {
      // If on surface, hide the tags of the body we're on.
      group.visible = false;
      return;
    }
    if (!controls) return;

    // Get world position of body.
    body.getWorldPosition(_bodyWorldPos);
    // Get world position of camera.
    camera.getWorldPosition(_camWorldPos);

    // Set the up vector so that it will be oriented correctly when lookAt() is called.
    controls.getCameraWorldUp(group.up);

    const inVR = frame instanceof XRFrame;

    if (inVR) {
      // If in VR session, the tags should look directly at the camera, rather than parallel to the direction of the camera. Because depth.

      group.lookAt(_camWorldPos);
    } else {
      // If not in VR, the tags should look in the direction parallel to the direction of the camera.

      // Get world direction of camera.
      controls.getCameraWorldDirection(_direction);
      _direction.multiplyScalar(-1);

      // Add the direction to the position of the body.
      _lookPos.addVectors(_bodyWorldPos, _direction);

      // Look in direction parallel to the line of sight of the camera.
      group.lookAt(_lookPos);
    }

    // Get distance to camera.
    const distanceToCamera = _bodyWorldPos.distanceTo(_camWorldPos);

    const hoverFactor = isHovered ? 1.5 : 1;
    const vrFactor = inVR ? 1.25 : 1;

    const text = textRef.current;
    const textFactor = Math.max(1e-5, distanceToCamera / 60);
    // Scale the annotation so that it maintains its screen-size.
    text?.scale.setScalar(textFactor);
    // Clamp the y-position of the annotation so that it doesn't go inside of the body.
    const yPos = clamp(-1.25 * textFactor, -(meanRadius / DIST_MULT) * 1.5);
    // Set position so that the annotation always appears below the body and outside of the marker.
    text?.position.set(0, yPos * hoverFactor * vrFactor, 0);

    const markerFactor = Math.max(1e-5, distanceToCamera / 125);

    const marker = markerRef.current;
    marker.scale.setScalar(markerFactor * hoverFactor * vrFactor);

    if (axesRef.current) {
      axesRef.current.scale.setScalar(markerFactor);
    }

    // Since the local coordinates will have the parent at the origin, we can use the body's local coords to get the distance to the parent.
    const distanceToParent = body.position.length();
    // Check the ratio of the distances to the parent and the camera.
    const ratio = distanceToParent / distanceToCamera;

    // The primary body of the system won't be parented to a KeplerOrbit object.
    const isOrbiter = body.parent instanceof KeplerOrbit;
    if (!isOrbiter) return;

    // If the ratio of distances is less than the threshold, set to be invisible.
    const shouldBeVisible = ratio > threshold;
    // If visibility is already as it should be, then there is nothing to do.
    if (group.visible === shouldBeVisible) return;
    // Otherwise, set this object and all of its children to the appropriate visibility.
    // This is so that they don't trigger pointer events.
    group.traverse((obj) => {
      obj.visible = shouldBeVisible;
    });
  });

  return (
    <group ref={groupRef}>
      <Interactive
        onSelect={handleSelect}
        onHover={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <group
          ref={markerRef}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <RingMarker bodyRef={bodyRef} ref={ringRef} />
          <CircleMarker
            bodyRef={bodyRef}
            color={color ?? 'white'}
            ref={circleRef}
          />
        </group>
      </Interactive>
      <axesHelper args={[10]} ref={axesRef} />
      <Annotation annotation={name} meanRadius={meanRadius} ref={textRef} />
    </group>
  );
};
