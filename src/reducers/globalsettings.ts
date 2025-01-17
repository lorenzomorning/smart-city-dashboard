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

import { UPDATE_PARKING_OVERLAY } from '../actions/globalsettings';
import { UPDATE_EXPLORE_MODE } from '../actions/globalsettings';

/**
 * The Redux state should contain only plain JS objects, arrays, and primitives.
 * The root state value is usually an object. It's important that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * Here we initialize the state for the Aasee data
 *
 */

interface GlobalSettingsState {
  parkingOverlay: boolean;
  exploreMode: boolean;
}

const initialState: GlobalSettingsState = {
  parkingOverlay: true,
  exploreMode: false,
};

export default function globalsettings(state = initialState, action: any) {
  switch (action.type) {
    case UPDATE_PARKING_OVERLAY:
      return {
        ...state,
        parkingOverlay: action.parkingOverlay,
      };
    case UPDATE_EXPLORE_MODE:
      return {
        ...state,
        exploreMode: action.exploreMode,
      };
    default:
      return state;
  }
}
