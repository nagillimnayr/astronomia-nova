import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';

/** Calls gsap.ticker.tick() inside of useFrame(). Necessary to update GSAP animations when in VR as they otherwise won't work in the oculus browser. */
export const useVRTicker = () => {
  useFrame(({ gl }, delta) => {
    if (gl.xr.isPresenting) {
      gsap.ticker.tick();
    }
  });
};
