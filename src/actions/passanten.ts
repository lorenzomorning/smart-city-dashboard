export const LOAD_PEDESTRIAN_DATA = 'LOAD_PEDESTRIAN_DATA';
export const LOAD_PEDESTRIAN_DATA_FAILED = 'LOAD_PEDESTRIAN_DATA_FAILED';
export const RENDER_PEDESTRIAN_DATA = 'RENDER_PEDESTRIAN_DATA';

export function loadPedestrianData() {
  return {
    type: LOAD_PEDESTRIAN_DATA,
  };
}
