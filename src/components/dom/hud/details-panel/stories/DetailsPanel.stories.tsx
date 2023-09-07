import { MockEarthSelect } from '@/stories/mocks/MockEarthSelect';
import type { Meta, StoryObj } from '@storybook/react';
import { DetailsPanel } from '../DetailsPanel';

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

const DetailsPanelStory = () => {
  return (
    <>
      <div className="grid h-full w-full place-items-center font-sans">
        <MockEarthSelect />
        <DetailsPanel />
      </div>
    </>
  );
};
