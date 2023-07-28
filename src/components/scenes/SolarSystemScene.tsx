import SolarSystem from '@/simulation/components/SolarSystem/SolarSystem';
import Scene from '../canvas/Scene';
import CanvasWrapper from '../canvas/CanvasWrapper';

const SolarSystemScene = () => {
  return (
    <CanvasWrapper>
      <SolarSystem />
    </CanvasWrapper>
  );
};

export default SolarSystemScene;
