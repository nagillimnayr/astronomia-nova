import { DEV_ENV, J2000 } from '@/constants';
import { delay } from '@/helpers/utils';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEventListener } from '@react-hooks-library/core';
import { useSelector } from '@xstate/react';

import { parse } from 'date-fns';
import { useEffect } from 'react';

const LATITUDE = 60;
const LONGITUDE = 116;

const DATE = new Date('2024-10-01');

export function useAutoAnimateCamera() {
  const rootActor = MachineContext.useActorRef();
  const {
    cameraActor,
    timeActor,
    mapActor,
    celestialSphereActor,
    surfaceActor,
  } = MachineContext.useSelector(({ context }) => context);

  const { constellations } = useSelector(
    celestialSphereActor,
    ({ context }) => context
  );

  useEventListener('keydown', async (event) => {
    if (!DEV_ENV) return;
    if (event.code !== 'KeyA') return;

    const bodyMap = mapActor.getSnapshot()!.context.bodyMap;
    const mars = bodyMap.get('Mars');
    if (!mars) {
      console.error('ERROR: Mars not found.');
      return;
    }

    timeActor.send({ type: 'PAUSE' });
    timeActor.send({ type: 'SET_DATE', date: DATE });

    constellations.send({ type: 'SET_OPACITY', opacity: 0.3 });

    await delay(1000);

    surfaceActor.send({ type: 'SET_LATITUDE', value: LATITUDE });
    surfaceActor.send({ type: 'SET_LONGITUDE', value: LONGITUDE });

    cameraActor.send({ type: 'AUTO_ANIMATE', focusTarget: mars });
  });

  useEffect(() => {
    if (!DEV_ENV) return;
    /* hacky workaround to trigger ADVANCE_DAY event from inside of cameraMachine. */
    const onAdvanceDay = () => {
      rootActor.send({ type: 'ADVANCE_DAY' });
    };
    const { eventDispatcher } = cameraActor.getSnapshot()!.context;

    eventDispatcher.addEventListener('ADVANCE_DAY', onAdvanceDay);

    return () => {
      eventDispatcher.removeEventListener('ADVANCE_DAY', onAdvanceDay);
    };
  }, [cameraActor, rootActor]);
}
