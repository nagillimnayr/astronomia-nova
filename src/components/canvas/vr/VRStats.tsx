import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import StatsVR from 'statsvr';

export const VRStats = () => {
  const getThree = useThree(({ get }) => get);

  const statsVR = useMemo(() => {
    const { scene, camera } = getThree();
    const statsVR = new StatsVR(scene, camera);
    return statsVR;
  }, [getThree]);

  useFrame((state, delta) => {
    statsVR.update();
  });

  return (
    <>
      <></>
    </>
  );
};
