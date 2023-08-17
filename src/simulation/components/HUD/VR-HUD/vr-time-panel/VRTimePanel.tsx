import { RootContainer, Container, Text } from '@coconut-xr/koestlich';
import { Suspense } from 'react';
import { GOLDEN_RATIO, color, text } from '../vr-hud-constants';
import { VRDateDisplay } from './VRDateDisplay';
import { VRTimeControls } from './vr-time-controls/VRTimeControls';
import { VRTimescaleDisplay } from './VRTimescaleDisplay';

export const VRTimePanel = () => {
  const height = 1;
  const width = height * GOLDEN_RATIO;
  return (
    <>
      <RootContainer
        sizeX={width}
        sizeY={height}
        backgroundColor={color.muted}
        borderRadius={text.base}
        borderColor={color.border}
        border={4}
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="flex-start"
        padding={text.base}
        gapRow={10}
      >
        <VRTimescaleDisplay index={0} />
        <VRDateDisplay index={1} />
        <VRTimeControls index={2} />
      </RootContainer>
    </>
  );
};
