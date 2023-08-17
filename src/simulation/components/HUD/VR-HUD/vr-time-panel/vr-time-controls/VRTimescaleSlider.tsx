import { MachineContext } from '@/state/xstate/MachineProviders';
import { Container, RootContainer, Text } from '@coconut-xr/koestlich';
import { useSelector } from '@xstate/react';
import { format } from 'date-fns';
import { color, text } from '../../vr-hud-constants';
import { Glass, IconButton, Slider } from '@coconut-xr/apfel-kruemel';
import { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from '@coconut-xr/lucide-koestlich';

type VRTimescaleSliderProps = {
  index: number;
};
export const VRTimescaleSlider = ({ index }: VRTimescaleSliderProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const timescale = useSelector(timeActor, ({ context }) => context.timescale);

  const handleValueChange = useCallback(
    (value: number) => {
      value = Math.floor(value);
      timeActor.send({ type: 'SET_TIMESCALE', timescale: value });
    },
    [timeActor]
  );

  const handleClickLeft = useCallback(() => {
    timeActor.send({ type: 'DECREMENT_TIMESCALE' });
  }, [timeActor]);

  const handleClickRight = useCallback(() => {
    timeActor.send({ type: 'INCREMENT_TIMESCALE' });
  }, [timeActor]);

  const iconSize = 24;
  return (
    <>
      <Container
        index={index}
        width={'auto'}
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="center"
      >
        <Container
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gapColumn={10}
        >
          <IconButton index={0} onClick={handleClickLeft}>
            <ChevronLeft width={iconSize} height={iconSize} />
          </IconButton>
          <Container index={1} border={4} borderRadius={text.base} flexGrow={1}>
            <Slider
              size="lg"
              range={100}
              value={timescale}
              onValueChange={handleValueChange}
            />
          </Container>
          <IconButton index={2} onClick={handleClickRight}>
            <ChevronRight width={iconSize} height={iconSize} />
          </IconButton>
        </Container>
      </Container>
    </>
  );
};
