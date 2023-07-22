import type { Meta, StoryObj } from '@storybook/react';
import { SurfaceViewDialog } from '../SurfaceViewDialog';

const meta: Meta<typeof SurfaceViewDialog> = {
  component: SurfaceViewDialog,
};

export default meta;
type Story = StoryObj<typeof SurfaceViewDialog>;

export const Primary: Story = {
  render: () => <SurfaceViewDialog />,
};
