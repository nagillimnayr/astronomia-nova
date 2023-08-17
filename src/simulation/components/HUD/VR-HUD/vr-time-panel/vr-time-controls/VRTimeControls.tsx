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
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gapColumn={10}
        height={text.lg}
      >
        <VRAdvanceTimeButton index={0} reverse />
        <VRPauseButton index={1} />
        <VRAdvanceTimeButton index={2} />
      </Container>
    </>
  );
};
