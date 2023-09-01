import {
  MouseEventHandler,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  GOLDEN_RATIO,
  border,
  borderRadius,
  colors,
  depth,
  text,
} from '../vr-hud-constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { VRSeparator } from '../vr-ui-components/VRSeparator';
import KeplerBody from '@/simulation/classes/kepler-body';
import { Group, Object3D } from 'three';
import { useInteraction } from '@react-three/xr';
import { type Vector3Tuple } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { ThreeEvent } from '@react-three/fiber';
import { Center, Svg } from '@react-three/drei';

type VROutlinerItemProps = {
  body: KeplerBody;
  defaultOpen?: boolean;
  position?: Vector3Tuple;
};
export const VROutlinerItem = ({
  body,
  defaultOpen = false,
  position = [0, 0, 0],
}: VROutlinerItemProps) => {
  // Get actors from root state machine.
  const { mapActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Bind to state changes so that the component will re-render whenever bodyMap is modified.
  useSelector(mapActor, ({ context }) => context.bodyMap);

  const containerRef = useRef<Group>(null!);

  const handleClick = useCallback(() => {
    selectionActor.send({ type: 'SELECT', selection: body });
  }, [body, selectionActor]);

  // Create Object to attach UI component to.
  const obj = useMemo(() => {
    return new Object3D();
  }, []);

  // const buttonRef = useRef<Object3D>(null!);
  // const buttonObj = useMemo(() => {
  //   return new Object3D();
  // }, []);
  // buttonRef.current = buttonObj;

  // useInteraction(buttonRef, 'onHover');

  return (
    <>
      <animated.group position={position} ref={containerRef}></animated.group>
    </>
  );
};

const VRVisibilityToggleButton = () => {
  const [isVisible, setVisible] = useState(true);
  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    setVisible((isVisible) => !isVisible);
  }, []);
  const iconSize = 20;
  const iconSrc = isVisible
    ? 'icons/MdiEyeOutline.svg'
    : 'icons/MdiEyeOffOutline.svg';
  return (
    <>
      <animated.object3D onClick={handleClick}>
        <Center>
          <Suspense>
            <Svg src={iconSrc} scale={iconSize} />
          </Suspense>
        </Center>
      </animated.object3D>
    </>
  );
};
