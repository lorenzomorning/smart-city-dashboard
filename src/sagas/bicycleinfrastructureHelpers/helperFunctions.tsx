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
import booleanWithin from '@turf/boolean-within';
import booleanIntersects from '@turf/boolean-intersects';
import flatten from '@turf/flatten';
import geomlength from '@turf/length';
import combine from '@turf/combine';
import lineSplit from '@turf/line-split';
import pointOnFeature from '@turf/point-on-feature';
import biffer from '@turf/buffer';
import { featureEach } from '@turf/meta';
import { featureCollection } from '@turf/helpers';
import buffer from '@turf/buffer';
const clip = require('turf-clip');
const gjv = require('geojson-validation');

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
    const cycleway = (subkey: any) => subkey.includes('cycleway');
    const share = (subvalue: any) => subvalue.includes('share');
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
export function splitTrafficSignalLines(dataBiType: any) {
  // Filter dataBiType
  const trafficSignalLines = dataBiType.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'traffic_signal' &&
      feature.geometry.type === 'LineString'
  );

  // Iterate through the features array, deep copy matches,
  // convert it to a point and push it to dataBi
  const arrayLength = trafficSignalLines.length;
  for (var i = 0; i < arrayLength; i++) {
    // Deep copy of end Point and convert to Point
    let featureCopy = JSON.parse(JSON.stringify(trafficSignalLines[i]));
    featureCopy.geometry.type = 'Point';
    featureCopy.geometry.coordinates = featureCopy.geometry.coordinates.slice(
      -1
    )[0];
    dataBiType.features.push(featureCopy);
    // Convert start to Point
    trafficSignalLines[i].geometry.type = 'Point';
    trafficSignalLines[i].geometry.coordinates =
      trafficSignalLines[i].geometry.coordinates[0];
  }
  return dataBiType;
}

/**
 * addAttributes takes every Feature from the FeatureCollection, selects specific
 * OSM properties and writes them to a attributes array of single objecst
 * @param FeatureCollection
 * @return FeatureCollection
 */
