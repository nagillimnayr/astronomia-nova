import { create } from 'zustand';

interface SimState {
  timescale: number;
}

const useStore = create();
