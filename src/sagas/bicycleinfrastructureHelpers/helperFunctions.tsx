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

import centroid from '@turf/centroid';

/**
 * addBikeInfrastructureType to categorize the dataBI according to each
 * features properties
 * @param {geoJSON} FeatureCollection
 * @return {geoJSON} FeatureCollection
 */
export function addBikeInfrastructureType(dataBi: any) {
  const arrayLength = dataBi.features.length;

  for (var i = 0; i < arrayLength; i++) {
    let feature = dataBi.features[i];
    let keys = Object.keys(feature.properties);
    let values = Object.values(feature.properties);
    const cycleway = (subkey: any) => subkey.includes('cycleway');
    const share = (subvalue: any) => subvalue.includes('share');

    // Traffic calming
    if (
      ['residential', 'living_street'].includes(feature?.properties?.highway) ||
      feature.properties.traffic_calming
    ) {
      dataBi.features[i].properties.bike_infrastructure_type =
        'traffic_calming';
    }

    // Traffic adaptions
    if (['permissive', 'yes'].includes(feature?.properties?.bicycle)) {
      dataBi.features[i].properties.bike_infrastructure_type = 'mixed_path';
    }
    if (feature?.properties?.bicycle === 'designated') {
      dataBi.features[i].properties.bike_infrastructure_type =
        'separated_cycle_lane';
    }
    if (feature.properties.highway && values.includes('cycleway')) {
      dataBi.features[i].properties.bike_infrastructure_type =
        'separated_cycle_lane';
    }
    if (keys.some(cycleway)) {
      if (values.includes('track')) {
        dataBi.features[i].properties.bike_infrastructure_type =
          'separated_cycle_lane';
      } else if (values.includes('lane')) {
        dataBi.features[i].properties.bike_infrastructure_type = 'cycle_lane';
      } else if (values.some(share)) {
        dataBi.features[i].properties.bike_infrastructure_type = 'cycle_lane';
      }
    }
    if (
      feature?.properties?.bicycle === 'yes' &&
      values.includes('traffic_signals')
    ) {
      dataBi.features[i].properties.bike_infrastructure_type = 'traffic_signal';
      continue;
    }
    // Parking and Charging
    if (feature?.properties?.amenity === 'bicycle_parking') {
      dataBi.features[i].properties.bike_infrastructure_type = 'parking';
      continue;
    }
    if (feature?.properties?.amenity === 'charging_station') {
      dataBi.features[i].properties.bike_infrastructure_type =
        'charging_station';
      continue;
    }
    // Services
    if (feature?.properties?.amenity === 'bicycle_repair_station') {
      dataBi.features[i].properties.bike_infrastructure_type =
        'bicycle_repair_station';
      continue;
    }
    if (feature?.properties?.amenity === 'bicycle_rental') {
      dataBi.features[i].properties.bike_infrastructure_type = 'bicycle_rental';
      continue;
    }
    if (feature?.properties?.vending === 'bicycle_tube') {
      dataBi.features[i].properties.bike_infrastructure_type =
        'tube_vending_machine';
      continue;
    }
    if (feature?.properties?.shop === 'bicycle') {
      dataBi.features[i].properties.bike_infrastructure_type = 'bicycle_shop';
      continue;
    }
    // Cycling Street
    if (
      feature?.properties?.cyclestreet === 'yes' ||
      feature?.properties?.bicycle_road === 'yes' ||
      feature?.properties?.name === 'Promenade'
    ) {
      dataBi.features[i].properties.bike_infrastructure_type = 'cycling_street';
      continue;
    }
    // Oneway Exception
    if (keys.some(cycleway)) {
      let cyclewayKeyIndex = keys.findIndex((subkey) =>
        subkey.includes('cycleway')
      );
      let cyclewayKey = keys[cyclewayKeyIndex];
      if (feature.properties[cyclewayKey].includes('opposite')) {
        dataBi.features[i].properties.bike_infrastructure_type =
          'oneway_exception';
      }
    }
    if (
      feature.properties?.oneway === 'yes' &&
      feature.properties['oneway:bicycle'] === 'no'
    ) {
      dataBi.features[i].properties.bike_infrastructure_type =
        'oneway_exception';
    }

    // Wayfinding
    if (
      ['guidepost', 'map', 'route_marker'].includes(
        feature.properties?.information
      )
    ) {
      dataBi.features[i].properties.bike_infrastructure_type = 'wayfinding';
      continue;
    }
    // Ramps at Steps
    if (
      'ramp:bicycle' in feature.properties ||
      'ramp:stroller' in feature.properties
    ) {
      if (
        feature.properties['ramp:bicycle'] === 'yes' ||
        feature.properties['ramp:stroller'] === 'yes'
      ) {
        dataBi.features[i].properties.bike_infrastructure_type = 'ramp';
        // Convert LineString or Polygon to Point geometry
        if (['LineString', 'Polygon'].includes(feature.geometry.type)) {
          dataBi.features[i].geometry = centroid(feature).geometry;
        }
      }
    }
    // Train Stations
    if (['halt', 'station'].includes(feature.properties?.railway)) {
      dataBi.features[i].properties.bike_infrastructure_type = 'train_station';
      continue;
    }
    // Assign nd to remainings
    if (!feature.properties.bike_infrastructure_type) {
      dataBi.features[i].properties.bike_infrastructure_type = 'nd';
      continue;
    }
  }
  return dataBi;
}

