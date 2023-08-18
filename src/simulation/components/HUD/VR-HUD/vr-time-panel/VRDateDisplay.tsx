import { MachineContext } from '@/state/xstate/MachineProviders';
import { Container, RootContainer, Text } from '@coconut-xr/koestlich';
import { useSelector } from '@xstate/react';
import { format } from 'date-fns';
import { colors, text } from '../vr-hud-constants';

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
        backgroundColor={colors.background}
      >
        <Text
          horizontalAlign="center"
          fontSize={text.lg}
          backgroundColor={colors.background}
        >
          {hoursStr}
        </Text>
        <Text
          horizontalAlign="center"
          fontSize={text.lg}
          backgroundColor={colors.background}
        >
          {dateStr}
        </Text>
      </Container>
    </>
  );
};
