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

export const ENDPOINT_BI =
  'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%3Barea%5B%22name%22%3D%22M%C3%BCnster%22%5D%5B%22de%3Aplace%22%3D%22city%22%5D%2D%3E%2EsearchArea%3B%28way%5B%7E%22cycleway%2E%2A%22%7E%22%5Elane%22%5D%28area%2EsearchArea%29%3Bway%5B%7E%22cycleway%2E%2A%22%7E%22share%22%5D%28area%2EsearchArea%29%3Bway%5B%22highway%22%7E%22cycleway%22%5D%28area%2EsearchArea%29%3Bway%5B%22highway%22%5D%5B%22bicycle%22%3D%22designated%22%5D%28area%2EsearchArea%29%3Bway%5B%7E%22cycleway%2E%2A%22%7E%22track%22%5D%28area%2EsearchArea%29%3Bway%5B%22highway%22%5D%5B%22bicycle%22%7E%22%28yes%7Cpermissive%29%22%5D%28area%2EsearchArea%29%3Bway%5B%22highway%22%3D%22service%22%5D%5B%22access%22%21%3D%22private%22%5D%5B%22bicycle%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bway%5B%22highway%22%3D%22service%22%5D%5B%22access%22%21%3D%22private%22%5D%5B%22oneway%3Abicycle%22%3D%22no%22%5D%28area%2EsearchArea%29%3Bnode%5B%22crossing%22%3D%22traffic%5Fsignals%22%5D%5B%22bicycle%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bnode%5B%22highway%22%3D%22traffic%5Fsignals%22%5D%5B%22bicycle%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bway%5B%22highway%22%3D%22residential%22%5D%28area%2EsearchArea%29%3Bway%5B%22highway%22%3D%22living%5Fstreet%22%5D%5B%22bicycle%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bnode%5B%22traffic%5Fcalming%22%5D%28area%2EsearchArea%29%3Bnode%5B%22ramp%3Abicycle%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bway%5B%22ramp%3Abicycle%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bnode%5B%22ramp%3Astroller%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bway%5B%22ramp%3Astroller%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bway%5B%22cyclestreet%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bway%5B%22bicycle%5Froad%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bway%5B%22%2E%2Aname%22%7E%22Promenade%22%5D%28area%2EsearchArea%29%3Bway%5B%7E%22cycleway%22%7E%22opposite%22%5D%28area%2EsearchArea%29%3Bway%5B%22oneway%22%3D%22yes%22%5D%5B%22oneway%3Abicyle%22%3D%22no%22%5D%28area%2EsearchArea%29%3Bnode%5B%7E%22cycleway%2E%2A%22%7E%22asl%22%5D%28area%2EsearchArea%29%3Bway%5B%7E%22cycleway%2E%2A%22%7E%22asl%22%5D%28area%2EsearchArea%29%3Bnode%5B%22amenity%22%7E%22bicycle%5Fparking%22%5D%28area%2EsearchArea%29%3Bway%5B%22amenity%22%7E%22bicycle%5Fparking%22%5D%28area%2EsearchArea%29%3Bnode%5B%22amenity%22%3D%22charging%5Fstation%22%5D%5B%22bicycle%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bway%5B%22amenity%22%3D%22charging%5Fstation%22%5D%5B%22bicycle%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bnode%5B%22amenity%22%3D%22charging%5Fstation%22%5D%5B%22description%22%7E%22%5BBb%5Dike%22%5D%28area%2EsearchArea%29%3Bway%5B%22amenity%22%3D%22charging%5Fstation%22%5D%5B%22description%22%7E%22%5BBb%5Dike%22%5D%28area%2EsearchArea%29%3Bnode%5B%22shop%22%3D%22bicycle%22%5D%28area%2EsearchArea%29%3Bway%5B%22shop%22%3D%22bicycle%22%5D%28area%2EsearchArea%29%3Bnode%5B%22amenity%22%3D%22bicycle%5Frental%22%5D%28area%2EsearchArea%29%3Bway%5B%22amenity%22%3D%22bicycle%5Frental%22%5D%28area%2EsearchArea%29%3Bnode%5B%22amenity%22%3D%22bicycle%5Frepair%5Fstation%22%5D%28area%2EsearchArea%29%3Bnode%5B%22vending%22%3D%22bicycle%5Ftube%22%5D%28area%2EsearchArea%29%3Bnode%5B%22information%22%5D%5B%22information%22%21%3D%22board%22%5D%5B%22bicycle%22%3D%22yes%22%5D%28area%2EsearchArea%29%3Bnode%5B%22public%5Ftransport%22%3D%22station%22%5D%5B%22railway%22%7E%22%28halt%7Cstation%29%22%5D%28area%2EsearchArea%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A';