/**
 * duplicatePolygonstoPoint duplicates Ppolygon Features to Point Feature by
 * changing their geometry to Points
 * @param {geoJSON} FeatureCollection
 * @returns {geoJSON} FeatureCollection
 */
export function duplicatePolygonsToPoints(dataBi: any) {
  // deep copy the dataBI after filter
  const polygons = dataBi.features.filter(
    (feature: any) =>
      feature.geometry.type === 'Polygon' ||
      feature.geometry.type === 'MultiPolygon'
  );
  const polygonsCopy = JSON.parse(JSON.stringify(polygons));

  // Iterate through the features array, convert it to a point and push it to dataBi
  const arrayLength = polygonsCopy.length;
  for (var i = 0; i < arrayLength; i++) {
    let centerObj = centroid(polygonsCopy[i], {
      properties: polygonsCopy[i].properties,
    });
    dataBi.features.push(centerObj);
  }

  return dataBi;
}

/**
 * duplicateTrafficCalming duplicates ways that fulfill the requirements to be a
 * traffic calming feature but that were overwritten by following bike_infrastructure_types
 * @param FeatureCollection
 * @return FeatureCollection
 */
export function duplicateTrafficCalming(dataBiType: any) {
  // Filter dataBiType
  const possibleOverlaps = dataBiType.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'oneway_exception' ||
      feature.properties.bike_infrastructure_type === 'separated_cycle_lane' ||
      feature.properties.bike_infrastructure_type === 'cycle_lane' ||
      feature.properties.bike_infrastructure_type === 'mixed_path' ||
      feature.properties.bike_infrastructure_type === 'cycling_street'
  );

  // Iterate through the features array, deep copy matches,
  // convert it to a point and push it to dataBi
  const arrayLength = possibleOverlaps.length;
  for (var i = 0; i < arrayLength; i++) {
    let feature = possibleOverlaps[i];
    if (
      ['residential', 'living_street'].includes(feature.properties?.highway) ||
      feature.properties.traffic_calming
    ) {
      let featureCopy = JSON.parse(JSON.stringify(feature));
      featureCopy.properties.bike_infrastructure_type = 'traffic_calming';
      dataBiType.features.push(featureCopy);
    }
  }
  return dataBiType;
}

/**
 * splitTrafficSignals takes a Traffic Signal Feature as LineString and splits
 * it into two Traffic Signal Point Features taking the starting and the end point of the coordinates
 * @param FeatureCollection
 * @return FeatureCollection
 */
export function splitTrafficSignal(dataBiType: any) {
  // Filter dataBiType
  const trafficSignalLines = dataBiType.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'traffic_signal' &&
      feature.geometry.type === 'LineString'
  );
  console.log('Traffic Signal Lines', trafficSignalLines);

  // Iterate through the features array, deep copy matches,
  // convert it to a point and push it to dataBi
  const arrayLength = trafficSignalLines.length;
  for (var i = 0; i < arrayLength; i++) {
    let feature = trafficSignalLines[i];
  }
  //return dataBiType;
}
