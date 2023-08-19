import { Suspense, useEffect, useRef } from 'react';
import { GOLDEN_RATIO, border, colors, text } from '../vr-hud-constants';
import {
  Object3D,
  Vector3Tuple,
  Vector3,
  Group,
  BoxHelper,
  ColorRepresentation,
} from 'three';
import { MachineContext } from '@/state/xstate/MachineProviders';
import {
  Edges,
  Plane,
  RoundedBox,
  Text,
  useHelper,
  Box as Cube,
} from '@react-three/drei';
import { VRPanel } from '../vr-ui-components/VRPanel';
import { Flex, Box, useFlexSize } from '@react-three/flex';
import { VRButton } from '../vr-ui-components/VRButton';

type VRSettingsMenuProps = {
  position?: Vector3Tuple;
};
export const VRSettingsMenu = ({
  position = [0, 0, 0],
}: VRSettingsMenuProps) => {
  const flexRef = useRef<Group>(null!);
  const box1Ref = useRef<Group>(null!);
  // const box2Ref = useRef<Group>(null!);
  useHelper(flexRef, BoxHelper);
  useHelper(box1Ref, BoxHelper, 'blue');
  // useHelper(box2Ref, BoxHelper, 'red');

  const width = 1;
  const height = width * GOLDEN_RATIO;
  const depth = 0.02;
  return (
    <>
      <group position={position}>
        <VRPanel
          width={width}
          height={height}
          borderRadius={0.1}
          color={colors.background}
        ></VRPanel>
        <group position={[0, 0, depth]}>
          <axesHelper />
          <Flex
            ref={flexRef}
            centerAnchor
            size={[width, height, depth]}
            justifyContent={'flex-start'}
            alignItems={'stretch'}
            flexDirection={'column'}
            padding={0.1}
          >
            <Box centerAnchor ref={box1Ref} width={'100%'} height={0.2}>
              <Header />
            </Box>
            <Box centerAnchor ref={box1Ref} width={'100%'} height={0.2}>
              <VRButton
                width={0.5}
                height={0.2}
                backgroundColor={colors.background}
                borderColor={colors.border}
                hoverColor={colors.gray300}
                borderHoverColor={colors.gray400}
              >
                <Text position={[0, 0, 0.01]} fontSize={0.05}>
                  Hello World
                </Text>
              </VRButton>
            </Box>
          </Flex>
        </group>
      </group>
    </>
  );
};

const Header = () => {
  const [width, height] = useFlexSize();
  console.log('width:', width);
  console.log('height:', height);
  return (
    <>
      <Plane args={[width ?? 1, height]}>
        <meshBasicMaterial transparent opacity={0} />
        <Text
          position={[0, 0, 0.02]}
          // anchorX={'center'}
          // anchorY={'middle'}
          fontSize={0.1}
        >
          Settings
        </Text>
      </Plane>
    </>
  );
};