export function addAttributes(dataBiType: any) {
  const arrayLength = dataBiType.features.length;
  for (var i = 0; i < arrayLength; i++) {
    let properties = dataBiType.features[i].properties;
    let keys = Object.keys(properties);
    let attributesFeature = Array();

    // Add parking attributes (https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dbicycle_parking)
    if (properties.bike_infrastructure_type === 'parking') {
      // Name
      if (properties.name) {
        attributesFeature.push({ Name: properties.name });
      }
      // Capacity
      if (properties.capacity) {
        attributesFeature.push({ Kapazität: properties.capacity });
      }
      if (!properties.capacity) {
        attributesFeature.push({ Kapazität: 'unknown' });
      }

      // Parking type + weather protection + theft protection
      if (properties.bicycle_parking) {
        attributesFeature.push({ Typ: properties.bicycle_parking });
        if (
          ['shed', 'lockers', 'building'].includes(properties.bicycle_parking)
        ) {
          if (!keys.includes('surveillance')) {
            attributesFeature.push({ Diebstahlsicher: 'yes' });
          }
          if (!keys.includes('covered')) {
            attributesFeature.push({ Wettergeschützt: 'yes' });
          }
        }
        if (
          !['shed', 'lockers', 'building'].includes(properties.bicycle_parking)
        ) {
          if (!keys.includes('surveillance')) {
            attributesFeature.push({ Diebstahlsicher: 'unknown' });
          }
          if (!keys.includes('covered')) {
            attributesFeature.push({ Wettergeschützt: 'unknown' });
          }
        }
      } else {
        attributesFeature.push({ Typ: 'unknown' });
      }
      // Theft protection
      if (properties.surveillance) {
        attributesFeature.push({ Diebstahlsicher: properties.surveillance });
      }
      if (!properties.surveillance && !properties.bicycle_parking) {
        attributesFeature.push({ Diebstahlsicher: 'unknown' });
      }
      // Weather protection
      if (properties.covered) {
        attributesFeature.push({ Wettergeschützt: properties.covered });
      }
      if (!properties.covered && !properties.bicycle_parking) {
        attributesFeature.push({ Wettergeschützt: 'unknown' });
      }
      // Access
      if (properties.access) {
        attributesFeature.push({ Zugang: properties.access });
      }
      // Fee
      if (properties.fee) {
        attributesFeature.push({ Gebühren: properties.fee });
      }
      // Add any provided service
      const service = (subkey: any) => subkey.includes('service');
      if (keys.some(service)) {
        let serviceKeys = Array();
        keys.forEach(function (subkey) {
          if (subkey.includes('service') && properties[subkey] === 'yes') {
            serviceKeys.push(subkey.split(':')[2]);
          }
        });
        if (serviceKeys.length > 1) {
          attributesFeature.push({ Service: serviceKeys.join(', ') });
        }
        if (serviceKeys.length === 1) {
          attributesFeature.push({ Service: serviceKeys[0] });
        }
      }
      // Add attributes
      dataBiType.features[i].properties.attributes = attributesFeature;
      continue;
    }

    // Add charging station attributes (https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dcharging_station)
    if (properties.bike_infrastructure_type === 'charging_station') {
      if (properties.operator) {
        attributesFeature.push({ Anbieter: properties.operator });
      }
      // Add pure capacity
      if (properties.capacity) {
        attributesFeature.push({ Gesamtkapazität: properties.capacity });
      }
      // Add socket type
      const socket = (subkey: any) => subkey.includes('socket');
      if (keys.some(socket)) {
        keys.forEach(function (subkey) {
          if (subkey.includes('socket')) {
            // only get socket:type (and not further :description)
            if (subkey.split(':').length - 1 === 1) {
              attributesFeature.push({ [subkey]: properties[subkey] });
            }
          }
        });
      }
      // Add charge or fee
      if (properties.charge) {
        attributesFeature.push({ Kosten: properties.charge });
      } else if (properties.fee) {
        attributesFeature.push({ Kosten: properties.fee });
      }
      // Add payment information
      const payment = (subkey: any) => subkey.includes('payment');
      if (keys.some(payment)) {
        let paymentKeys = Array();
        keys.forEach(function (subkey) {
          if (subkey.includes('payment') && properties[subkey] === 'yes') {
            paymentKeys.push(subkey.split(':')[1]);
          }
        });
        if (paymentKeys.length > 1) {
          attributesFeature.push({ Zahlungsart: paymentKeys.join(', ') });
        }
        if (paymentKeys.length === 1) {
          attributesFeature.push({ Zahlungsart: paymentKeys[0] });
        }
      }
      // Add opening hours
      if (properties.opening_hours) {
        attributesFeature.push({ Öffnungszeiten: properties.opening_hours });
      }
      // Add description
      if (properties.description) {
        attributesFeature.push({ Info: properties.description });
      }
      if (properties.note) {
        attributesFeature.push({ Info: properties.note });
      }
      // Add attributes
      dataBiType.features[i].properties.attributes = attributesFeature;
      continue;
    }

    // Add attributes for bicycle_repair_station (https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dbicycle_repair_station)
    if (properties.bike_infrastructure_type === 'bicycle_repair_station') {
      // Add pump information
      if (properties['service:bicycle:pump']) {
        if (properties['service:bicycle:pump'] === 'yes') {
          attributesFeature.push({ Luftpumpe: 'Ja' });
        }
      }
      // Add tools information
      if (
        properties['service:bicycle:tools'] &&
        !properties['service:bicycle:chain_tool']
      ) {
        if (properties['service:bicycle:tools'] === 'yes') {
          attributesFeature.push({ Werkzeug: 'Ja' });
        }
      }
      if (
        properties['service:bicycle:tools'] &&
        properties['service:bicycle:chain_tool']
      ) {
        if (
          properties['service:bicycle:tools'] === 'yes' &&
          properties['service:bicycle:chain_tool'] === 'yes'
        ) {
          attributesFeature.push({ Werkzeug: 'Ja, inklusive Kettenwerkzeug' });
        }
        if (
          properties['service:bicycle:tools'] === 'no' &&
          properties['service:bicycle:chain_tool'] === 'yes'
        ) {
          attributesFeature.push({ Werkzeug: 'Nur Kettenwerkzeug' });
        }
      }
      if (
        !properties['service:bicycle:tools'] &&
        properties['service:bicycle:chain_tool']
      ) {
        if (properties['service:bicycle:chain_tool'] === 'yes') {
          attributesFeature.push({ Werkzeug: 'Nur Kettenwerkzeug' });
        }
      }
      // Add opening hours
      if (properties.opening_hours) {
        attributesFeature.push({ Öffnungszeiten: properties.opening_hours });
      }
      // Add description
      if (properties.description) {
        attributesFeature.push({ Info: properties.description });
      }
      if (properties.note) {
        attributesFeature.push({ Info: properties.note });
      }
      // Add attributes
      dataBiType.features[i].properties.attributes = attributesFeature;
      continue;
    }
    // Add attributes for tube vending machines (https://wiki.openstreetmap.org/wiki/Tag:vending%3Dbicycle_tube)
    if (properties.bike_infrastructure_type === 'tube_vending_machine') {
      // Add brand information
      if (properties.brand) {
        attributesFeature.push({ Marke: properties.brand });
      }
      // Add payment information
      const payment = (subkey: any) => subkey.includes('payment');
      if (keys.some(payment)) {
        let paymentKeys = Array();
        keys.forEach(function (subkey) {
          if (subkey.includes('payment') && properties[subkey] === 'yes') {
            paymentKeys.push(subkey.split(':')[1]);
          }
        });
        if (paymentKeys.length > 1) {
          attributesFeature.push({ Zahlungsart: paymentKeys.join(', ') });
        }
        if (paymentKeys.length === 1) {
          attributesFeature.push({ Zahlungsart: paymentKeys[0] });
        }
      }
      // Add attributes
      dataBiType.features[i].properties.attributes = attributesFeature;
      continue;
    }
    // Add attributes for bicycle shops (https://wiki.openstreetmap.org/wiki/Tag:shop%3Dbicycle)
    if (properties.bike_infrastructure_type === 'bicycle_shop') {
      // Add name information
      if (properties.name) {
        attributesFeature.push({ Name: properties.name });
      }
      // Add service information on retail, repair, diy
      if (properties['service:bicycle:retail']) {
        attributesFeature.push({
          Verkauf: properties['service:bicycle:retail'],
        });
      } else {
        attributesFeature.push({ Verkauf: 'Unbekannt' });
      }
      if (properties['service:bicycle:repair']) {
        attributesFeature.push({
          Reparatur: properties['service:bicycle:repair'],
        });
      } else {
        attributesFeature.push({ Reparatur: 'Unbekannt' });
      }
      if (properties['service:bicycle:diy']) {
        attributesFeature.push({
          DIY: properties['service:bicycle:diy'],
        });
      } else {
        attributesFeature.push({ DIY: 'unknown' });
      }
      // Add other services
      const service = (subkey: any) => subkey.includes('service');
      let serviceKeys = Array();
      if (keys.some(service)) {
        keys.forEach(function (subkey) {
          if (
            subkey.includes('service') &&
            properties[subkey] === 'yes' &&
            !['repair', 'retail', 'diy'].includes(subkey.split(':')[2])
          ) {
            serviceKeys.push(subkey.split(':')[2]);
          }
        });
      }
      if (serviceKeys.length > 1) {
        attributesFeature.push({
          'Weiterer Service': serviceKeys.join(', '),
        });
      } else if (serviceKeys.length === 1) {
        attributesFeature.push({ 'Weiterer Service': serviceKeys[0] });
      } else if (serviceKeys.length === 0) {
        attributesFeature.push({ 'Weiterer Service': 'Keine' });
      }
      // Add opening hours
      if (properties.opening_hours) {
        attributesFeature.push({ Öffnungszeiten: properties.opening_hours });
      }
      // Add attributes
      dataBiType.features[i].properties.attributes = attributesFeature;
      continue;
    }
    // Add attributes for bicycle rentals (https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dbicycle_rental)
    if (properties.bike_infrastructure_type === 'bicycle_rental') {
      // Add name information
      if (properties.name) {
        attributesFeature.push({ Name: properties.name });
      }
      // Add bicycle type
      if (properties.rental) {
        attributesFeature.push({ Radtyp: properties.rental });
      } else {
        attributesFeature.push({ Radtyp: 'Stadtrad' });
      }
      // Add brand information
      if (properties.brand) {
        attributesFeature.push({ Marke: properties.brand });
      }
      // Add rental type
      if (properties.bicycle_rental) {
        attributesFeature.push({ Verleihtyp: properties.bicycle_rental });
      }
      // Add network type
      if (properties.network) {
        attributesFeature.push({ Verleihnetz: properties.network });
      }
      // Add capacity
      if (properties.capacity) {
        attributesFeature.push({ Kapaität: properties.capacity });
      }
      // Add payment information
      const payment = (subkey: any) => subkey.includes('payment');
      if (keys.some(payment)) {
        let paymentKeys = Array();
        keys.forEach(function (subkey) {
          if (subkey.includes('payment') && properties[subkey] === 'yes') {
            paymentKeys.push(subkey.split(':')[1]);
          }
        });
        if (paymentKeys.length > 1) {
          attributesFeature.push({ Zahlungsart: paymentKeys.join(', ') });
        }
        if (paymentKeys.length === 1) {
          attributesFeature.push({ Zahlungsart: paymentKeys[0] });
        }
      }
      // Add opening hours
      if (properties.opening_hours) {
        attributesFeature.push({ Öffnungszeiten: properties.opening_hours });
      }
      // Add attributes
      dataBiType.features[i].properties.attributes = attributesFeature;
      continue;
    }
    // Add attributes for cycle lane, seperated cycle lane, and mixed path (https://wiki.openstreetmap.org/wiki/Bicycle)
    if (
      ['cycle_lane', 'separated_cycle_lane', 'mixed_path'].includes(
        properties.bike_infrastructure_type
      )
    ) {
      // Add surface information
      if (properties.surface) {
        attributesFeature.push({ Oberfläche: properties.surface });
      }
      // Add pedestrian information
      // if (properties.foot) {
      //   attributesFeature.push({ Fußgänger: properties.foot });
      // }
      // Add attributes
      dataBiType.features[i].properties.attributes = attributesFeature;
      continue;
    }
    // Add attributes for traffic calming
    if (properties.bike_infrastructure_type === 'traffic_calming') {
      // Add maxspeed information (https://wiki.openstreetmap.org/wiki/Key:source:maxspeed)
      if (properties.maxspeed) {
        attributesFeature.push({ 'Tempo-Limit': properties.maxspeed });
      }
      // Add surface information
      if (properties.surface) {
        attributesFeature.push({ Oberfläche: properties.surface });
      }
      //Add road element information (https://wiki.openstreetmap.org/wiki/Key:traffic_calming)
      if (properties.traffic_calming) {
        attributesFeature.push({ Element: properties.traffic_calming });
      }
      // Add attributes
      dataBiType.features[i].properties.attributes = attributesFeature;
      continue;
    }
    // Add attributes for train stations
    if (properties.bike_infrastructure_type === 'train_station') {
      // Add name information
      if (properties.name) {
        attributesFeature.push({ Name: properties.name });
      }
      // Add attributes
      dataBiType.features[i].properties.attributes = attributesFeature;
      continue;
    }
    // Add attributes for cycling streets
    if (properties.bike_infrastructure_type === 'cycling_street') {
      // Add name information
      if (properties.name) {
        attributesFeature.push({ Name: properties.name });
      }
      // Add maxspeed information
      if (properties.maxspeed) {
        attributesFeature.push({ 'Tempo-Limit': properties.maxspeed });
      }
      // Add surface information
      if (properties.surface) {
        attributesFeature.push({ Oberfläche: properties.surface });
      }
      // Add oneway exception information
      if (properties?.oneway === 'yes' && properties['oneway:bicycle']) {
        if (properties['oneway_bicycle'] === 'no') {
          attributesFeature.push({ 'Einbahnstraßen-Ausnahme': 'Ja' });
        }
      }
      // Add attributes
      dataBiType.features[i].properties.attributes = attributesFeature;
      continue;
    }
  }
  return dataBiType;
}

