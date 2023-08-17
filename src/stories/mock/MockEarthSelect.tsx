import KeplerBody from '@/simulation/classes/kepler-body';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEffect } from 'react';

const params = {
  name: 'Earth',
  mass: 5.97219e24,
  meanRadius: 6371010,
  obliquity: 23.4392911,
  siderealRotationRate: 0.00007292115,
  siderealRotationPeriod: 86164.10063718943,
};
export const MockEarthSelect = () => {
  const { selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  useEffect(() => {
    // Instantiate KeplerBody.
    const body = new KeplerBody(params);
    body.name = params.name;
    // Select the newly create body.
    selectionActor.send({ type: 'SELECT', selection: body });
  }, [selectionActor]);
  return (
    <>
      <></>
    </>
  );
};
