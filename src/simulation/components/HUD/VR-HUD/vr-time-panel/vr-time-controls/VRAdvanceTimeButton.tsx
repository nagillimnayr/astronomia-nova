import { MachineContext } from '@/state/xstate/MachineProviders';
import { Container, RootContainer, Text } from '@coconut-xr/koestlich';
import { useSelector } from '@xstate/react';
import { format } from 'date-fns';
import { color, text } from '../../vr-hud-constants';
import { Play, Pause, Sunset, Sunrise } from '@coconut-xr/lucide-koestlich';
import { useCallback } from 'react';
import { Glass, IconButton } from '@coconut-xr/apfel-kruemel';

type VRAdvanceTimeButtonProps = {
  index: number;
  reverse?: boolean;
};
export const VRAdvanceTimeButton = ({
  index,
  reverse,
}: VRAdvanceTimeButtonProps) => {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );
  const handleClick = useCallback(() => {
    rootActor.send({ type: 'ADVANCE_DAY', reverse });
  }, [reverse, rootActor]);

  const iconSize = 24;
  return (
    <>
      <Container
        index={index}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <IconButton
          onClick={handleClick}
          display="flex"
          alignItems="center"
          justifyContent="center"
          disabled={focusTarget === null}
        >
          {reverse ? (
            <Sunset height={iconSize} width={iconSize} />
          ) : (
            <Sunrise height={iconSize} width={iconSize} />
          )}
        </IconButton>
      </Container>
    </>
  );
};
