import type { Meta, StoryObj } from '@storybook/react';
import { DetailsPanel } from '../DetailsPanel';
import { useEffect } from 'react';
import KeplerBody from '@/simulation/classes/kepler-body';
import { MachineContext } from '@/state/xstate/MachineProviders';

const meta: Meta<typeof DetailsPanel> = {
  title: 'HUD/DetailsPanel',
  component: DetailsPanel,
};

export default meta;
type Story = StoryObj<typeof DetailsPanel>;

export const Default: Story = {
  render: () => {
    return (
      <>
        <DetailsPanelStory />
      </>
    );
  },
};

const params = {
  name: 'Earth',
  mass: 5.97219e24,
  meanRadius: 6371010,
  obliquity: 23.4392911,
  siderealRotationRate: 0.00007292115,
  siderealRotationPeriod: 86164.10063718943,
};
const DetailsPanelStory = () => {
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
      <div className="grid h-full w-full place-items-center font-sans">
        <DetailsPanel />
      </div>
    </>
  );
};
