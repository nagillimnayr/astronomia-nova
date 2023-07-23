import type { Meta, StoryObj } from '@storybook/react';
import { SurfaceViewDialog } from '../SurfaceViewDialog';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const meta: Meta<typeof SurfaceViewDialog> = {
  title: 'HUD/SurfaceViewDialog',
  component: SurfaceViewDialog,
};

export default meta;
type Story = StoryObj<typeof SurfaceViewDialog>;

export const Primary: Story = {
  render: () => {
    return (
      <AlertDialog.Root defaultOpen open>
        <AlertDialog.Trigger asChild>
          <button>button</button>
        </AlertDialog.Trigger>

        <SurfaceViewDialog />
      </AlertDialog.Root>
    );
  },
};
