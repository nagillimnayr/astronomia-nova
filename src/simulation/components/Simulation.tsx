import React from 'react';
import SolarSystem from './SolarSystem/SolarSystem';

const Simulation = () => {
  return (
    <group>
      <polarGridHelper args={[24, 16, 24, 64]} />
      <SolarSystem />
    </group>
  );
};

export default Simulation;
