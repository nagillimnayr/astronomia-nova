import { type KeplerBody } from '@/components/canvas/body/kepler-body';
import { Annotation } from '@/components/canvas/body/tags/annotation/Annotation';
import { KeplerOrbit } from '@/components/canvas/orbit/kepler-orbit';
import { EARTH_RADIUS, METER } from '@/constants/constants';
import { colorMap } from '@/helpers/color-map';
import useHover from '@/hooks/useHover';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { animated, useSpring } from '@react-spring/three';
import { useCursor } from '@react-three/drei';
import { type ThreeEvent, useFrame } from '@react-three/fiber';
import { Interactive, type XRInteractionEvent } from '@react-three/xr';
import { useSelector } from '@xstate/react';
import { clamp } from 'lodash';
import { type MutableRefObject, useCallback, useMemo, useRef } from 'react';
import {
  type AxesHelper,
  type Group,
  type Mesh,
  type Object3D,
  Vector3,
} from 'three';
import { SelectionMarker } from './marker/SelectionMarker';
import { SphereMarker } from './marker/SphereMarker';

const threshold = 0.02;
const DIST_TO_CAM_THRESHOLD = 1e9 * METER;

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
  const { cameraActor, selectionActor, visibilityActor, mapActor } =
    MachineContext.useSelector(({ context }) => context);

  const markers = useSelector(
    visibilityActor,
    ({ context }) => context.markers
  );

  // Subscribe to state so that the component will re-render upon updates.
  useSelector(mapActor, ({ context }) => context.bodyMap);

  const color = colorMap.get(name);

  const pivotRef = useRef<Object3D>(null!);
  const groupRef = useRef<Group>(null!);
  const textRef = useRef<Object3D>(null!);
  const selectionRef = useRef<Mesh>(null!);
  const sphereRef = useRef<Mesh>(null!);
  const markerRef = useRef<Group>(null!);
  const axesRef = useRef<AxesHelper>(null!);

  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');
  const hoverSpring = useSpring({
    ringScale: isHovered ? 1.25 : 1,
    markerScale: isHovered ? 1.5 : 1,
  });
  const [hideSpring, hideSpringRef] = useSpring(() => ({
    markerScale: 1,
    tagScale: 1,
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

  const logScale = useRef<number>(0);
  logScale.current = useMemo(() => {
    if (!bodyRef.current) {
      return 0;
    }
    const log = Math.log(bodyRef.current.meanRadius);
    //  console.log(bodyRef.current.name, logScale)
    return log / 20;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyRef, bodyRef.current]);

  useFrame(({ camera }, _, frame) => {
    const body = bodyRef.current;
    if (!body) return;
    const pivot = pivotRef.current;

    // Get context from state machine.
    const snapshot = cameraActor.getSnapshot()!;
    const { controls, focusTarget } = snapshot.context;

    // Check if in surface view.
    // const onSurface = snapshot.matches('surface');
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

    // Set the up vector so that it will be oriented correctly when lookAt() is
    // called.
    controls.getCameraWorldUp(pivot.up);

    const inVR = frame instanceof XRFrame;

    if (inVR) {
      // If in VR session, the tags should look directly at the camera, rather
      // than parallel to the direction of the camera. Because depth.

      pivot.lookAt(_camWorldPos);
    } else {
      // If not in VR, the tags should look in the direction parallel to the
      // direction of the camera.

      // Get world direction of camera.
      controls.getCameraWorldDirection(_direction);
      _direction.multiplyScalar(-1); // Reverse direction.

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
    // Clamp the y-position of the annotation so that it doesn't go inside of
    // the body.
    const yPos = clamp(
      -1.25 * textFactor * logScale.current,
      -(meanRadius * METER) * 1.5
    );
    // Set position so that the annotation always appears below the body and
    // outside of the marker.
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

    // Since the local coordinates will have the parent at the origin, we can
    // use the body's local coords to get the distance to the parent.
    const distanceToParent = body.position.length();
    // Check the ratio of the distances to the parent and the camera.
    const ratio = distanceToParent / distanceToCamera;

    // The primary body of the system won't be parented to a KeplerOrbit object.
    const isOrbiter = body.parent instanceof KeplerOrbit;
    if (!isOrbiter) return;

    // If the ratio of distances is less than the threshold, set to be
    // invisible.
    const shouldBeVisible = ratio > threshold;

    // Setting scale to zero solves the issue of descendants still catching
    // pointer events, and it can be animated more easily, as it doesn't
    // require animating the materials of each descendant.
    hideSpringRef.start({ tagScale: shouldBeVisible ? 1 : 0 });
  });

  return (
    <object3D name="pivot" ref={pivotRef}>
      <animated.group ref={groupRef} scale={hideSpring.tagScale}>
        <group scale={logScale.current}>
          <animated.group scale={hideSpring.markerScale}>
            <group
              ref={markerRef}
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
                <animated.object3D scale={hoverSpring.ringScale}>
                  <SelectionMarker bodyRef={bodyRef} ref={selectionRef} />
                </animated.object3D>
                <animated.object3D scale={hoverSpring.markerScale}>
                  <SphereMarker
                    ref={sphereRef}
                    bodyRef={bodyRef}
                    color={color ?? 'white'}
                  />
                </animated.object3D>
              </Interactive>
            </group>
          </animated.group>
        </group>
        {/* <axesHelper args={[10]} ref={axesRef} /> */}
        <Annotation annotation={name} meanRadius={meanRadius} ref={textRef} />
      </animated.group>
    </object3D>
  );
};
