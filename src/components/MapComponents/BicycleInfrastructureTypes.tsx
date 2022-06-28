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

import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useSelector, RootStateOrAny } from 'react-redux';
import { PopupContent } from './styles';
import styled from 'styled-components';

import {
  ChargingIcon,
  ShopIcon,
  ParkingIcon,
  RepairIcon,
  RentalIcon,
  TubeIcon,
  SignalIcon,
} from '../Icons';
import BiMarkerIcon from './BiMarkerIcon';
import BiMarker from './BiMarker';
import { Marker } from 'react-leaflet';

// Create customized markercluster group
const DefaultMapMarker = styled.div<{
  colorbg: string;
  color: string;
  size: string;
  font: string;
}>`
  background-color: ${(props) => props.colorbg};
  font-size: ${(props) => props.font}rem;
  border-radius: 50%;
  border: 1px solid white;
  width: ${(props) => props.size}rem;
  height: ${(props) => props.size}rem;
  color: ${(props) => props.color};
  box-shadow: var(--scms-box-shadow);
  font-weight: var(--scms-semi-bold);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const createClusterCustomIconGreen = function (cluster: any) {
  let count = cluster.getChildCount();
  if (count < 10) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker
          color="#E2F0D9"
          colorbg="#385723"
          size="1.5"
          font="0.9"
        >
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  } else if (count >= 10 && count < 50) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker color="#E2F0D9" colorbg="#385723" size="2" font="1.1">
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  } else if (count >= 50) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker
          color="#E2F0D9"
          colorbg="#385723"
          size="2.5"
          font="1.5"
        >
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  }
};
const createClusterCustomIconBlue = function (cluster: any) {
  let count = cluster.getChildCount();
  if (count < 10) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker
          color="#DEEBF7"
          colorbg="#203864"
          size="1.5"
          font="0.9"
        >
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  } else if (count >= 10 && count < 50) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker color="#DEEBF7" colorbg="#203864" size="2" font="1">
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  } else if (count >= 50) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker
          color="#DEEBF7"
          colorbg="#203864"
          size="2.5"
          font="1.25"
        >
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  }
};

const BicycleInfrastructure = () => {
  const BicycleInfrastructureData = useSelector(
    (state: RootStateOrAny) => state.bicycleinfrastructure.data // array of features []
  );

  // Function add info automatically creates a table for the popoup with the entries from feature.properties.attributes
  function add_info(feature: any, layer: any) {
    let bIType = feature.properties.bike_infrastructure_type;
    if (feature.properties && feature.properties.attributes) {
      let attributes = feature.properties.attributes;
      var html_table =
        "<p style='text-align:center; font-size:150%; font-weight:bold;'> " +
        bIType +
        " </p> <table class='table table-striped'> <tbody>";
      // loop through the dictionary to feed the table with rows
      attributes.forEach((attr: any) => {
        for (let key in attr) {
          let value = attr[key];
          var tr =
            ' <tr> </th> <td> ' + key + ': </td> <td> ' + value + '</td> </tr>';
          html_table = html_table + tr;
        }
      });
      // close the table
      html_table = html_table + ' </tbody> </table>';
      layer.bindPopup(html_table);
    }
  }

  // Filter and style mixed paths polygons
  const mixedPathPolygons = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'mixed_path' &&
      feature.geometry.type === 'Polygon'
  );
  let mixedPathPolygonsPathOptions = {
    color: '#b22f2f',
    weight: 1,
    dashArray: '10 10',
    opacity: 1,
  };

  // Filter and style cycling network
  const networkLines = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'cycling_network'
  );
  let networkPathOptions = {
    color: '#f6ef3c',
    weight: 10,
    opacity: 0.5,
  };

  // Filter and style traffic calming
  const trafficCalming = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'traffic_calming' &&
      feature.geometry.type !== 'Point'
  );
  let trafficCalmingPathOptions = {
    color: '#08A99C',
    weight: 2.5,
    opacity: 0.4,
  };

  // Filter and style oneway exceptions
  const oneWayExceptions = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'oneway_exception'
  );
  let oneWayExceptionsPathOptions = {
    color: '#8429b1',
    weight: 2,
    opacity: 0.5,
    dashArray: '6 8',
  };

  // Filter and style mixed paths lines
  const mixedPathLines = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'mixed_path' &&
      feature.geometry.type === 'LineString'
  );
  let mixedPathLinesPathOptions = {
    color: '#b22f2f',
    weight: 1.5,
    opacity: 0.5,
  };

  // Filter and style cycle lanes
  const cycleLanes = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'cycle_lane'
  );
  let cycleLanesPathOptions = {
    color: '#ff791c',
    weight: 2,
    opacity: 1,
    dashArray: '6 8',
  };

  // Filter and style separated cycle lanes
  const sepCycleLanes = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'separated_cycle_lane' &&
      feature.geometry.type === 'LineString'
  );
  let sepCycleLanesPathOptions = {
    color: '#f8b000',
    weight: 2,
    opacity: 1,
  };

  // Filter and style cycling streets
  const cyclingStreets = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'cycling_street'
  );
  let cyclingstreetPathOptions = {
    color: '#319621',
    weight: 3,
    opacity: 1,
  };

  // Filter and style charging stations
  const chargingStations = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'charging_station'
  );
  function pointCharging(geojsonPoint: any, latlng: any) {
    let chargingIcon = L.divIcon({
      className: '',
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#203864"
          icon={<ChargingIcon fill="#DEEBF7" />}
        ></BiMarkerIcon>
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    return L.marker(latlng, { icon: chargingIcon });
  }

  // Filter and style bicycle shops
  const bicycleShops = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'bicycle_shop'
  );
  function pointShop(geojsonPoint: any, latlng: any) {
    let shopIcon = L.divIcon({
      className: '',
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#385723"
          icon={<ShopIcon fill="#E2F0D9" />}
        ></BiMarkerIcon>
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    return L.marker(latlng, { icon: shopIcon });
  }

  // Filter and style parking
  const parking = BicycleInfrastructureData.features.filter(
    (feature: any) => feature.properties.bike_infrastructure_type === 'parking'
  );
  function pointParking(geojsonPoint: any, latlng: any) {
    let parkingIcon = L.divIcon({
      className: '',
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#203864"
          icon={<ParkingIcon fill="#DEEBF7" />}
        ></BiMarkerIcon>
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    return L.marker(latlng, { icon: parkingIcon });
  }

  // Filter and style repair stations
  const repairStations = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'bicycle_repair_station'
  );
  function pointRepair(geojsonPoint: any, latlng: any) {
    let repairIcon = L.divIcon({
      className: '',
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#385723"
          icon={<RepairIcon fill="#E2F0D9" />}
        ></BiMarkerIcon>
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    return L.marker(latlng, { icon: repairIcon });
  }

  // Filter and style rentals
  const rentals = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'bicycle_rental'
  );
  function pointRental(geojsonPoint: any, latlng: any) {
    let rentalIcon = L.divIcon({
      className: '',
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#385723"
          icon={<RentalIcon fill="#E2F0D9" />}
        ></BiMarkerIcon>
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    return L.marker(latlng, { icon: rentalIcon });
  }

  // Filter and style tube vending
  const tubeVendings = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'tube_vending_machine'
  );
  function pointTube(geojsonPoint: any, latlng: any) {
    let tubeIcon = L.divIcon({
      className: '',
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#385723"
          icon={<TubeIcon fill="#E2F0D9" />}
        ></BiMarkerIcon>
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    return L.marker(latlng, { icon: tubeIcon });
  }

  // Filter and style traffic signals
  const trafficSignals = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'traffic_signal'
  );
  function pointSignal(geojsonPoint: any, latlng: any) {
    let signalIcon = L.divIcon({
      className: '',
      html: renderToStaticMarkup(
        <BiMarker
          icon={<SignalIcon stroke="#000000" fill="#000000" />}
        ></BiMarker>
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    return L.marker(latlng, { icon: signalIcon });
  }

  // Wayfinding

  // Train Station

  return (
    <>
      <GeoJSON
        data={mixedPathPolygons}
        style={mixedPathPolygonsPathOptions}
        key={'mixedPathPolygons'}
        onEachFeature={add_info}
      />

      <GeoJSON
        data={networkLines}
        style={networkPathOptions}
        key={'networkLines'}
      />

      <GeoJSON
        data={trafficCalming}
        style={trafficCalmingPathOptions}
        key={'trafficCalming'}
        onEachFeature={add_info}
      />

      <GeoJSON
        data={oneWayExceptions}
        style={oneWayExceptionsPathOptions}
        key={'onewayExceptions'}
      />

      <GeoJSON
        data={mixedPathLines}
        style={mixedPathLinesPathOptions}
        key={'mixedPathLines'}
        onEachFeature={add_info}
      />

      <GeoJSON
        data={cycleLanes}
        style={cycleLanesPathOptions}
        key={'cycleLanes'}
        onEachFeature={add_info}
      ></GeoJSON>

      <GeoJSON
        data={sepCycleLanes}
        style={sepCycleLanesPathOptions}
        key={'sepCycleLanes'}
        onEachFeature={add_info}
      ></GeoJSON>

      <GeoJSON
        data={cyclingStreets}
        style={cyclingstreetPathOptions}
        key={'cyclingStreets'}
        onEachFeature={add_info}
      ></GeoJSON>

      <GeoJSON
        data={chargingStations}
        pointToLayer={pointCharging}
        key={'chargingStations'}
        onEachFeature={add_info}
      ></GeoJSON>

      <MarkerClusterGroup
        spiderfyDistanceMultiplier={3}
        iconCreateFunction={createClusterCustomIconGreen}
        polygonOptions={{
          color: '#253a18',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.3,
        }}
      >
        <GeoJSON
          data={bicycleShops}
          pointToLayer={pointShop}
          key={'bicycleShops'}
          onEachFeature={add_info}
        ></GeoJSON>
      </MarkerClusterGroup>

      <MarkerClusterGroup
        spiderfyDistanceMultiplier={3}
        iconCreateFunction={createClusterCustomIconBlue}
        polygonOptions={{
          color: '#1c2b46',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.3,
        }}
      >
        <GeoJSON
          data={parking}
          pointToLayer={pointParking}
          key={'parking'}
          onEachFeature={add_info}
        ></GeoJSON>
      </MarkerClusterGroup>

      <GeoJSON
        data={repairStations}
        pointToLayer={pointRepair}
        key={'repairStations'}
        onEachFeature={add_info}
      ></GeoJSON>

      <GeoJSON
        data={rentals}
        pointToLayer={pointRental}
        key={'rentals'}
        onEachFeature={add_info}
      ></GeoJSON>

      <GeoJSON
        data={tubeVendings}
        pointToLayer={pointTube}
        key={'tubeVendings'}
        onEachFeature={add_info}
      ></GeoJSON>

      <GeoJSON
        data={trafficSignals}
        pointToLayer={pointSignal}
        key={'trafficSignalas'}
      ></GeoJSON>
    </>
  );
};

export default BicycleInfrastructure;
