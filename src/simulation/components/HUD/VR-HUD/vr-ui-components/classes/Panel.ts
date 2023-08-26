import {
  type ColorRepresentation,
  DoubleSide,
  Material,
  Mesh,
  MeshBasicMaterial,
  Shape,
  ShapeGeometry,
  Object3D,
} from 'three';
import { makeRoundedPlane, makeRoundedPlaneBorder } from '../utils/shape';
import { set } from 'lodash';

// type BorderRadius = {
//   topLeft: number;
//   topRight: number;
//   bottomLeft: number;
//   bottomRight: number;
// }
export class PanelInner extends Mesh {
  protected _shape = new Shape();
  protected _width: number;
  protected _height: number;
  protected _radius: number;
  protected _segments: number;

  constructor(width: number, height: number, radius: number, segments = 16) {
    super(undefined, new MeshBasicMaterial({ side: DoubleSide }));

    this._width = width;
    this._height = height;
    this._radius = radius;
    this._segments = segments;

    this._recreateGeometry();
  }

  setColor(color: ColorRepresentation) {
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

  protected _recreateGeometry() {
    // Update shape.
    makeRoundedPlane(this._width, this._height, this._radius, this._shape);

    const geo = this.geometry;
    this.geometry = new ShapeGeometry(this._shape, this._segments); // New geometry.
    geo.dispose(); // Dispose of old geometry.
  }

  set(
    width: number,
    height: number,
    radius: number,
    segments: number = this._segments
  ) {
    this._width = width;
    this._height = height;
    this._radius = radius;
    this._segments = segments;

    this._recreateGeometry();
  }
}

export class PanelOuter extends PanelInner {
  private _borderWidth: number;

  constructor(
    width: number,
    height: number,
    radius: number,
    borderWidth: number,
    segments = 16
  ) {
    super(width, height, radius, segments);
    this._borderWidth = borderWidth;
    this._recreateGeometry();
  }

  protected _recreateGeometry() {
    // Update shape.
    makeRoundedPlaneBorder(
      this._width,
      this._height,
      this._radius,
      this._borderWidth,
      this._shape
    );

    const geo = this.geometry;
    this.geometry = new ShapeGeometry(this._shape, this._segments); // New geometry.
    geo.dispose(); // Dispose of old geometry.
  }

  set(
    width: number,
    height: number,
    radius: number,
    borderWidth: number,
    segments: number = this._segments
  ) {
    this._width = width;
    this._height = height;
    this._radius = radius;
    this._borderWidth = borderWidth;
    this._segments = segments;

    this._recreateGeometry();
  }
}

export class Panel extends Object3D {
  private _inner: PanelInner;
  private _outer: PanelOuter;

  constructor(
    width: number,
    height: number,
    radius: number,
    borderWidth: number,
    segments = 16
  ) {
    super();

    const borderWidth2 = borderWidth * 2;
    this._inner = new PanelInner(
      width - borderWidth2,
      height - borderWidth2,
      radius,
      segments
    );
    this._outer = new PanelOuter(width, height, radius, borderWidth, segments);
    this.add(this._inner);
    this.add(this._outer);
  }

  setBackgroundColor(color: ColorRepresentation) {
    this._inner.setColor(color);
  }
  set backgroundColor(color: ColorRepresentation) {
    this._inner.setColor(color);
  }
  setBorderColor(color: ColorRepresentation) {
    this._outer.setColor(color);
  }
  set borderColor(color: ColorRepresentation) {
    this._outer.setColor(color);
  }
}
