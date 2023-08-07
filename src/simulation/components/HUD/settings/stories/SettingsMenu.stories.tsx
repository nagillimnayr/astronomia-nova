import type { Meta, StoryObj } from '@storybook/react';
import { SettingsMenu } from '../SettingsMenu';
import { useEffect } from 'react';
import { SettingsMenuStory } from './SettingsMenuStory';

const meta: Meta<typeof SettingsMenu> = {
  title: 'HUD/SettingsMenu',
  component: SettingsMenu,
};

export default meta;

type Story = StoryObj<typeof SettingsMenu>;

export const DefaultOpen: Story = {
  render: () => {
    return (
      <div className="grid h-screen w-full place-items-center">
        <SettingsMenuStory />
      </div>
    );
  },
};
