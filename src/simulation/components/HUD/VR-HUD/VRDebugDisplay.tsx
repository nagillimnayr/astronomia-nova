import {
  PropsWithoutRef,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  GOLDEN_RATIO,
  border,
  colors,
  text,
  borderRadius,
  PRECISION,
} from './vr-hud-constants';
import {
  Object3D,
  type Vector3Tuple,
  Vector3,
  type Group,
  BoxHelper,
  ColorRepresentation,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Checkbox, IconButton, Slider } from '@coconut-xr/apfel-kruemel';
import { type ContextFrom } from 'xstate';
import { type visibilityMachine } from '@/state/xstate/visibility-machine/visibility-machine';
import { useActor, useMachine, useSelector } from '@xstate/react';
import {
  Container,
  ContainerProperties,
  ExtendedThreeEvent,
  RootContainer,
  SVG,
  Text,
  TextNode,
} from '@coconut-xr/koestlich';
import { useCursor } from '@react-three/drei';
import { celestialSphereMachine } from '@/state/xstate/visibility-machine/celestial-sphere-machine';
import { dialogMachine } from '@/state/xstate/ui-machine/dialog-machine/dialog-machine';
import { toggleMachine } from '@/state/xstate/toggle-machine/toggle-machine';
import { useFrame, useThree } from '@react-three/fiber';

const xrCamWorldPos = new Vector3();
const mainCamWorldPos = new Vector3();
const diff = new Vector3();

export const VRDebugDisplay = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  // const refSpace = useSelector(cameraActor, ({ context }) => context.refSpace);

  // const [dist, setDist] = useState<number>(0);
  const [pos, setPos] = useState<Vector3Tuple>([0, 0, 0]);

  useFrame(({ gl, camera }) => {
    const session = gl.xr.getSession();
    if (!session) return;
    // const xrCam = gl.xr.getCamera();
    // // console.log('main cam:', camera);
    // // console.log('xr cam:', xrCam);
    // camera.getWorldPosition(mainCamWorldPos);
    // xrCam.getWorldPosition(xrCamWorldPos);
    // diff.subVectors(xrCamWorldPos, mainCamWorldPos);
    // const distance = mainCamWorldPos.distanceTo(xrCamWorldPos);
    // // console.log('distance', distance);
    // setDist(distance);
    // const refSpace = gl.xr.getReferenceSpace();
    // console.log(refSpace);
    const frame = gl.xr.getFrame();
    if (!frame) return;
    // console.log('frame:', frame);
    const refSpace = gl.xr.getReferenceSpace();
    if (!refSpace) return;
    const pose = frame.getViewerPose(refSpace);
    // console.log(pose);
    if (!pose) return;
    const transform = pose.transform;
    // console.log(transform.position);
    const { x, y, z } = transform.position;
    setPos([x, y, z]);
  });

  const textRef = useRef<TextNode>(null!);

  const x = pos[0];
  const y = pos[1];
  const z = pos[2];

  const width = 0.75;
  const height = 0.75;
  return (
    <>
      <group position={[0, 0, 0]}>
        <RootContainer
          sizeX={width}
          sizeY={height}
          // backgroundColor={colors.background}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize={80}>{'x: ' + x.toFixed(3)}</Text>
          <Text fontSize={80}>{'y: ' + y.toFixed(3)}</Text>
          <Text fontSize={80}>{'z: ' + z.toFixed(3)}</Text>
          {/* <Text ref={textRef} fontSize={80}>
            {dist.toString()}
          </Text> */}
          {/* <Text fontSize={text.xxl}>{x.toFixed(2)}</Text>
          <Text fontSize={text.xxl}>{y.toFixed(2)}</Text>
          <Text fontSize={text.xxl}>{z.toFixed(2)}</Text> */}
        </RootContainer>
      </group>
    </>
  );
};
