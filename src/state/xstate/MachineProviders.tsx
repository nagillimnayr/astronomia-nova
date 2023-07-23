import { type PropsWithChildren } from 'react';
import { ToggleMachineProviders } from './toggle-machine/ToggleMachineProviders';

export const MachineProviders = ({ children }: PropsWithChildren) => {
  return <ToggleMachineProviders>{children}</ToggleMachineProviders>;
};
