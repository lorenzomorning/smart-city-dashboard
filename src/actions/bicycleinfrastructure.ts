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
 * To change something in the state, an action must be dispatched.
 * An action is a plain JavaScript object (notice how we don’t
 * introduce any magic?) that describes what happened.
 * There is always a type of action, so that the reducer can
 * refer to this via action.type
 */

export const LOAD_BICYCLEINFRASTRUCTURE_DATA =
  'LOAD_BICYCLEINFRASTRUCTURE_DATA';
export const LOAD_BICYCLEINFRASTRUCTURE_DATA_FAILED =
  'LOAD_BICYCLEINFRASTRUCTURE_DATA_FAILED';
export const RENDER_BICYCLEINFRASTRUCTURE_DATA =
  'RENDER_BICYCLEINFRASTRUCTURE_DATA';

export function loadBicycleinfrastructureData() {
  return {
    type: LOAD_BICYCLEINFRASTRUCTURE_DATA,
  };
}
