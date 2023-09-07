import { useVRButtonControls } from './useVRButtonControls';
import { useVRThumbstickControls } from './useVRThumbstickControls';

export function useVRControls() {
  useVRButtonControls();
  useVRThumbstickControls();
}
