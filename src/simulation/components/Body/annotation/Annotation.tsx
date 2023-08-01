import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { EARTH_RADIUS } from '@/simulation/utils/constants';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { CameraControls, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useActor } from '@xstate/react';
import { clamp } from 'lodash';
import { useContext, useRef } from 'react';
import { type Object3D, Vector3 } from 'three';

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();
const _up = new Vector3();
const _target = new Vector3();
const _direction = new Vector3();
const _lookPos = new Vector3();

type Props = {
  annotation: string;
  meanRadius: number;
};
const Annotation = ({ annotation, meanRadius }: Props) => {
  // Check if annotation visibility is on.
  const { annotationVis, cameraService } = useContext(GlobalStateContext);
  const [state] = useActor(annotationVis);
  const isVisible = state.matches('active');

  const bodyRef = useContext(KeplerTreeContext);

  const centerRef = useRef<Object3D>(null!);
  const textRef = useRef<Object3D>(null!);

  useFrame(({ camera, controls }) => {
    if (!bodyRef) return;
    const body = bodyRef.current;
    const center = centerRef.current;
    const text = textRef.current;
    if (!body || !center) return;

    // Get world position of body.
    body.getWorldPosition(_bodyWorldPos);
    // Get world position of camera.
    camera.getWorldPosition(_camWorldPos);

    if (!controls) return;
    // Get position of camera's gaze target.
    (controls as unknown as CameraControls).getTarget(_target);
    // Get the direction from the target to the camera
    _direction.subVectors(_camWorldPos, _target);
    // Add the direction to the position of the body.
    _lookPos.addVectors(_bodyWorldPos, _direction);

    // Set the up vector so that it will be oriented correctly when lookAt() is called.
    center.up.copy(camera.up);
    // Rotate to face camera.
    center.lookAt(_lookPos);

    // text.lookAt(_camWorldPos);

    // Get distance to camera.
    const distance = _bodyWorldPos.distanceTo(_camWorldPos);
    const factor = distance / 75;
    // Scale relative to distance from camera.
    text.scale.setScalar(factor);

    // Clamp the y-position so that the annotation doesn't go inside of the body.
    const yPos = clamp(-1.25 * factor, -(meanRadius / EARTH_RADIUS) * 1.5);
    // Set position so that the annotation always appears below the body and outside of the marker.
    text.position.set(0, yPos, 0);
  });

  return (
    <>
      <object3D ref={centerRef}>
        <object3D
          ref={textRef}
          position={[0, -(meanRadius / EARTH_RADIUS), 0]}
          // position={[0, -10, 0]}
        >
          <Text
            visible={isVisible}
            color={'white'}
            anchorX={'center'}
            anchorY={'top'}
          >
            {annotation}
          </Text>
        </object3D>
      </object3D>
    </>
  );
};

export { Annotation };
