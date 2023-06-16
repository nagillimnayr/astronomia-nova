import { Hud } from '@react-three/drei';
import TimePanel from '../Time/TimePanel';

export const HUD = () => {
  return (
    <>
      <Hud>
        <TimePanel />
      </Hud>
    </>
  );
};
