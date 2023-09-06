import { useVRThumbstickControls } from './useVRThumbstickControls';
import { useVRButtonControls } from './useVRButtonControls';

export function useVRControls() {
  useVRButtonControls();
  useVRThumbstickControls();
}
