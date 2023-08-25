import { MeshBasicMaterial } from 'three';
import { colors } from './vr-hud-constants';

export const ICON_MATERIAL_BASE = new MeshBasicMaterial({
  color: colors.iconBase,
  transparent: false,
});
export const ICON_MATERIAL_HOVER = new MeshBasicMaterial({
  color: colors.iconHover,
  transparent: false,
});
