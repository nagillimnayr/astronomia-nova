import { makeBorderMaterial } from '@coconut-xr/xmaterials';
import { MeshBasicMaterial } from 'three';

export const VRHudBGMaterial = makeBorderMaterial(MeshBasicMaterial, {
  transparent: false,
});
