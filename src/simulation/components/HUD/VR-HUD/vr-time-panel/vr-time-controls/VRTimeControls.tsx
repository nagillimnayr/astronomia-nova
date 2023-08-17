import { MachineContext } from '@/state/xstate/MachineProviders';
import { Container, RootContainer, Text } from '@coconut-xr/koestlich';
import { useSelector } from '@xstate/react';
import { format } from 'date-fns';
import { color, text } from '../../vr-hud-constants';
import { VRPauseButton } from './VRPauseButton';
import { VRTimescaleSlider } from './VRTimescaleSlider';
import { VRAdvanceTimeButton } from './VRAdvanceTimeButton';

type VRTimeControlProps = {
  index: number;
};
export const VRTimeControls = ({ index }: VRTimeControlProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  return (
    <>
      <Container
        index={index}
        flexDirection="column"
        alignItems="stretch"
        justifyContent="flex-start"
        gapRow={10}
      >
        <Container
          index={0}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gapColumn={10}
          margin={10}
        >
          <VRAdvanceTimeButton index={0} reverse />
          <VRPauseButton index={1} />
          <VRAdvanceTimeButton index={2} />
        </Container>
        <VRTimescaleSlider index={1} />
      </Container>
    </>
  );
};
