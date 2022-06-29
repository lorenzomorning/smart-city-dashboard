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
import { useSelector, RootStateOrAny } from 'react-redux';
import { GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import {
  ChargingIcon,
  ShopIcon,
  ParkingIcon,
  RepairIcon,
  RentalIcon,
  TubeIcon,
  SignalIcon,
  WayfindingIcon,
  TrainstationIcon,
} from '../Icons';

import BiMarkerIcon from './BicycleInfrastructure/BiMarkerIcon';
import BiMarker from './BicycleInfrastructure/BiMarker';
import { createClusterCustomIconBlue } from './BicycleInfrastructure/ClusterMarkerIcons';
import { createClusterCustomIconGreen } from './BicycleInfrastructure/ClusterMarkerIcons';
import { addInfo } from './BicycleInfrastructure/PopupAddInfo';

const BicycleInfrastructure = () => {
  const BicycleInfrastructureData = useSelector(
    (state: RootStateOrAny) => state.bicycleinfrastructure.data // array of features []
  );

  // Filter and style mixed paths polygons
  const parkingPolygons = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'parking' &&
      feature.geometry.type === 'Polygon'
  );
  let parkingPolygonsPathOptions = {
    color: '#203864',
  };

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
      popupAnchor: [-3, -11],
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
      popupAnchor: [-3, -11],
    });
    return L.marker(latlng, { icon: shopIcon });
  }

  // Filter and style parking
  const parking = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'parking' &&
      feature.geometry.type === 'Point'
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
      popupAnchor: [-3, -11],
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
      popupAnchor: [-3, -11],
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
      popupAnchor: [-3, -11],
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
      popupAnchor: [-3, -11],
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
        <BiMarker icon={<SignalIcon stroke="#000000" />}></BiMarker>
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    return L.marker(latlng, { icon: signalIcon });
  }

  // Filter and style wayfinding signs
  const wayfindingSigns = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'wayfinding'
  );
  function pointWayfinding(geojsonPoint: any, latlng: any) {
    let wayfindingIcon = L.divIcon({
      className: '',
      html: renderToStaticMarkup(
        <BiMarker
          icon={<WayfindingIcon stroke="#000000" fill="#ffc000" />}
        ></BiMarker>
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    return L.marker(latlng, { icon: wayfindingIcon });
  }

  // Filter and style train station
  const trainStations = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'train_station'
  );
  function pointTrain(geojsonPoint: any, latlng: any) {
    let trainIcon = L.divIcon({
      className: '',
      html: renderToStaticMarkup(
        <BiMarkerIcon
          color="#FF0000"
          icon={<TrainstationIcon fill="#FFF3F3" />}
        ></BiMarkerIcon>
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [-3, -11],
    });
    return L.marker(latlng, { icon: trainIcon });
  }

  return (
    <>
      <GeoJSON
        data={networkLines}
        style={networkPathOptions}
        key={'networkLines'}
      />
      <GeoJSON
        data={mixedPathPolygons}
        style={mixedPathPolygonsPathOptions}
        key={'mixedPathPolygons'}
        onEachFeature={addInfo}
      />
      <GeoJSON
        data={parkingPolygons}
        style={parkingPolygonsPathOptions}
        key={'parkingPolygons'}
        onEachFeature={addInfo}
      />
      <GeoJSON
        data={trafficCalming}
        style={trafficCalmingPathOptions}
        key={'trafficCalming'}
        onEachFeature={addInfo}
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
        onEachFeature={addInfo}
      />
      <GeoJSON
        data={cycleLanes}
        style={cycleLanesPathOptions}
        key={'cycleLanes'}
        onEachFeature={addInfo}
      />
      <GeoJSON
        data={sepCycleLanes}
        style={sepCycleLanesPathOptions}
        key={'sepCycleLanes'}
        onEachFeature={addInfo}
      />
      <GeoJSON
        data={cyclingStreets}
        style={cyclingstreetPathOptions}
        key={'cyclingStreets'}
        onEachFeature={addInfo}
      />
      <GeoJSON
        data={trafficSignals}
        pointToLayer={pointSignal}
        key={'trafficSignals'}
      />
      <GeoJSON
        data={wayfindingSigns}
        pointToLayer={pointWayfinding}
        key={'wayfindingSigns'}
      />
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
          onEachFeature={addInfo}
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
          onEachFeature={addInfo}
        ></GeoJSON>
      </MarkerClusterGroup>
      <GeoJSON
        data={chargingStations}
        pointToLayer={pointCharging}
        key={'chargingStations'}
        onEachFeature={addInfo}
      />
      <GeoJSON
        data={repairStations}
        pointToLayer={pointRepair}
        key={'repairStations'}
        onEachFeature={addInfo}
      />
      <GeoJSON
        data={rentals}
        pointToLayer={pointRental}
        key={'rentals'}
        onEachFeature={addInfo}
      />
      <GeoJSON
        data={tubeVendings}
        pointToLayer={pointTube}
        key={'tubeVendings'}
        onEachFeature={addInfo}
      />
      <GeoJSON
        data={trainStations}
        pointToLayer={pointTrain}
        key={'trainStations'}
        onEachFeature={addInfo}
      />
    </>
  );
};

export default BicycleInfrastructure;
