import { KeplerBody } from '@/components/canvas/body/kepler-body';
import { type CameraController } from '@/components/canvas/scene/camera-controller/CameraController';
import {
  DIST_MULT,
  METER,
  PI,
  PI_OVER_TWO,
  SIMULATION_RADIUS,
  SUN_RADIUS,
  TWO_PI,
} from '@/constants/constants';
import { NEAR_CLIP, SURFACE_NEAR_CLIP } from '@/constants/scene-constants';
import { getLocalUpInWorldCoords } from '@/helpers/vector-utils';
import { type RootState } from '@react-three/fiber';
import { type XRState } from '@react-three/xr';
import {
  type Object3D,
  type PerspectiveCamera,
  Vector3,
  Spherical,
} from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { assign, createMachine } from 'xstate';
import { gsap } from 'gsap';
import { delay } from '@/helpers/utils';
import { DEV_ENV } from '@/constants/constants';

const _observerUp = new Vector3();
const _focusUp = new Vector3();
const _cameraUp = new Vector3();

const _observerPos = new Vector3();
const _cameraPos = new Vector3();
const _controllerPos = new Vector3();
const _focusPos = new Vector3();
const _spherical = new Spherical();

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();

const NEPTUNE_APOAPSIS = 4553758200000 * METER;

const tl = gsap.timeline();

// Space view constants:
const SPACE_MAX_DIST = SIMULATION_RADIUS - NEPTUNE_APOAPSIS;
const SPACE_MIN_DIST_FROM_SURFACE = 1e-3;

// Surface view constants:
const SURFACE_MIN_DIST = METER * 1e-1;
const SURFACE_MAX_DIST = 1.5 * SURFACE_MIN_DIST;

// Default FOV.
const FOV = 40;

type Context = {
  getThree: () => RootState;
  getXR: () => XRState;
  controls: CameraController | null;
  mainCamera: PerspectiveCamera | null;
  focusTarget: Object3D | null;
  observer: Object3D | null;
  vrHud: Object3D | null;
};

type Events =
  | { type: 'TO_SURFACE' }
  | { type: 'TO_SPACE' }
  | { type: 'UPDATE'; deltaTime: number }
  | { type: 'ASSIGN_GET_THREE'; getThree: () => RootState }
  | { type: 'START_XR_SESSION' }
  | { type: 'END_XR_SESSION' }
  | { type: 'ASSIGN_CONTROLS'; controls: CameraController }
  | { type: 'ASSIGN_CAMERA'; camera: PerspectiveCamera }
  | { type: 'ASSIGN_OBSERVER'; observer: Object3D | null }
  | { type: 'ASSIGN_VR_HUD'; vrHud: Object3D }
  | { type: 'SET_TARGET'; focusTarget: Object3D | null; zoomIn?: boolean }
  | { type: 'ROTATE_AZIMUTHAL'; deltaAngle: number }
  | { type: 'ROTATE_POLAR'; deltaAngle: number }
  | { type: 'ZOOM'; deltaZoom: number }
  | { type: 'RESET_REF_SPACE' }
  | { type: 'HIDE_VR_HUD' }
  | { type: 'SHOW_VR_HUD' }
  | { type: 'LOCK_CONTROLS' }
  | { type: 'UNLOCK_CONTROLS' };

