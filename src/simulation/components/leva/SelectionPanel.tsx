import { folder, useControls } from 'leva';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { camState } from '@/simulation/state/CamState';
import { debugState } from '@/simulation/state/DebugState';
import { selectState } from '@/simulation/state/SelectState';

export const SelectionPanel = () => {
  const snap = useSnapshot(selectState);
  const [{ name }, set] = useControls('Selected', () => ({
    name: { value: ' ', editable: false },
    // focus: {
    //   value: false,
    //   onChange: (isFocus: boolean) => {
    //     if (isFocus && selectState.selected) {
    //       camState.setFocus(selectState.selected);
    //     }
    //   },
    // },
  }));

  if (snap.selected) {
    set({
      name: snap.selected.name ?? 'none',
    });
  } else {
    set({
      name: 'none',
    });
  }
  return <></>;
};
