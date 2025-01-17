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
  LOAD_PEDESTRIAN_DATA_FAILED,
  RENDER_PEDESTRIAN_DATA,
} from '../actions/passanten';

const initialState: ServiceState = {
  data: {},
  metadata: {
    title: 'Passanten',
    updatedAt: undefined,
    online: false,
    error: undefined,
  },
};

export default function pedestrian(state = initialState, action: any) {
  switch (action.type) {
    case RENDER_PEDESTRIAN_DATA:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          updatedAt: new Date(),
          online: true,
        },
        data: action.pedestrian,
      };
    case LOAD_PEDESTRIAN_DATA_FAILED:
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
