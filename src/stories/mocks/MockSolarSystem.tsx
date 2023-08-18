import KeplerBody from '@/simulation/classes/kepler-body';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect, useMemo } from 'react';

function constructKeplerTree() {
  const sun = new KeplerBody({ mass: 0 });
  sun.name = 'Sun';

  const mercury = new KeplerBody({ mass: 0 });
  mercury.name = 'Mercury';
  sun.add(mercury);
  sun.addOrbitingBody(mercury);

  const venus = new KeplerBody({ mass: 0 });
  venus.name = 'Venus';
  sun.add(venus);
  sun.addOrbitingBody(venus);

  const earth = new KeplerBody({ mass: 0 });
  earth.name = 'Earth';
  sun.add(earth);
  sun.addOrbitingBody(earth);

  const moon = new KeplerBody({ mass: 0 });
  moon.name = 'Moon';
  earth.add(moon);
  earth.addOrbitingBody(moon);

  const mars = new KeplerBody({ mass: 0 });
  mars.name = 'Mars';
  sun.add(mars);
  sun.addOrbitingBody(mars);

  const jupiter = new KeplerBody({ mass: 0 });
  jupiter.name = 'Jupiter';
  sun.add(jupiter);
  sun.addOrbitingBody(jupiter);

  const saturn = new KeplerBody({ mass: 0 });
  saturn.name = 'Saturn';
  sun.add(saturn);
  sun.addOrbitingBody(saturn);

  const uranus = new KeplerBody({ mass: 0 });
  uranus.name = 'Uranus';
  sun.add(uranus);
  sun.addOrbitingBody(uranus);

  const neptune = new KeplerBody({ mass: 0 });
  neptune.name = 'Neptune';
  sun.add(neptune);
  sun.addOrbitingBody(neptune);

  return sun;
}

export const MockSolarSystem = () => {
  const { keplerTreeActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const root = useMemo(constructKeplerTree, []);
  useEffect(() => {
    // Pass the root to the state machine.
    keplerTreeActor.send({ type: 'ASSIGN_ROOT', root });
  }, [keplerTreeActor, root]);
  return (
    <>
      <></>
    </>
  );
};
