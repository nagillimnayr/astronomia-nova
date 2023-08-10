import { FullSolarSystem } from '@/simulation/components/SolarSystem/FullSolarSystem';
import CanvasWrapper from '../canvas/CanvasWrapper';

const SolarSystemScene = () => {
  return (
    <CanvasWrapper>
      <FullSolarSystem />
    </CanvasWrapper>
  );
};

export default SolarSystemScene;
