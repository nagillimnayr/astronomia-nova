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
      <div className="font-sans">
        <DetailsPanel />
      </div>
    );
  },
};
