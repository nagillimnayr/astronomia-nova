import type { Meta, StoryObj } from '@storybook/react';
import { SettingsMenu } from '../SettingsMenu';

const meta: Meta<typeof SettingsMenu> = {
  title: 'HUD/SettingsMenu',
  component: SettingsMenu,
};

export default meta;

type Story = StoryObj<typeof SettingsMenu>;

export const DefaultOpen: Story = {
  render: () => {
    return (
      <div className="relative grid h-screen w-full grid-cols-[8rem_1fr_8rem] grid-rows-[8rem_1fr_8rem] place-items-center">
        <div className="w-50 relative top-0 col-end-[-1] row-start-1 aspect-square ">
          <SettingsMenu defaultOpen />
        </div>
      </div>
    );
  },
};
