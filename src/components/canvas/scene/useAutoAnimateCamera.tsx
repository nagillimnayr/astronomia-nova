import { DEV_ENV, J2000 } from '@/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEventListener } from '@react-hooks-library/core';

import { parse } from 'date-fns';

const LATITUDE = 60;
const LONGITUDE = 116;

const DATE = new Date('2024-10-01');

export function useAutoAnimateCamera() {
  const { cameraActor, timeActor, mapActor, selectionActor, surfaceActor } =
    MachineContext.useSelector(({ context }) => context);

  useEventListener('keydown', (event) => {
    if (!DEV_ENV) return;
    if (event.code !== 'KeyA') return;

    const bodyMap = mapActor.getSnapshot()!.context.bodyMap;
    const mars = bodyMap.get('Mars');
    if (!mars) {
      console.error('ERROR: Mars not found.');
      return;
    }

    timeActor.send({ type: 'SET_DATE', date: DATE });

    // selectionActor.send({ type: 'SELECT', selection: mars });

    surfaceActor.send({ type: 'SET_LATITUDE', value: LATITUDE });
    surfaceActor.send({ type: 'SET_LONGITUDE', value: LONGITUDE });

    // cameraActor.send({ type: 'SET_TARGET', focusTarget: mars, zoomIn: true });

    // cameraActor.send({ type: 'TO_SURFACE' });
    cameraActor.send({ type: 'AUTO_ANIMATE', focusTarget: mars });
  });
}
