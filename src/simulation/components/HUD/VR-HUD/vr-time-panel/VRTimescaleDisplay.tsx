import { MachineContext } from '@/state/xstate/MachineProviders';
import { Container, RootContainer, Text } from '@coconut-xr/koestlich';
import { useSelector } from '@xstate/react';
import { format } from 'date-fns';
import { color, text } from '../vr-hud-constants';
import { Glass, Slider } from '@coconut-xr/apfel-kruemel';
import { useCallback } from 'react';

type VRTimescaleDisplayProps = {
  index: number;
};
export const VRTimescaleDisplay = ({ index }: VRTimescaleDisplayProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const timescale = useSelector(timeActor, ({ context }) => context.timescale);

  let str = `${timescale} hour`;
  if (Math.abs(timescale) > 1) {
    str += 's';
  }
  return (
    <>
      <Container
        index={index}
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="center"
      >
        <Text fontSize={text.lg} horizontalAlign="center">
          {str + ' / second'}
        </Text>
      </Container>
    </>
  );
};
