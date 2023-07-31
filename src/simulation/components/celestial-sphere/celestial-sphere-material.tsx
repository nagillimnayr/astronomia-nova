import { shaderMaterial } from '@react-three/drei';
import { Texture } from 'three';

const vertexShader = /*glsl*/ `
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// attribute vec3 position;
// attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fragShader = /*glsl*/ `
precision highp float;

uniform sampler2D starMap;
uniform sampler2D gridMap;
uniform sampler2D figureMap;
uniform float gridOpacity;
uniform float figureOpacity;

varying vec2 vUv;

void main() {
  vec4 starColor = texture( starMap, vUv );
  vec4 gridColor = texture( gridMap, vUv ) * gridOpacity;
  vec4 figureColor = texture( figureMap, vUv ) * figureOpacity;

  gl_FragColor = starColor + gridColor + figureColor;
}

`;

export const CelestialSphereMaterial = shaderMaterial(
  {
    starMap: new Texture(),
    gridMap: new Texture(),
    figureMap: new Texture(),
    gridOpacity: 1,
    figureOpacity: 1,
  },
  vertexShader,
  fragShader
);

export type CelestialSphereMaterialImpl = {
  starMap: Texture;
  gridMap: Texture;
  figureMap: Texture;
  gridOpacity: number;
  figureOpacity: number;
} & JSX.IntrinsicElements['shaderMaterial'];
