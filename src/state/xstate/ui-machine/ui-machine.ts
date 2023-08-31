import { type ActorRefFrom, assign, createMachine, log, spawn } from 'xstate';
import { type MutableRefObject } from 'react';
import { dialogMachine } from './dialog-machine/dialog-machine';
import { toggleMachine } from '../toggle-machine/toggle-machine';
import { sendTo } from 'xstate/lib/actions';

type Context = {
  // settingsMenuActor: ActorRefFrom<typeof dialogMachine>;
  vrSettingsMenuActor: ActorRefFrom<typeof toggleMachine>;
  surfaceDialogActor: ActorRefFrom<typeof dialogMachine>;
  vrSurfaceDialogActor: ActorRefFrom<typeof toggleMachine>;
  screenPortalRef: MutableRefObject<HTMLDivElement>;
  camViewPortalRef: MutableRefObject<HTMLDivElement>;
};

type Events = {};
// | { type: 'TOGGLE' }
// | {
//     type: 'ASSIGN_SCREEN_PORTAL_REF';
//     screenPortalRef: MutableRefObject<HTMLDivElement>;
//   }
// | { type: 'SET_SCREEN_PORTAL'; screenPortal: HTMLDivElement }
// | {
//     type: 'ASSIGN_CAM_VIEW_PORTAL_REF';
//     camViewPortalRef: MutableRefObject<HTMLDivElement>;
//   }
// | { type: 'SET_CAM_VIEW_PORTAL'; camViewPortal: HTMLDivElement };

export const uiMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./ui-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      // events: {} as Events,
    },
    id: 'ui-machine',

    // Initial context:
    context: () => ({
      // settingsMenuActor: null!,
      vrSettingsMenuActor: null!,
      surfaceDialogActor: null!,
      vrSurfaceDialogActor: null!,
      screenPortalRef: null!,
      camViewPortalRef: null!,
    }),

    // Spawn child actor:
    entry: [
      assign({
        // settingsMenuActor: () =>
        //   spawn(dialogMachine, {
        //     name: 'settingsMenuActor',
        //     sync: true,
        //   }),
        vrSettingsMenuActor: () =>
          spawn(toggleMachine, {
            name: 'vrSettingsMenuActor',
            sync: true,
          }),
        surfaceDialogActor: () =>
          spawn(dialogMachine, {
            name: 'surfaceDialogActor',
            sync: true,
          }),
        vrSurfaceDialogActor: () =>
          spawn(toggleMachine, {
            name: 'surfaceDialogActor',
            sync: true,
          }),
      }),
      // Start closed.
      sendTo(({ vrSurfaceDialogActor }) => vrSurfaceDialogActor, {
        type: 'DISABLE',
      }),
    ],

    // Context assignment events:
    // on: {
    //   ASSIGN_SCREEN_PORTAL_REF: {
    //     actions: ['assignScreenPortalRef', log('Assigning screen portal ref')],
    //   },
    //   SET_SCREEN_PORTAL: {
    //     actions: [
    //       (context, event) => {
    //         context.screenPortalRef.current = event.screenPortal;
    //       },
    //     ],
    //   },
    //   ASSIGN_CAM_VIEW_PORTAL_REF: {
    //     actions: [
    //       'assignCamViewPortalRef',
    //       log('Assigning cam view portal ref'),
    //     ],
    //   },
    //   SET_CAM_VIEW_PORTAL: {
    //     actions: [
    //       (context, event) => {
    //         context.camViewPortalRef.current = event.camViewPortal;
    //       },
    //     ],
    //   },
    // },
  },
  {
    actions: {
      // assignScreenPortalRef: assign({
      //   screenPortalRef: (_, event) => event.screenPortalRef,
      // }),
      // assignCamViewPortalRef: assign({
      //   camViewPortalRef: (_, event) => event.camViewPortalRef,
      // }),
    },
  }
);