/**
 * clipLineFeatureCollectionbyAa takes a FeatureCollection containing LineStrings or
 * MultiLineStrings and clips it to the administrative Area
 * @param FeatureCollectionLine, AdministrativeArea
 * @param FeatureCollectionClipped
 */
function clipLineFeatureCollectionbyAa(
  FeatureCollectionLine: any,
  AdministrativeArea: any
) {
  let FeatureCollectionClipped = Array();
  featureEach(FeatureCollectionLine, (line: any) => {
    // Flatten MultiLineStrings first
    let flattenLines = flatten(line);
    featureEach(flattenLines, (singleLine: any) => {
      // Check if the line feature is fully within the clip area. If it is, add it to linesArray.
      if (booleanWithin(singleLine, AdministrativeArea)) {
        FeatureCollectionClipped.push(singleLine);
      } else {
        // If the feature is not fully within the clip area, split the line by the clip area
        let splitResults = lineSplit(singleLine, AdministrativeArea);
        // Take the resulting features from the split, calculate a point on surface, and check if the point is within the clip area. If it is, add the line segment to linesArray.
        featureEach(splitResults, (splitResult) => {
          let pof = pointOnFeature(splitResult);
          if (booleanWithin(pof, AdministrativeArea)) {
            FeatureCollectionClipped.push(splitResult);
          }
        });
      }
    });
  });
  return featureCollection(FeatureCollectionClipped);
}

