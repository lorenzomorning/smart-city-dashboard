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

export const ENDPOINT_AA =
  'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%3Barea%5B%22name%22%3D%22M%C3%BCnster%22%5D%5B%22de%3Aplace%22%3D%22city%22%5D%2D%3E%2EsearchArea%3B%28relation%5B%22name%22%3D%22%7Bcity%7D%22%5D%5B%22de%3Aplace%22%3D%22city%22%5D%3Brelation%5B%22admin%5Flevel%22%3D%2210%22%5D%28area%2EsearchArea%29%3B%29%3Bout%3B%3E%3E%3Bout%20skel%20qt%3B%0A';

// PRETTY OVERPASS QL for administrative areas
// [out:json]
// ;
// area
//   ["name"="Münster"]
//   ["de:place"="city"]
//   ->.searchArea;
// (
//   relation
//     ["name"="{city}"]
//     ["de:place"="city"];
//   relation
//     ["admin_level"="10"]
//     (area.searchArea);
// );
// out;
// >>;
// out skel qt;
