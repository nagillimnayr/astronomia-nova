import type { Meta, StoryObj } from '@storybook/react';
import { LoadingFallback } from '../LoadingFallback';

const meta: Meta<typeof LoadingFallback> = {
  title: 'Fallback/LoadingFallback',
  component: LoadingFallback,
};

export default meta;
type Story = StoryObj<typeof LoadingFallback>;

export const Fallback: Story = {
  render: () => {
    return (
      <div className="grid h-screen w-screen place-items-center">
        <LoadingFallback />
      </div>
    );
  },
};