/**
 * appendNWtoBI appends the network data to the BiType FeatureCollection with
 * cycling_network as its bike_infrastructure_type
 * @param FeatureCollection
 * @return FeatureCollection
 */
export function appendNWtoBI(dataNw: any, dataBiType: any) {
  const arrayLength = dataNw.features.length;
  for (var i = 0; i < arrayLength; i++) {
    let feature = dataNw.features[i];
    feature.properties.bike_infrastructure_type = 'cycling_network';
    dataBiType.features.push(feature);
  }
  return dataBiType;
}

/**
 * appendAdminAreatoBI appends the administrative areas to the BiType
 * FeatureCollection with admin_area as its bike_infrastructure_type
 * @param FeatureCollection
 * @return FeatureCollection
 */
export function appendAdminAreatoBI(dataAa: any, dataBiType: any) {
  const adminAreas = dataAa.features.filter(
    (feature: any) =>
      feature.geometry.type === 'Polygon' ||
      feature.geometry.type === 'MultiPolygon'
  );
  const arrayLength = adminAreas.length;
  for (var i = 0; i < arrayLength; i++) {
    let feature = adminAreas[i];
    feature.properties.bike_infrastructure_type = 'admin_area';
    dataBiType.features.push(feature);
  }
  return dataBiType;
}