export const cameraMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./camera-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'camera-machine',
    // Initial context:
    context: () => ({
      controls: null,
      getThree: null!,
      getXR: null!,
      mainCamera: null,
      observer: null,
      focusTarget: null,
      vrHud: null,
    }),

    // Context assignment events:
    on: {
      ASSIGN_GET_THREE: {
        actions: ['logEvent', 'assignGetThree', 'initializeControls'],
      },

      ASSIGN_CONTROLS: {
        cond: (context, event) => {
          return context.controls !== event.controls;
        },
        actions: [
          // 'logEvent',
          'assignControls',
          'initializeControls',
        ],
      },
      ASSIGN_CAMERA: {
        actions: [
          assign({ mainCamera: (_, event) => event.camera }),
          // 'logEvent',
          'setCamera',
          'initializeControls',
        ],
      },
      ASSIGN_OBSERVER: {
        cond: (context, event) => {
          return context.observer !== event.observer;
        },
        actions: [
          assign({ observer: (_, event) => event.observer }),
          // 'logEvent',
        ],
      },

      ASSIGN_VR_HUD: {
        actions: [
          // 'logEvent',
          assign({
            vrHud: (_, { vrHud }) => vrHud,
          }),
          'initializeControls',
        ],
      },
      ROTATE_AZIMUTHAL: {
        actions: ['rotateAzimuthal'],
      },

      ROTATE_POLAR: {
        actions: ['rotatePolar'],
      },

      ZOOM: {
        actions: ['addRadialZoom'],
      },

      END_XR_SESSION: {
        actions: ['logEvent', 'endXRSession'],
      },
      SHOW_VR_HUD: {
        actions: ['logEvent', 'showVRHud'],
      },
      HIDE_VR_HUD: {
        actions: ['logEvent', 'hideVRHud'],
      },
      LOCK_CONTROLS: {
        actions: ['logEvent', ({ controls }) => controls?.lock()],
      },
      UNLOCK_CONTROLS: {
        actions: ['logEvent', ({ controls }) => controls?.unlock()],
      },
    },

    initial: 'space', // Start in 'space' view-mode.

    states: {
      space: {
        entry: ['applySpaceCamUp', 'setSpaceCamDistance'],
        // Cleanup on exit:
        exit: (context) => {
          const { controls, observer } = context;
          if (!controls || !observer) return;
        },
        on: {
          // UPDATE event.
          UPDATE: {
            actions: ['updateCamera'],
          },
          // SET_TARGET: {
          //   internal: true,
          //   actions: ['assignTarget', 'attachToTarget', 'setSpaceCamDistance'],
          // },
          TO_SURFACE: {
            // Transition to 'surface' view-mode:
            target: 'entering_surface',

            actions: ['logEvent'],
          },
          ASSIGN_CONTROLS: {
            cond: (context, event) => {
              return context.controls !== event.controls;
            },
            actions: [
              'logEvent',
              'assignControls',
              'setSpaceCamDistance',
              'initializeControls',
            ],
          },
          START_XR_SESSION: {
            actions: [
              'logEvent',
              'startXRSession',
              // 'setSpaceCamDistance',
              // 'showVRHud',
            ],
          },
        },
        initial: 'changingTarget',
        states: {
          idle: {
            on: {
              SET_TARGET: [
                {
                  cond: (_, { zoomIn }) => Boolean(zoomIn),
                  actions: ['assignTarget'],
                  target: 'changingTargetAndZooming',
                },
                {
                  cond: (_, { zoomIn }) => !Boolean(zoomIn),
                  actions: ['assignTarget'],
                  target: 'changingTarget',
                },
              ],
            },
          },
          changingTarget: {
            entry: ['setSpaceCamDistance'],
            invoke: {
              src: async (context) => {
                const { controls, focusTarget } = context;

                if (!controls || !focusTarget) {
                  return;
                }

                await controls.attachToWithoutMoving(focusTarget);
              },

              id: 'change-target-promise',
              onDone: { target: 'idle' },
              onError: { target: 'idle' },
            },
          },
          changingTargetAndZooming: {
            entry: ['setSpaceCamDistance'],
            invoke: {
              src: async (context) => {
                const { controls, focusTarget } = context;

                if (
                  !controls ||
                  !focusTarget ||
                  !(focusTarget instanceof KeplerBody)
                ) {
                  return;
                }
                await controls.attachToWithoutMoving(focusTarget);

                const radius = focusTarget.meanRadius * 10;
                const diffRadius = Math.abs(controls.radius - radius);
                const duration = Math.log(Math.max(diffRadius, 1)) / 5;

                DEV_ENV && console.log('change target and zoom!');
                DEV_ENV && console.log('minRadius:', controls.minRadius);
                DEV_ENV && console.log('targetRadius:', radius);
                DEV_ENV && console.log('diffRadius:', diffRadius);
                DEV_ENV && console.log('duration:', duration);

                await controls.animateZoomTo(radius);

                DEV_ENV && console.log('target radius:', radius);
                DEV_ENV && console.log('final radius:', controls.radius);
              },

              id: 'change-target-zoom-promise',
              onDone: { target: 'idle' },
              onError: { target: 'idle' },
            },
          },
        },
      },
      entering_surface: {
        invoke: {
          src: async (context) => {
            DEV_ENV && console.log('entering surface');
            const { controls, focusTarget, observer } = context;
            if (
              !controls ||
              !controls.camera ||
              !observer ||
              !focusTarget ||
              !(focusTarget instanceof KeplerBody)
            ) {
              return;
            }

            const bodyMesh = focusTarget.meshRef.current;
            if (!bodyMesh) return;

            /* Get angle between up vector of controller and up vector of body. */
            // _v1.set(...getLocalUpInWorldCoords(controls));
            // _v2.set(...getLocalUpInWorldCoords(bodyMesh));
            // const roll = _v1.angleTo(_v2);

            const roll = degToRad(focusTarget.obliquity);

            controls.resetRotation();

            observer.getWorldPosition(_observerPos);

            /* Get Observer position in controller local space. */
            controls.worldToLocal(_observerPos);

            const observerRadius = _observerPos.length();

            /* Get spherical coordinates of observer position. */
            _spherical.setFromVector3(_observerPos);
            _spherical.makeSafe();

            /* Normalize azimuthal angles so that the rotation will take the shortest path. */
            controls.normalizeAzimuthalAngle();
            // const currentTheta = controls.azimuthalAngle;
            const phi = _spherical.phi;
            const theta = _spherical.theta;

            const targetRadius = observerRadius * 3.5;

            const radius = Math.min(controls.radius, targetRadius);

            /* Set controller targets to current values. */
            controls.spherical.makeSafe();
            controls.resetTarget();
            controls.setMinRadius(SURFACE_MIN_DIST);

            // await controls.animateTo({ radius });
            // await controls.animateTo({ phi, theta });
            // await controls.animateRoll(roll);

            const diffRadius = controls.radius - radius;
            const duration = Math.log(Math.max(diffRadius, 1)) / 5;
            DEV_ENV && console.log('duration:', duration);

            /* Zoom in to body. */
            await gsap.to(controls.spherical, {
              radius: radius,
              duration: duration,
              ease: 'power1.inOut',
              onUpdate: () => {
                controls.updateCameraPosition();
                controls.resetTarget();
              },
            });
            await delay(100);
            /* Rotate to be above observation point. */
            await controls.animateTo({
              phi: phi,
              theta: theta,
              duration: 2,
            });

            /* Rotate to align with equator/polar axis. */
            await controls.animateRoll(roll);

            // console.log('control rotation:', controls.rotation.toArray());

            controls.camera.getWorldPosition(_cameraPos);
            observer.add(controls);
            controls.resetRotation();

            controls.worldToLocal(_cameraPos);
            controls.spherical.setFromVector3(_cameraPos);
            controls.spherical.makeSafe();

            // console.log('control rotation:', controls.rotation.toArray());
            // console.log('phi:', controls.polarAngle);
            // console.log('theta:', controls.azimuthalAngle);

            controls.setAzimuthalAngle(0);
            controls.setPolarAngle(0);
            controls.resetTarget();
            controls.updateCameraPosition();

            /* Zoom in to the surface. */
            await tl
              .to(controls.spherical, {
                radius: SURFACE_MAX_DIST,
                theta: 0,
                duration: 2,
                onUpdate: () => {
                  controls.updateCameraPosition();
                  controls.resetTarget();
                },
              })
              /* Pan camera upwards to the horizon. */
              .to(
                controls.spherical,
                {
                  phi: PI_OVER_TWO,
                  duration: 2,
                  onUpdate: () => {
                    controls.updateCameraPosition();
                    controls.resetTarget();
                  },
                },
                '>-25%'
              );

            controls.unlock();
          },
          id: 'entering_surface_promise',
          onDone: { target: 'surface' },
        },
      },
      surface: {
        entry: [
          'enterSurfaceView',
          'applySurfaceCamUp',
          'setSurfaceCamDistance',
          'attachToObserver',
        ],
        // Cleanup on exit:
        exit: ['logEvent', 'attachToTarget', 'exitSurfaceView'],
        on: {
          // UPDATE event:
          UPDATE: {
            internal: true,
            actions: ['updateCamera', 'updateSurfaceView', 'applySurfaceCamUp'],
          },
          SET_TARGET: {
            internal: true,
            actions: [
              'logEvent',
              'assignTarget',
              'applySurfaceCamUp',
              'setSurfaceCamDistance',
            ],
          },
          TO_SPACE: {
            // Transition to 'space' view-mode:
            target: 'enteringSpace',
            actions: ['logEvent'],
          },
          ASSIGN_CONTROLS: {
            cond: (context, event) => {
              return context.controls !== event.controls;
            },
            actions: [
              'logEvent',
              'assignControls',
              'setSurfaceCamDistance',
              'initializeControls',
            ],
          },
          START_XR_SESSION: {
            actions: [
              'logEvent',
              'startXRSession',
              'setSurfaceCamDistance',
              // 'showVRHud',
            ],
          },
        },
      },
      enteringSpace: {
        invoke: {
          src: async (context) => {
            const { controls, focusTarget, observer } = context;
            if (!focusTarget || !controls || !observer) return;
            DEV_ENV && console.log('entering space');
            controls.setMinRadius(SPACE_MIN_DIST_FROM_SURFACE);
            controls.setMaxRadius(SPACE_MAX_DIST);

            controls.camera.getWorldPosition(_cameraPos);
            focusTarget.add(controls);
            // controls.position.set(0, 0, 0);
            controls.worldToLocal(_cameraPos);
            controls.spherical.setFromVector3(_cameraPos);
            controls.resetTarget();

            // await controls.attachToWithoutMoving(focusTarget);
            controls.applyWorldUp();

            // console.log('control rotation:', controls?.rotation.toArray());
            const body = focusTarget as KeplerBody;
            const dist = body.meanRadius * 40;

            controls.rotation.set(0, 0, 0);

            observer.getWorldPosition(_observerPos);
            controls.worldToLocal(_observerPos);
            controls.spherical.setFromVector3(_observerPos);

            controls.setRadius(body.meanRadius);
            controls.resetTarget();
            controls.setTargetRadius(dist);

            await gsap.to(controls.spherical, {
              radius: dist,
              duration: 1,
              onUpdate: () => {
                controls.updateCameraPosition();
              },
            });
            // await controls.animateTo({ radius: dist });
          },
          id: 'enter-space-promise',
          onDone: { target: 'space' },
        },
      },
    },
  },
  {
    // Action implementations:
    actions: {
      // logEvent: log((_, event) => event),
      logEvent: () => {
        return;
      },

      assignGetThree: assign({
        getThree: (_, { getThree }) => getThree,
      }),
      assignControls: assign({
        controls: (_, event) => {
          return event.controls;
        },
      }),
      assignTarget: assign({
        // Set new focus target.
        focusTarget: (_, event) => {
          return event.focusTarget;
        },
      }),
      setCamera(context, event) {
        const { controls } = context;
        const { camera } = event;
        controls?.setCamera(camera);
      },
      initializeControls: (context) => {
        const { controls, mainCamera, getThree, vrHud } = context;
        if (!controls) return;

        if (mainCamera) {
          controls.setCamera(mainCamera);
          mainCamera.fov = FOV;
        }

        if (getThree) {
          // Get canvas from store.
          const canvas = getThree().gl.domElement;
          if (canvas && !controls.domElement) {
            // Pass canvas to controls for setting up event listeners.
            controls.setDomElement(canvas);
          }
        }

        if (vrHud) {
          // Attach vrHud to controls.
          controls.attachToController(vrHud);
        }
      },
      startXRSession: (context) => {
        const { getThree, controls, vrHud } = context;
        if (!controls) {
          console.error('error initializing xr session. Controls are null.');
          return;
        }

        const { xr } = getThree().gl;

        // XR camera may not be set yet, so set timeout.
        setTimeout(() => {
          const xrCamera = xr.getCamera();
          if (xrCamera && xrCamera.name !== 'xr-camera') {
            xrCamera.name = 'xr-camera';
            const [xrCam1, xrCam2] = xrCamera.cameras;
            xrCam1.name = 'xrCam1';
            xrCam2.name = 'xrCam2';
          }
        }, 100);

        // Position vrHud.
        if (vrHud) {
        }
      },
      endXRSession: (context) => {
        const { vrHud, controls, mainCamera, getThree } = context;
        if (vrHud) {
        }

        const { gl } = getThree();
        const xrCamera = gl.xr.getCamera();

        if (mainCamera) {
          // Need to reset the FOV because it gets messed up for some reason.
          mainCamera.rotation.set(0, 0, 0);
          mainCamera.fov = FOV;
        }
        if (xrCamera) {
          controls?.attachToController(xrCamera);
          xrCamera.rotation.set(0, 0, 0);
        }
      },

      attachToTarget: (context) => {
        const { controls, focusTarget } = context;
        if (!focusTarget || !controls) return;
        // controls.attachControllerTo(focusTarget);
        // // controls.attachToWithoutMoving(focusTarget);
        // controls.applyWorldUp();
      },
      attachToObserver: (context) => {
        const { controls, observer } = context;
        if (!controls || !observer) return;
        // controls.attachControllerTo(observer);
        _observerUp.set(...getLocalUpInWorldCoords(observer));
        controls.up.copy(_observerUp);

        controls.camera.up.copy(controls.up);
      },

      updateCamera: (context, event) => {
        const { controls } = context;

        if (!controls) {
          return;
        }
        controls.update(event.deltaTime);
      },

      enterSurfaceView: (context) => {
        const { controls, observer, focusTarget } = context;
        if (!controls || !observer || !focusTarget) return;

        // Set polar angle to be horizontal relative to the surface.
        // controls.setPolarAngleTarget(0);
        // setTimeout(() => {
        //   controls.setPolarAngleTarget(PI_OVER_TWO);
        // }, 1000);
      },
      exitSurfaceView: (context) => {
        // const { controls,  focusTarget } = context;
        // controls?.attachToWithoutMoving()
        // controls?.applyWorldUp();
        // if (!focusTarget || !controls) return;
        // // console.log('control rotation:', controls?.rotation.toArray());
        // const body = focusTarget as KeplerBody;
        // const dist = body.meanRadius * 4;
      },

      updateSurfaceView: (context) => {
        const { controls, observer } = context;
        if (!controls || !observer) return;
      },

      applySurfaceCamUp: (context) => {
        const { controls, observer, focusTarget } = context;
        if (!controls || !observer || !focusTarget) return;
        // controls.rotation.set(0, 0, 0); // Reset rotation.
      },
      applySpaceCamUp: (context) => {
        // Reset up vector of camera.
        const { controls } = context;
        if (!controls) return;
        controls.applyWorldUp();
      },
      setSpaceCamDistance: (context) => {
        const { controls, focusTarget } = context;
        if (!controls) return;

        controls.maxDistance = SPACE_MAX_DIST;
        // controls.maxDistance = Infinity;
        if (!focusTarget || !(focusTarget instanceof KeplerBody)) {
          controls.minDistance = SUN_RADIUS * 1.1;
          return;
        }

        const meanRadius = focusTarget.meanRadius;

        // Set min distance relative to focus targets radius.
        controls.minDistance = 1.1 * meanRadius;
        controls.camera.near = NEAR_CLIP;

        const radius = focusTarget.meanRadius * 5;
        controls.radius < radius && controls.setTargetRadius(radius);
      },
      setSurfaceCamDistance: (context) => {
        const { controls } = context;
        if (!controls || !controls?.camera) return;
        controls.minDistance = SURFACE_MIN_DIST;
        controls.maxDistance = SURFACE_MAX_DIST;

        controls.camera.near = SURFACE_NEAR_CLIP;
      },
      rotateAzimuthal: ({ controls }, event) => {
        if (!controls || controls.locked) return;
        controls.addAzimuthalRotation(event.deltaAngle);
      },
      rotatePolar: ({ controls }, event) => {
        if (!controls || controls.locked) return;
        controls.addPolarRotation(event.deltaAngle);
      },
      addRadialZoom: ({ controls }, event) => {
        if (!controls || controls.locked) return;
        controls.addRadialZoom(event.deltaZoom);
      },
      showVRHud: (context) => {
        const { vrHud } = context;
        if (!vrHud) return;
        vrHud.visible = true;
      },
      hideVRHud: (context) => {
        const { vrHud } = context;
        if (!vrHud) return;
        vrHud.visible = false;
      },
    },
  }
);
