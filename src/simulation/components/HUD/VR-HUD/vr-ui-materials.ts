import { MeshBasicMaterial } from 'three';
import { colors } from './vr-hud-constants';

export const ICON_MATERIAL_BASE = new MeshBasicMaterial({
  color: colors.icon.fg.base,
  transparent: false,
});
export const ICON_MATERIAL_HOVER = new MeshBasicMaterial({
  color: colors.icon.fg.hover,
  transparent: false,
});
export const ICON_MATERIAL_DISABLED = new MeshBasicMaterial({
  color: colors.icon.fg.disabled,
  transparent: false,
});
