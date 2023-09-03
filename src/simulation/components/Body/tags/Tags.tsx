import KeplerBody from '@/simulation/classes/kepler-body';
import {
  MutableRefObject,
  useCallback,
  useEffect,
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
import {
  DIST_MULT,
  EARTH_RADIUS,
  METER,
  ORIGIN,
  Y_AXIS,
} from '@/simulation/utils/constants';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';
import { Interactive, XRInteractionEvent } from '@react-three/xr';
import { useCursor } from '@react-three/drei';
import useHover from '@/hooks/useHover';
import { useSpring, animated } from '@react-spring/three';
import { SphereMarker } from './marker/SphereMarker';
import { SelectionMarker } from './marker/SelectionMarker';

const threshold = 0.02;
const DIST_TO_CAM_THRESHOLD = 5e8 * METER;

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
  const { cameraActor, selectionActor, visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  
    const markers = useSelector(
      visibilityActor,
      ({ context }) => context.markers
    );

  const getThree = useThree(({ get }) => get);

  const color = useMemo(() => {
    const color = colorMap.get(name);
    return color;
  }, [name]);

  const pivotRef = useRef<Object3D>(null!);
  const groupRef = useRef<Group>(null!);
  const textRef = useRef<Object3D>(null!);
  const ringRef = useRef<Mesh>(null!);
  const selectionRef = useRef<Mesh>(null!);
  const sphereRef = useRef<Mesh>(null!);
  const markerRef = useRef<Group>(null!);
  const axesRef = useRef<AxesHelper>(null!);

  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');
  const hoverSpring = useSpring({
    scale: isHovered ? 1.5 : 1,
  });
  const [hideSpring, hideSpringRef] = useSpring(() => ({
    markerScale: 1,
    tagScale: 1
  }));
  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => {
      const markersVisible = markers.getSnapshot()!.matches('active');
      if (!markersVisible) return;
      if ('stopPropagation' in event) {
        event.stopPropagation();
        setHovered(true);
      }
      const group = groupRef.current;
      if (!group.visible) return;
      // Select body.
      const body = bodyRef.current;
      selectionActor.send({ type: 'SELECT', selection: body });
    },
    [bodyRef, markers, selectionActor, setHovered]
  );

  useFrame(({ camera, gl }, _, frame) => {
    const body = bodyRef.current;
    if (!body) return;
    const pivot = pivotRef.current;
    const group = groupRef.current;

    // Get context from state machine.
    const snapshot = cameraActor.getSnapshot()!;
    const { controls, focusTarget } = snapshot.context;

    // Check if in surface view.
    const onSurface = snapshot.matches('surface');
    // if (body === focusTarget && onSurface) {
    //   // If on surface, hide the tags of the body we're on.
    //   group.visible = false;
    //   return;
    // }
    if (!controls) return;

    // Get world position of body.
    body.getWorldPosition(_bodyWorldPos);
    // Get world position of camera.
    camera.getWorldPosition(_camWorldPos);

    // Set the up vector so that it will be oriented correctly when lookAt() is called.
    controls.getCameraWorldUp(pivot.up);

    const inVR = frame instanceof XRFrame;

    if (inVR) {
      // If in VR session, the tags should look directly at the camera, rather than parallel to the direction of the camera. Because depth.

      pivot.lookAt(_camWorldPos);
    } else {
      // If not in VR, the tags should look in the direction parallel to the direction of the camera.

      // Get world direction of camera.
      controls.getCameraWorldDirection(_direction);
      _direction.multiplyScalar(-1);

      // Add the direction to the position of the body.
      _lookPos.addVectors(_bodyWorldPos, _direction);

      // Look in direction parallel to the line of sight of the camera.
      pivot.lookAt(_lookPos);
    }

    // Get distance to camera.
    const distanceToCamera = _bodyWorldPos.distanceTo(_camWorldPos);

    const vrFactor = inVR ? 1.4 : 1;

    const text = textRef.current;
    const textFactor = Math.max(1e-5, distanceToCamera / 60);
    // Scale the annotation so that it maintains its screen-size.
    text?.scale.setScalar(textFactor * vrFactor);
    // Clamp the y-position of the annotation so that it doesn't go inside of the body.
    const yPos = clamp(-1.25 * textFactor, -(meanRadius / DIST_MULT) * 1.5);
    // Set position so that the annotation always appears below the body and outside of the marker.
    text?.position.set(0, yPos * vrFactor, 0);

    const marker = markerRef.current;
    const radiusRatio = body.meanRadius / EARTH_RADIUS;
    // If too close to camera, hide.
    if (distanceToCamera < DIST_TO_CAM_THRESHOLD * radiusRatio) {
      hideSpringRef.start({ markerScale: 0 });
      // marker.scale.setScalar(0);
      return;
    } else {
      hideSpringRef.start({ markerScale: 1 });
    }
    const markerFactor = Math.max(1e-5, distanceToCamera / 75);

    marker.scale.setScalar(markerFactor * vrFactor);

    if (axesRef.current) {
      axesRef.current.scale.setScalar(markerFactor);
    }


    /** Check distance of body to its parent, compared to distance to camera. Hide it if it would overlap with its parent. */

    // Since the local coordinates will have the parent at the origin, we can use the body's local coords to get the distance to the parent.
    const distanceToParent = body.position.length();
    // Check the ratio of the distances to the parent and the camera.
    const ratio = distanceToParent / distanceToCamera;

    // The primary body of the system won't be parented to a KeplerOrbit object.
    const isOrbiter = body.parent instanceof KeplerOrbit;
    if (!isOrbiter) return;

    // If the ratio of distances is less than the threshold, set to be invisible.
    const shouldBeVisible = ratio > threshold;

    hideSpringRef.start({ tagScale: shouldBeVisible ? 1 : 0 });
    // If visibility is already as it should be, then there is nothing to do.
    // if (marker.visible === shouldBeVisible) return;
    // // Otherwise, set this object and all of its children to the appropriate visibility.
    // // This is so that they don't trigger pointer events.
    // group.traverse((obj) => {
    //   obj.visible = shouldBeVisible;
    // });
  });

  const logScale = useMemo(() => {
    if (!bodyRef.current) return;
    const log = Math.log(bodyRef.current.meanRadius);
    const logScale = log / 20;
    return logScale;
  }, [bodyRef]);

  return (
    <object3D name="pivot" ref={pivotRef}>
      <animated.group ref={groupRef} scale={hideSpring.tagScale}>
        <animated.group scale={hoverSpring.scale}>
          <animated.group scale={hideSpring.markerScale}>
            <group
              ref={markerRef}
              scale={logScale}
              onClick={handleClick}
              onPointerOver={hoverEvents.handlePointerEnter}
              onPointerLeave={hoverEvents.handlePointerLeave}
            >
              <Interactive
                onSelect={handleClick}
                onHover={hoverEvents.handlePointerEnter}
                onBlur={hoverEvents.handlePointerLeave}
              >
                {/* <RingMarker
                bodyRef={bodyRef}
                ref={ringRef}
                color={color ?? 'white'}
              /> */}
                <SelectionMarker bodyRef={bodyRef} ref={selectionRef} />
                <SphereMarker
                  ref={sphereRef}
                  bodyRef={bodyRef}
                  color={color ?? 'white'}
                />
              </Interactive>
            </group>
          </animated.group>
        </animated.group>
        {/* <axesHelper args={[10]} ref={axesRef} /> */}
        <Annotation annotation={name} meanRadius={meanRadius} ref={textRef} />
      </animated.group>
    </object3D>
  );
};
