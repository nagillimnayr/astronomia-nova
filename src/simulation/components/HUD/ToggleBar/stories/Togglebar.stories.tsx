import type { Meta, StoryObj } from '@storybook/react';
import { ToggleBar } from '../ToggleBar';

const meta: Meta<typeof ToggleBar> = {
  title: 'HUD/ToggleBar',
  component: ToggleBar,
};

export default meta;
type Story = StoryObj<typeof ToggleBar>;

export const Primary: Story = {
  render: () => {
    return (
      <div className="">
        <ToggleBar />
      </div>
    );
  },
};
