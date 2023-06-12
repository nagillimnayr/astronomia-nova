import React, { useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { type DynamicBody } from "../../classes/Dynamics";
import Body from "../Body/Body";
import loadBodyPreset from "../../utils/loadBodyPreset";
import type KeplerBody from "../../classes/KeplerBody";
import { traverseTree } from "../../classes/KeplerBody";
import KeplerTreeContext from "../../context/KeplerTreeContext";
//import { useEventListener } from "@react-hooks-library/core";
import { makeFixedUpdateFn } from "../../systems/FixedTimeStep";
import { DAY } from "../../utils/constants";
import { useTexture } from "@react-three/drei";

const SolarSystem = () => {
  // load textures
  const [
    sunTexture,
    mercuryTexture,
    venusTexture,
    earthTexture,
    marsTexture,
    jupiterTexture,
    saturnTexture,
    uranusTexture,
    neptuneTexture,
  ] = useTexture([
    "src/simulation/assets/textures/2k_sun.jpg",
    "src/simulation/assets/textures/2k_mercury.jpg",
    "src/simulation/assets/textures/2k_venus_atmosphere.jpg",
    "src/simulation/assets/textures/2k_earth_daymap.jpg",
    "src/simulation/assets/textures/2k_mars.jpg",
    "src/simulation/assets/textures/2k_jupiter.jpg",
    "src/simulation/assets/textures/2k_saturn.jpg",
    "src/simulation/assets/textures/2k_uranus.jpg",
    "src/simulation/assets/textures/2k_neptune.jpg",
  ]);
  // use ref to store root of tree
  const root = useRef<KeplerBody>(null!);

  // useEventListener("keypress", (e: KeyboardEvent) => {
  //   if (e.key === " ") {
  //     console.log("Tree root node: ", root.current.name);
  //     console.log("Children of root node: ", root.current.orbitingBodies);
  //   }
  // });

  const assignAsRoot = (body: DynamicBody) => {
    if (!body) {
      return;
    }
    console.log(`setting ${body.name} as root`);
  };

  const fixedUpdate = useCallback(
    makeFixedUpdateFn((timeStep: number) => {
      traverseTree(root.current, timeStep * DAY);
    }, 24),
    [root.current]
  );

  useFrame(({ clock }, delta) => {
    fixedUpdate(delta);
  });

  return (
    <KeplerTreeContext.Provider value={assignAsRoot}>
      <Body
        ref={root}
        args={{
          name: "Sun",
          mass: 1,
          color: 0xfdee00,
        }}
        texture={sunTexture}
      >
        {/* could probably replace this with a string array of the names of
        planets, and call loadBodyPreset inside of a loop */}
        <Body args={loadBodyPreset("Mercury")} texture={mercuryTexture}></Body>
        <Body args={loadBodyPreset("Venus")} texture={venusTexture}></Body>
        <Body args={loadBodyPreset("Earth")} texture={earthTexture}></Body>
        <Body args={loadBodyPreset("Mars")} texture={marsTexture}></Body>
        {/* <Body args={loadBodyPreset('Jupiter')} texture={jupiterTexture}></Body> */}
        {/* <Body args={loadBodyPreset('Saturn')} texture={saturnTexture}></Body>
        <Body args={loadBodyPreset('Uranus')} texture={uranusTexture}></Body>
        <Body args={loadBodyPreset('Neptune')} texture={neptuneTexture}></Body> */}
      </Body>
    </KeplerTreeContext.Provider>
  );
};

export default SolarSystem;
