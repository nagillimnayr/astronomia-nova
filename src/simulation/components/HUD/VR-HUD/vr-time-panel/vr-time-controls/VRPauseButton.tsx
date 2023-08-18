import { MachineContext } from '@/state/xstate/MachineProviders';
import { Container, Object, RootContainer, Text } from '@coconut-xr/koestlich';
import { useSelector } from '@xstate/react';
import { format } from 'date-fns';
import { colors, text } from '../../vr-hud-constants';
import { Play, Pause } from '@coconut-xr/lucide-koestlich';
import { useCallback, useMemo } from 'react';
import { Glass, IconButton } from '@coconut-xr/apfel-kruemel';
import { Object3D } from 'three';

type VRPauseButtonProps = {
  index: number;
};
export const VRPauseButton = ({ index }: VRPauseButtonProps) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const isPaused = useSelector(timeActor, (state) => state.matches('paused'));
  const handleClick = useCallback(() => {
    const isPaused = timeActor.getSnapshot()!.matches('paused');
    const type = isPaused ? 'UNPAUSE' : 'PAUSE';
    timeActor.send({ type });
  }, [timeActor]);

  // Create Object to attach UI component to.
  const obj = useMemo(() => {
    return new Object3D();
  }, []);

  const iconSize = text.lg;
  return (
    <>
      <Container
        index={index}
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor={colors.background}
      >
        <Object object={obj} depth={12}>
          <IconButton
            onClick={handleClick}
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding={2}
            width={iconSize * 1.5}
            height={iconSize * 1.5}
            aspectRatio={1}
            borderRadius={1000}
            backgroundColor={colors.background}
          >
            {isPaused ? (
              <Play
                height={iconSize}
                width={iconSize}
                translateX={iconSize / 16}
              />
            ) : (
              <Pause height={iconSize} width={iconSize} />
            )}
          </IconButton>
        </Object>
      </Container>
    </>
  );
};
