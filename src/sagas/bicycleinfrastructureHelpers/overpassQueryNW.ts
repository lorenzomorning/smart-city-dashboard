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

export const ENDPOINT_NW =
  'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%3Barea%5B%22name%22%3D%22M%C3%BCnster%22%5D%5B%22de%3Aplace%22%3D%22city%22%5D%2D%3E%2EsearchArea%3B%28relation%5B%22name%22%3D%22Radverkehrsnetz%20NRW%2C%20Stadt%20M%C3%BCnster%22%5D%28area%2EsearchArea%29%3Brelation%5B%22network%22%3D%22lcn%22%5D%5B%22name%22%21%7E%22Kinderhauser%20Rundweg%22%5D%28area%2EsearchArea%29%3Brelation%5B%22network%22%3D%22rcn%22%5D%28area%2EsearchArea%29%3B%29%3Bway%28r%29%28area%2EsearchArea%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A';
// PRETTY OVERPASS QL for network data
// [out:json];
// area
//   ["name"="Münster"]
//   ["de:place"="city"]
//   ->.searchArea;
// (
//   relation
//     ["name"="Radverkehrsnetz NRW, Stadt Münster"]
//     (area.searchArea);
//   relation
//     ["network"="lcn"]
//     ["name"!~"Kinderhauser Rundweg"]
//     (area.searchArea);
//   relation
//     ["network"="rcn"]
//     (area.searchArea);
// );
// way
//   (r)
//   (area.searchArea);
// out;
// >;
// out skel qt;
