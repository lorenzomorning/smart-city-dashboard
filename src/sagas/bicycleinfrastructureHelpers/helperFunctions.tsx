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
export function addBikeInfrastructureType(dataBI: any) {
  const arrayLength = dataBI.features.length;

  for (var i = 0; i < arrayLength; i++) {
    let feature = dataBI.features[i];
    let keys = Object.keys(feature.properties);
    let values = Object.values(feature.properties);

    // Traffic calming
    if (
      ['residential', 'living_street'].includes(feature?.properties?.highway) ||
      feature.properties.traffic_calming
    ) {
      dataBI.features[i].properties.bike_infrastructure_type =
        'traffic_calming';
      continue;
    }

    // Traffic adaptions
    if (['permissive', 'yes'].includes(feature?.properties?.bicycle)) {
      dataBI.features[i].properties.bike_infrastructure_type = 'mixed_path';
    }
    if (feature?.properties?.bicycle === 'designated') {
      dataBI.features[i].properties.bike_infrastructure_type =
        'separated_cycle_lane';
    }
    if (feature.properties.highway && values.includes('cycleway')) {
      dataBI.features[i].properties.bike_infrastructure_type =
        'separated_cycle_lane';
    }
    const cycleway = (subkey: any) => subkey.includes('cycleway');
    const share = (subvalue: any) => subvalue.includes('share');
    if (keys.some(cycleway)) {
      console.log('cycleway in keys');
      if (values.includes('track')) {
        dataBI.features[i].properties.bike_infrastructure_type =
          'separated_cycle_lane';
      } else if (values.includes('lane')) {
        dataBI.features[i].properties.bike_infrastructure_type = 'cycle_lane';
      } else if (values.some(share)) {
        dataBI.features[i].properties.bike_infrastructure_type = 'cycle_lane';
      }
    }
    if (
      feature?.properties?.bicycle === 'yes' &&
      values.includes('traffic_signals')
    ) {
      dataBI.features[i].properties.bike_infrastructure_type = 'traffic_signal';
    }
  }
  return dataBI;
}

/**
 * duplicatePolygonstoPoint to duplicate object of geometry type Polygon (parking)
 * to Point objects referring to the center of the original objects.
 * @param {geoJSON} FeatureCollection
 * @returns {geoJSON} FeatureCollection
 */
export function duplicatePolygonsToPoints(dataBI: any) {
  console.log('DataBI before', dataBI.features.length);
  // deep copy the dataBI with a filter
  const polygonsLines = dataBI.features.filter(
    (feature: any) =>
      feature.geometry.type === 'Polygon' ||
      feature.geometry.type === 'MultiPolygon'
  );

  // Iterate through the features array, convert it to a point and push it to dataBi
  const arrayLength = polygonsLines.length;
  console.log('Array Length', arrayLength);
  for (var i = 0; i < arrayLength; i++) {
    let centerObj = centroid(polygonsLines[i], {
      properties: polygonsLines[i].properties,
    });
    dataBI.features.push(centerObj);
  }

  return dataBI;
}
