import { MachineContext } from '@/state/xstate/MachineProviders';
import { Container, RootContainer, Text } from '@coconut-xr/koestlich';
import { useSelector } from '@xstate/react';
import { format } from 'date-fns';
import { colors, text } from '../vr-hud-constants';
import { VRHudBGMaterial } from '../vr-materials/VRHudBGMaterial';

type VRDateDisplayProps = {
  index: number;
};
export const VRDateDisplay = ({ index }: VRDateDisplayProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const date = useSelector(timeActor, ({ context }) => context.date);
  const hoursStr = format(date, 'hh:mm:ss a');
  const dateStr = format(date, 'PPP');
  return (
    <>
      <Container
        index={index}
        flexGrow={0}
        flexDirection="column"
        alignItems="stretch"
        material={VRHudBGMaterial}
        backgroundColor={colors.background}
      >
        <Text
          index={index + 1}
          horizontalAlign="center"
          fontSize={text.xl}
          material={VRHudBGMaterial}
          backgroundColor={colors.background}
        >
          {hoursStr}
        </Text>
        <Text
          index={index + 2}
          horizontalAlign="center"
          fontSize={text.xl}
          material={VRHudBGMaterial}
          backgroundColor={colors.background}
        >
          {dateStr}
        </Text>
      </Container>
    </>
  );
};
