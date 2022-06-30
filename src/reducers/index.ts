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

import { combineReducers } from 'redux';
import aasee from './aasee';
import map from './map';
import opensensemap from './opensensemap';
import parkhaus from './parkhaus';
import passanten from './passanten';
import bicycle from './bicycle';
import bicycleinfrastructure from './bicycleinfrastructure';
import parkingoverlay from './parkingoverlay';

/**
 * The recommended pattern is to split reducer logic based on the slices of your state.
 * Because this is common, Redux provides a utility called combineReducers
 * to make it easy to define which slice reducers are responsible for each slice of state.
 *
 * In our input object we omit the key values that define the slices of the state but
 * directly use the integrated function from the single reducer files (reducers/aasee.ts, ...)
 */

export default combineReducers({
  aasee,
  map,
  opensensemap,
  parkhaus,
  passanten,
  bicycle,
  bicycleinfrastructure,
  parkingoverlay,
});
