import type { Meta, StoryObj } from '@storybook/react';
import { SurfaceViewDialog } from '../SurfaceViewDialog';
import { SurfaceViewDialogStory } from './SurfaceViewDialogStory';

const meta: Meta<typeof SurfaceViewDialog> = {
  title: 'HUD/SurfaceViewDialog',
  component: SurfaceViewDialog,
};

export default meta;
type Story = StoryObj<typeof SurfaceViewDialog>;

export const Primary: Story = {
  render: () => {
    return <SurfaceViewDialogStory />;
  },
};
