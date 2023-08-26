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

  // Sets all properties at once. Preferred if multiple properties are going to be set at the same time, rather than setting them one-by-one, which would cause the geometry to be recreated for each property.
  setProperties(
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

  // Width.
  setWidth(width: number) {
    this._width = width;
    this._recreateGeometry();
  }
  set width(width: number) {
    this.setWidth(width);
  }
  get width() {
    return this._width;
  }
  // Height.
  setHeight(height: number) {
    this._height = height;
    this._recreateGeometry();
  }
  set height(height: number) {
    this.setHeight(height);
  }
  get height() {
    return this._height;
  }
  // Radius.
  setRadius(radius: number) {
    this._radius = radius;
    this._recreateGeometry();
  }
  set radius(radius: number) {
    this.setRadius(radius);
  }
  get radius() {
    return this._radius;
  }
  // Segments.
  setSegments(segments: number) {
    this._segments = segments;
    this._recreateGeometry();
  }
  set segments(segments: number) {
    this.setSegments(segments);
  }
  get segments() {
    return this._segments;
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

  // Sets all properties at once. Preferred if multiple properties are going to be set at the same time, rather than setting them one-by-one, which would cause the geometry to be recreated for each property.
  setProperties(
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
  // Border width.
  setBorderWidth(borderWidth: number) {
    this._borderWidth = borderWidth;
    this._recreateGeometry();
  }
  set borderWidth(borderWidth: number) {
    this.setBorderWidth(borderWidth);
  }
  get borderWidth() {
    return this._borderWidth;
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

  // Background color.
  setBackgroundColor(color: ColorRepresentation) {
    this._inner.setColor(color);
  }
  set backgroundColor(color: ColorRepresentation) {
    this._inner.setColor(color);
  }
  // Border color.
  setBorderColor(color: ColorRepresentation) {
    this._outer.setColor(color);
  }
  set borderColor(color: ColorRepresentation) {
    this._outer.setColor(color);
  }

  // Sets all properties at once. Preferred if multiple properties are going to be set at the same time, rather than setting them one-by-one, which would cause the geometry to be recreated for each property.
  setProperties(
    width: number = this._outer.width,
    height: number = this._outer.height,
    radius: number = this._outer.radius,
    borderWidth: number = this._outer.borderWidth,
    segments: number = this._outer.segments
  ) {
    const borderWidth2 = borderWidth * 2;
    this._outer.setProperties(width, height, radius, borderWidth, segments);
    this._inner.setProperties(
      width - borderWidth2,
      height - borderWidth2,
      radius,
      segments
    );
  }

  // Width.
  setWidth(width: number) {
    this.setProperties(width);
  }
  set width(width: number) {
    this.setWidth(width);
  }
  get width() {
    return this._outer.width;
  }
  // Height.
  setHeight(height: number) {
    this.setProperties(undefined, height);
  }
  set height(height: number) {
    this.setHeight(height);
  }
  get height() {
    return this._outer.height;
  }
  // Radius.
  setRadius(radius: number) {
    this.setProperties(undefined, undefined, radius);
  }
  set radius(radius: number) {
    this.setRadius(radius);
  }
  get radius() {
    return this._outer.radius;
  }
  // Border width.
  setBorderWidth(borderWidth: number) {
    this.setProperties(undefined, undefined, undefined, borderWidth);
  }
  set borderWidth(borderWidth: number) {
    this.setBorderWidth(borderWidth);
  }
  get borderWidth() {
    return this._outer.borderWidth;
  }
  // Segments
  setSegments(segments: number) {
    this.setProperties(undefined, undefined, undefined, undefined, segments);
  }
  set segments(segments: number) {
    this.setSegments(segments);
  }
  get segments() {
    return this._outer.segments;
  }
}