/**
 * aggregateBiAdminArea aggregates bike infrastructure data within each
 * administrative Area regarding parking, cycling, and services
 * @param FeatureCollection
 * @return FeatureCollection
 */
export function aggregateBiAdminArea(dataAa: any, dataBiType: any) {
  const adminAreas = dataAa.features.filter(
    (feature: any) =>
      feature.geometry.type === 'Polygon' ||
      feature.geometry.type === 'MultiPolygon'
  );

  // Loop through the adminAreas
  const arrayLength = adminAreas.length;
  console.log('AdminAreas', arrayLength);
  for (var i = 0; i < arrayLength; i++) {
    let singleAa = adminAreas[i];

    // PARKING DATA
    //--------------
    // Select parking points within adminArea
    adminAreas[i].properties.parking = {};
    let parkingWithin = dataBiType.features.filter(
      (feature: any) =>
        feature.properties.bike_infrastructure_type === 'parking' &&
        feature.geometry.type === 'Point' &&
        booleanWithin(feature, singleAa)
    );
    // Count frequency of parking points
    adminAreas[i].properties.parking.freqObjects = parkingWithin.length;

    // Initialise sum of stands
    let sumStands = Number();

    // Initialise types of parking
    let parkingTypes = Array();

    parkingWithin.forEach((parkingPoint: any) => {
      // Find indices for capacity
      const containsCapacity = (attributePair: any) =>
        Object.keys(attributePair).includes('Kapazität');
      let indexCapacity = parkingPoint.properties.attributes.findIndex(
        containsCapacity
      );
      // Convert capacity string to integer or unknown and count sum of stands
      parkingPoint.properties.attributes[indexCapacity]['Kapazität'] = parseInt(
        parkingPoint.properties.attributes[indexCapacity]['Kapazität']
      );
      if (
        isNaN(parkingPoint.properties.attributes[indexCapacity]['Kapazität'])
      ) {
        parkingPoint.properties.attributes[indexCapacity]['Kapazität'] =
          'unknown';
      } else {
        sumStands +=
          parkingPoint.properties.attributes[indexCapacity]['Kapazität'];
      }
      // Find index of parking type
      const containsType = (attributePair: any) =>
        Object.keys(attributePair).includes('Typ');
      let indexType = parkingPoint.properties.attributes.findIndex(
        containsType
      );
      // Append unique types to parkingTypes
      let type = parkingPoint.properties.attributes[indexType]['Typ'];
      if (!parkingTypes.includes(type)) {
        parkingTypes.push(type);
      }
    });
    // Initialise capacity object
    adminAreas[i].properties.parking.capacity = {};

    // Add sum of stands
    adminAreas[i].properties.parking.capacity.sumStands = sumStands;

    // Count frequency of parking points with unknown capacity
    let freqUnknownCapacity = parkingWithin.filter((feature: any) => {
      const containsCapacity = (attributePair: any) =>
        Object.keys(attributePair).includes('Kapazität');
      let indexCapacity = feature.properties.attributes.findIndex(
        containsCapacity
      );
      return (
        feature.properties.attributes[indexCapacity]['Kapazität'] === 'unknown'
      );
    }).length;
    adminAreas[i].properties.parking.capacity.freqUnknown = freqUnknownCapacity;

    // Count frequency of parking points with known capacity
    let freqKnownCapacity = parkingWithin.filter((feature: any) => {
      const containsCapacity = (attributePair: any) =>
        Object.keys(attributePair).includes('Kapazität');
      let indexCapacity = feature.properties.attributes.findIndex(
        containsCapacity
      );
      return !isNaN(feature.properties.attributes[indexCapacity]['Kapazität']);
    }).length;
    adminAreas[i].properties.parking.capacity.freqKnown = freqKnownCapacity;

    // Initialise type object
    adminAreas[i].properties.parking.type = {};

    // Count parking objects for each parking type
    parkingTypes.forEach((type: any) => {
      let freqType = parkingWithin.filter((feature: any) => {
        const containsType = (attributePair: any) =>
          Object.keys(attributePair).includes('Typ');
        let indexType = feature.properties.attributes.findIndex(containsType);
        return feature.properties.attributes[indexType]['Typ'] === type;
      }).length;
      adminAreas[i].properties.parking.type[type] = freqType;
    });

    // Initialise weather object
    adminAreas[i].properties.parking.weather = {};

    // Count frequency of parking points with unknown weather protection
    let freqUnknownWeather = parkingWithin.filter((feature: any) => {
      const containsWeather = (attributePair: any) =>
        Object.keys(attributePair).includes('Wettergeschützt');
      let indexWeather = feature.properties.attributes.findIndex(
        containsWeather
      );
      return (
        feature.properties.attributes[indexWeather]['Wettergeschützt'] ===
        'unknown'
      );
    }).length;
    adminAreas[i].properties.parking.weather.freqUnknown = freqUnknownWeather;

    // Count frequency of parking points with weather protection
    let freqYesWeather = parkingWithin.filter((feature: any) => {
      const containsWeather = (attributePair: any) =>
        Object.keys(attributePair).includes('Wettergeschützt');
      let indexWeather = feature.properties.attributes.findIndex(
        containsWeather
      );
      return (
        feature.properties.attributes[indexWeather]['Wettergeschützt'] === 'yes'
      );
    }).length;
    adminAreas[i].properties.parking.weather.freqYes = freqYesWeather;

    // Count frequency of parking points without weather protection
    let freqNoWeather = parkingWithin.filter((feature: any) => {
      const containsWeather = (attributePair: any) =>
        Object.keys(attributePair).includes('Wettergeschützt');
      let indexWeather = feature.properties.attributes.findIndex(
        containsWeather
      );
      return (
        feature.properties.attributes[indexWeather]['Wettergeschützt'] === 'no'
      );
    }).length;
    adminAreas[i].properties.parking.weather.freqNo = freqNoWeather;

    // Initialise theftprotection object
    adminAreas[i].properties.parking.theft = {};

    // Count frequency of parking points with unknown weather protection
    let freqUnknownTheft = parkingWithin.filter((feature: any) => {
      const containsTheft = (attributePair: any) =>
        Object.keys(attributePair).includes('Diebstahlsicher');
      let indexTheft = feature.properties.attributes.findIndex(containsTheft);
      return (
        feature.properties.attributes[indexTheft]['Diebstahlsicher'] ===
        'unknown'
      );
    }).length;
    adminAreas[i].properties.parking.theft.freqUnknown = freqUnknownTheft;

    // Count frequency of parking points with weather protection
    let freqYesTheft = parkingWithin.filter((feature: any) => {
      const containsTheft = (attributePair: any) =>
        Object.keys(attributePair).includes('Diebstahlsicher');
      let indexTheft = feature.properties.attributes.findIndex(containsTheft);
      return (
        feature.properties.attributes[indexTheft]['Diebstahlsicher'] === 'yes'
      );
    }).length;
    adminAreas[i].properties.parking.theft.freqYes = freqYesTheft;

    // Count frequency of parking points without weather protection
    let freqNoTheft = parkingWithin.filter((feature: any) => {
      const containsTheft = (attributePair: any) =>
        Object.keys(attributePair).includes('Diebstahlsicher');
      let indexTheft = feature.properties.attributes.findIndex(containsTheft);
      return (
        feature.properties.attributes[indexTheft]['Diebstahlsicher'] === 'no'
      );
    }).length;
    adminAreas[i].properties.parking.theft.freqNo = freqNoTheft;

    // CYCLING
    //--------
    adminAreas[i].properties.cycling = {};
    // Find all requested cylcingLines
    // let linesCycling = dataBiType.features.filter(
    //   (feature: any) =>
    //     (feature.properties.bike_infrastructure_type === 'cycling_street' ||
    //       feature.properties.bike_infrastructure_type === 'traffic_calming' ||
    //       feature.properties.bike_infrastructure_type === 'cycling_network' ||
    //       feature.properties.bike_infrastructure_type === 'cycle_lane' ||
    //       feature.properties.bike_infrastructure_type ===
    //         'separated_cycle_lane') &&
    //     (feature.geometry.type === 'LineString' ||
    //       feature.geometry.type === 'MultiLineString')
    // );
    // linesCycling = featureCollection(linesCycling);
    // console.log('LinesCycling', linesCycling);

    // Clip all cylcing lines to the Administrative Area
    // let linesCyclingWithin = clipLineFeatureCollectionbyAa(
    //   linesCycling,
    //   singleAa
    // );
    // console.log('LinesWithin', linesCyclingWithin);

    // Filter cycling streets
    let cyclingStreets = dataBiType.features.filter(
      (feature: any) =>
        feature.properties.bike_infrastructure_type === 'cycling_street' &&
        feature.properties?.name !== 'Promenade'
    );
    let cyclingStreetsWithin = clipLineFeatureCollectionbyAa(
      featureCollection(cyclingStreets),
      singleAa
    );
    console.log(cyclingStreetsWithin);

    // // adminAreas[i].properties.cycling.cyclingstreets = {};
    // // // Calculate total length of cycling streets
    // // adminAreas[i].properties.cycling.cyclingstreets.lengthTotal = Math.round(
    // //   geomlength(cyclingStreetsWithin, { units: 'meters' })
    // // );

    // // Test logging
    console.log(singleAa.properties.name, singleAa);

    // Push admin_area to dataBiType
    adminAreas[i].properties.bike_infrastructure_type = 'admin_area';
    dataBiType.features.push(singleAa);
  }
  return dataBiType;
}
