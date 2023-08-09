import { useKeyPressed } from '@react-hooks-library/core';
import { useThree } from '@react-three/fiber';
import { useController, useXR, useXREvent } from '@react-three/xr';
import { degToRad } from 'three/src/math/MathUtils';

const moveSpeed = 0.05;
const rotateSpeed = 0.05;

export const PlayerControls = () => {
  const { player, controllers, isPresenting, session } = useXR();
  const leftController = useController('left');
  const rightController = useController('right');
  // rightController?.inputSource.gamepad?.mapping.

  const getThree = useThree(({ get }) => get);

  useXREvent('squeeze', (event) => {
    //
  });

  useKeyPressed(' ', () => {
    console.log('player position:', player.position.toArray());
    console.log('player:', player);
    const camera = getThree().camera;
    console.log('camera:', camera.position.toArray(), camera);
  });
  useKeyPressed('w', () => {
    if (!isPresenting) return;
    player.position.z -= moveSpeed;
  });

  useKeyPressed('a', () => {
    if (!isPresenting) return;
    player.position.x -= moveSpeed;
  });

  useKeyPressed('s', () => {
    if (!isPresenting) return;
    player.position.z += moveSpeed;
  });

  useKeyPressed('d', () => {
    if (!isPresenting) return;
    player.position.x += moveSpeed;
  });

  useKeyPressed('ArrowUp', () => {
    if (!isPresenting) return;
    player.rotateX(-degToRad(rotateSpeed));
  });

  useKeyPressed('ArrowLeft', () => {
    if (!isPresenting) return;
    player.rotateY(degToRad(rotateSpeed));
  });

  useKeyPressed('ArrowRight', () => {
    if (!isPresenting) return;
    player.rotateY(-degToRad(rotateSpeed));
  });

  useKeyPressed('ArrowDown', () => {
    if (!isPresenting) return;
    player.rotateX(degToRad(rotateSpeed));
  });

  return (
    <>
      <></>
    </>
  );
};