// PRETTY OVERPASS QL for the bicycle infrastructure BI
// [out:json];
// area
//   ["name"="Münster"]
//   ["de:place"="city"]
//   ->.searchArea;
// (
//   way
//     [~"cycleway.*"~"^lane"]
//     (area.searchArea);
//   way
//     [~"cycleway.*"~"share"]
//     (area.searchArea);
//   way
//     ["highway"~"cycleway"]
//     (area.searchArea);
//   way
//     ["highway"]
//     ["bicycle"="designated"]
//     (area.searchArea);
//   way
//     [~"cycleway.*"~"track"]
//     (area.searchArea);
//   way
//     ["highway"]
//     ["bicycle"~"(yes|permissive)"]
//     (area.searchArea);
//   way
//     ["highway"="service"]
//     ["access"!="private"]
//     ["bicycle"="yes"]
//     (area.searchArea);
//   way
//     ["highway"="service"]
//     ["access"!="private"]
//     ["oneway:bicycle"="no"]
//     (area.searchArea);
//   node
//     ["crossing"="traffic_signals"]
//     ["bicycle"="yes"]
//     (area.searchArea);
//   node
//     ["highway"="traffic_signals"]
//     ["bicycle"="yes"]
//     (area.searchArea);
//   way
//     ["highway"="residential"]
//     (area.searchArea);
//   way
//     ["highway"="living_street"]
//     ["bicycle"="yes"]
//     (area.searchArea);
//   node
//     ["traffic_calming"]
//     (area.searchArea);
//   node
//     ["ramp:bicycle"="yes"]
//     (area.searchArea);
//   way
//     ["ramp:bicycle"="yes"]
//     (area.searchArea);
//   node
//     ["ramp:stroller"="yes"]
//     (area.searchArea);
//   way
//     ["ramp:stroller"="yes"]
//     (area.searchArea);
//   way
//     ["cyclestreet"="yes"]
//     (area.searchArea);
//   way
//     ["bicycle_road"="yes"]
//     (area.searchArea);
//   way
//     [".*name"~"Promenade"]
//     (area.searchArea);
//   way
//     [~"cycleway"~"opposite"]
//     (area.searchArea);
//   way
//     ["oneway"="yes"]
//     ["oneway:bicyle"="no"]
//     (area.searchArea);
//   node
//     [~"cycleway.*"~"asl"]
//     (area.searchArea);
//   way
//     [~"cycleway.*"~"asl"]
//     (area.searchArea);
//   node
//     ["amenity"~"bicycle_parking"]
//     (area.searchArea);
//   way
//     ["amenity"~"bicycle_parking"]
//     (area.searchArea);
//   node
//     ["amenity"="charging_station"]
//     ["bicycle"="yes"]
//     (area.searchArea);
//   way
//     ["amenity"="charging_station"]
//     ["bicycle"="yes"]
//     (area.searchArea);
//   node
//     ["amenity"="charging_station"]
//     ["description"~"[Bb]ike"]
//     (area.searchArea);
//   way
//     ["amenity"="charging_station"]
//     ["description"~"[Bb]ike"]
//     (area.searchArea);
//   node
//     ["shop"="bicycle"]
//     (area.searchArea);
//   way
//     ["shop"="bicycle"]
//     (area.searchArea);
//   node
//     ["amenity"="bicycle_rental"]
//     (area.searchArea);
//   way
//     ["amenity"="bicycle_rental"]
//     (area.searchArea);
//   node
//     ["amenity"="bicycle_repair_station"]
//     (area.searchArea);
//   node
//     ["vending"="bicycle_tube"]
//     (area.searchArea);
//   node
//     ["information"]
//     ["information"!="board"]
//     ["bicycle"="yes"]
//     (area.searchArea);
//   node
//     ["public_transport"="station"]
//     ["railway"~"(halt|station)"]
//     (area.searchArea);
// );
// out;
// >;
// out skel qt;
