import type { Meta, StoryObj } from '@storybook/react';
import { OpacitySliders } from '../OpacitySliders';

const meta: Meta<typeof OpacitySliders> = {
  title: 'HUD/OpacitySliders',
  component: OpacitySliders,
};

export default meta;

type Story = StoryObj<typeof OpacitySliders>;

export const Primary: Story = {
  render: () => {
    return (
      <div className="p-12 font-sans">
        <OpacitySliders />
      </div>
    );
  },
};
