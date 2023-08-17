import { MachineContext } from '@/state/xstate/MachineProviders';
import { Container, RootContainer, Text } from '@coconut-xr/koestlich';
import { useSelector } from '@xstate/react';
import { format } from 'date-fns';
import { color, text } from '../vr-hud-constants';

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
      >
        <Text horizontalAlign="center" fontSize={text.lg}>
          {hoursStr}
        </Text>
        <Text horizontalAlign="center" fontSize={text.lg}>
          {dateStr}
        </Text>
      </Container>
    </>
  );
};
