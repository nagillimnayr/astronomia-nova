import {
  ColorRepresentation,
  DoubleSide,
  Material,
  Mesh,
  MeshBasicMaterial,
} from 'three';
import { makeRoundedPlane, makeRoundedPlaneBorder } from '../utils/shape';

// type BorderRadius = {
//   topLeft: number;
//   topRight: number;
//   bottomLeft: number;
//   bottomRight: number;
// }
export class Panel extends Mesh {
  private _borderRadius: number;

  constructor(
    width: number,
    height: number,
    borderRadius: number,
    segments?: number
  ) {
    super(makeRoundedPlane(width, height, borderRadius, segments));
    this._borderRadius = borderRadius;
    if (this.material instanceof MeshBasicMaterial) {
      this.material.side = DoubleSide;
    }
  }

  set backgroundColor(color: ColorRepresentation) {
    this.backgroundColor;
    if (this.material instanceof MeshBasicMaterial) {
      this.material.color.set(color);
    } else if (this.material instanceof Array) {
      this.material.forEach((mat) => {
        if (mat instanceof MeshBasicMaterial) {
          mat.color.set(color);
        }
      });
    }
  }
}

export class PanelBorder extends Mesh {
  private _borderRadius: number;

  constructor(
    width: number,
    height: number,
    borderRadius: number,
    borderWidth: number,
    segments?: number
  ) {
    super(
      makeRoundedPlaneBorder(width, height, borderRadius, borderWidth, segments)
    );
    this._borderRadius = borderRadius;
    if (this.material instanceof MeshBasicMaterial) {
      this.material.side = DoubleSide;
    }
  }

  set backgroundColor(color: ColorRepresentation) {
    this.backgroundColor;
    if (this.material instanceof MeshBasicMaterial) {
      this.material.color.set(color);
    } else if (this.material instanceof Array) {
      this.material.forEach((mat) => {
        if (mat instanceof MeshBasicMaterial) {
          mat.color.set(color);
        }
      });
    }
  }
}
