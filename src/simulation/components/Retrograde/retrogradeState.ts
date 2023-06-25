import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Object3D,
  Vector3,
} from 'three';
import { proxy } from 'valtio';
import KeplerBody from '~/simulation/classes/KeplerBody';
import { camState } from '~/simulation/state/CamState';
import { simState } from '~/simulation/state/SimState';
import { keplerTreeState } from '~/simulation/state/keplerTreeState';

const maxSize = 10000;

type RetrogradeStateObj = {
  referenceBody: Object3D;
  otherBody: Object3D;
  points: Vector3[];
  line: Line;
  path: Line;
  setReferenceBody: (body: Object3D) => void;
  setOtherBody: (body: Object3D) => void;

  update: () => void;
};

const setReferenceBody = (body: Object3D) => {
  retrogradeState.referenceBody = body;
  camState.setFocus(body);
  simState.getState().scene.add(retrogradeState.path);
  // simState.getState().scene.add(retrogradeState.line);
  // body.add(retrogradeState.path);
};
const setOtherBody = (body: Object3D) => {
  retrogradeState.otherBody = body;
};

const update = () => {
  if (!retrogradeState.referenceBody || !retrogradeState.otherBody) return;

  const refPos = new Vector3();
  retrogradeState.referenceBody.getWorldPosition(refPos);
  const otherPos = new Vector3();
  retrogradeState.otherBody.getWorldPosition(otherPos);

  retrogradeState.line.geometry.setFromPoints([refPos, otherPos]);
  // record relative position
  retrogradeState.points.push(new Vector3().subVectors(otherPos, refPos));

  // if over maxSize, remove the first point
  if (retrogradeState.points.length > maxSize) {
    retrogradeState.points.shift();
  }

  // update line
  retrogradeState.path.position.set(...refPos.toArray());
  retrogradeState.path.geometry.setFromPoints(retrogradeState.points);
};

export const retrogradeState = proxy<RetrogradeStateObj>({
  referenceBody: null!,
  otherBody: null!,
  points: [],
  line: new Line(
    new BufferGeometry(),
    new LineBasicMaterial({
      color: 'red',
      linewidth: 5,
    })
  ),
  path: new Line(
    new BufferGeometry(),
    new LineBasicMaterial({
      color: 'red',
      linewidth: 5,
    })
  ),

  setReferenceBody,
  setOtherBody,
  update,
});
