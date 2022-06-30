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

/**
 * To change something in the state, you need to dispatch an action.
 * An action is a plain JavaScript object (notice how we don’t
 * introduce any magic?) that describes what happened.
 * In our case we add a type to the action, so that the reducer can
 * refer to this action.type
 */

export const UPDATE_PARKING_OVERLAY = 'CHANGE_PARKING_OVERLAY';

export function updateParkingOverlay(overlay: any) {
  return {
    type: UPDATE_PARKING_OVERLAY,
    overlay,
  };
}
