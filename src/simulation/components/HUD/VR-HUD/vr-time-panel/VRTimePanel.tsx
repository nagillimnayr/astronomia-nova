import { RootContainer, Container, Text } from '@coconut-xr/koestlich';
import { Suspense } from 'react';
import { GOLDEN_RATIO, colors, text } from '../vr-hud-constants';
import { VRDateDisplay } from './VRDateDisplay';
import { VRTimeControls } from './vr-time-controls/VRTimeControls';
import { VRTimescaleDisplay } from './VRTimescaleDisplay';
import { VRTimescaleSlider } from './vr-time-controls/VRTimescaleSlider';

export const VRTimePanel = () => {
  const height = 1;
  const width = height * GOLDEN_RATIO;
  return (
    <>
      <RootContainer
        sizeX={width}
        sizeY={height}
        backgroundColor={colors.muted}
        borderRadius={text.base}
        borderColor={colors.border}
        border={4}
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="space-evenly"
        padding={text.base}
        gapRow={10}
      >
        <VRTimescaleDisplay index={0} />
        <VRDateDisplay index={1} />
        <VRTimeControls index={2} />
        <VRTimescaleSlider index={3} />
      </RootContainer>
    </>
  );
};
