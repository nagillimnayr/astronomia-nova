import { MachineContext } from '@/state/xstate/MachineProviders';
import { useKeyDown, useKeyPressed } from '@react-hooks-library/core';
import { useThree } from '@react-three/fiber';
import { useController, useXR, useXREvent } from '@react-three/xr';
import { useEffect } from 'react';
import { Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

const _fwd = new Vector3();
const moveSpeed = 0.05;
const rotateSpeed = 1;

export const PlayerControls = () => {
  const { vrActor } = MachineContext.useSelector(({ context }) => context);
  const { player, controllers, isPresenting, session } = useXR();
  const leftController = useController('left');
  const rightController = useController('right');
  // rightController?.inputSource.gamepad?.mapping.

  useEffect(() => {
    if (
      !player ||
      !session ||
      !isPresenting ||
      !leftController ||
      !rightController
    )
      return;
    console.log('initializing player controls!');
    // Assign player.
    vrActor.send({ type: 'ASSIGN_PLAYER', player });
    // Assign controllers.
    vrActor.send({
      type: 'ASSIGN_LEFT_CONTROLLER',
      controller: leftController,
    });
    vrActor.send({
      type: 'ASSIGN_RIGHT_CONTROLLER',
      controller: rightController,
    });
  }, [isPresenting, leftController, player, rightController, session, vrActor]);

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
    player.translateZ(-moveSpeed);
  });

  useKeyPressed('a', () => {
    if (!isPresenting) return;
    player.translateX(-moveSpeed);
  });

  useKeyPressed('s', () => {
    if (!isPresenting) return;
    player.translateZ(moveSpeed);
  });

  useKeyPressed('d', () => {
    if (!isPresenting) return;
    player.translateX(moveSpeed);
  });

  useKeyDown('ArrowUp', () => {
    if (!isPresenting) return;
    player.rotateX(-degToRad(rotateSpeed));
  });

  useKeyDown('ArrowLeft', () => {
    if (!isPresenting) return;
    player.rotateY(degToRad(rotateSpeed));
  });

  useKeyDown('ArrowRight', () => {
    if (!isPresenting) return;
    player.rotateY(-degToRad(rotateSpeed));
  });

  useKeyDown('ArrowDown', () => {
    if (!isPresenting) return;
    player.rotateX(degToRad(rotateSpeed));
  });

  return (
    <>
      <></>
    </>
  );
};
