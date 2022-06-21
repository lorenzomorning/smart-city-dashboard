/**
 * Smart City Münster Dashboard
 * Copyright (C) 2022 Reedu GmbH & Co. KG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
  LOAD_BICYCLEINFRASTRUCTURE_DATA_FAILED,
  RENDER_BICYCLEINFRASTRUCTURE_DATA,
} from '../actions/bicycleinfrastructure';

/**
 * The Redux state should contain only plain JS objects, arrays, and primitives.
 * The root state value is usually an object. It's important that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * Here we initialize the state for the Bicycle-Infrastructure data
 *
 */

export interface BicycleInfrastructureState extends ServiceState {
  data: GeoJSON.FeatureCollection;
}

const initialState: BicycleInfrastructureState = {
  data: {
    type: 'FeatureCollection',
    features: [],
  },
  metadata: {
    title: 'Rad Infrastruktur Münster',
    updatedAt: undefined,
    online: false,
    error: undefined,
  },
};

/**
 * This is a reducer - a function that ties the state and the actions together,
 * it takes a current state value and an action object describing "what happened",
 * and returns a new state value.
 * A reducer's function signature is: (state, action) => newState
 *
 * You can use any conditional logic you want in a reducer. In this example,
 * we use a switch statement to read the action.type and change the state accordingly.
 */

export default function bicycleinfrastructure(
  state = initialState,
  action: any
) {
  switch (action.type) {
    case RENDER_BICYCLEINFRASTRUCTURE_DATA:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          updatedAt: new Date(),
          online: true,
        },
        data: action.aasee,
      };
    case LOAD_BICYCLEINFRASTRUCTURE_DATA_FAILED:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          online: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
