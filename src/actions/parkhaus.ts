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

export const LOAD_PARKHAUS_DATA = 'LOAD_PARKHAUS_DATA';
export const LOAD_PARKHAUS_TIMESERIES_DATA = 'LOAD_PARKHAUS_TIMESERIES_DATA';
export const LOAD_PARKHAUS_DATA_FAILED = 'LOAD_PARKHAUS_DATA_FAILED';
export const RENDER_PARKHAUS_DATA = 'RENDER_PARKHAUS_DATA';
export const RENDER_PARKHAUS_TIMELINE_DATA = 'RENDER_PARKHAUS_TIMELINE_DATA';

export function loadParkhausData() {
  return {
    type: LOAD_PARKHAUS_DATA,
  };
}

export function loadParkhausTimeseriesData(from: Date, to: Date) {
  return {
    type: LOAD_PARKHAUS_TIMESERIES_DATA,
    from,
    to,
  };
}
