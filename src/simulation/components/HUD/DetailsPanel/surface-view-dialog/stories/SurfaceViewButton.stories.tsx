import type { Meta, StoryObj } from '@storybook/react';
import { SurfaceViewButton } from '../SurfaceViewButton';

const meta: Meta<typeof SurfaceViewButton> = {
  title: 'HUD/SurfaceViewButton',
  component: SurfaceViewButton,
};

export default meta;
type Story = StoryObj<typeof SurfaceViewButton>;

export const Primary: Story = {
  render: () => {
    return (
      <div className="font-sans">
        <SurfaceViewButton />
      </div>
    );
  },
};

export const DefaultOpen: Story = {
  render: () => {
    return (
      <div className="font-sans">
        <SurfaceViewButton defaultOpen />
      </div>
    );
  },
};
