import { Plane } from '@react-three/drei';
import { RootContainer, Container, Text } from '@coconut-xr/koestlich';
import { Suspense } from 'react';
import { GOLDEN_RATIO, border, color, text } from '../vr-hud-constants';
import { Vector3Tuple } from 'three';

type VRDetailsPanelProps = {
  position?: Vector3Tuple;
};
export const VRDetailsPanel = ({
  position = [0, 0, 0],
}: VRDetailsPanelProps) => {
  const width = 1;
  const height = width * GOLDEN_RATIO;
  return (
    <>
      <RootContainer
        position={position}
        backgroundColor={color.muted}
        border={border.base}
        sizeX={width}
        sizeY={height}
        flexDirection="column"
        padding={20}
        gapRow={20}
        borderRadius={text.base}
      >
        <Container
          flexGrow={1}
          backgroundColor={'green'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={text.base}
        >
          <Suspense>
            <Text color={color.foreground} fontSize={text.lg}>
              Hello
            </Text>
          </Suspense>
        </Container>
        <Container
          flexGrow={1}
          backgroundColor={'blue'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={text.base}
        >
          <Suspense>
            <Text color={color.foreground} fontSize={text.lg}>
              World
            </Text>
          </Suspense>
        </Container>
      </RootContainer>
    </>
  );
};
