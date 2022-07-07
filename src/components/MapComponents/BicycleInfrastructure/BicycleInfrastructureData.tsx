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
//import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux';
import { FeatureGroup, GeoJSON, Pane, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import LayerControl, { GroupedLayer } from '../LayerControl/LayerControl';

import { updateParkingOverlay } from '../../../actions/globalsettings';

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
} from '../../Icons';

import BiMarkerIcon from './BiMarkerIcon';
import BiMarker from './BiMarker';
import { createClusterCustomIconBlue } from './ClusterMarkerIcons';
import { createClusterCustomIconGreen } from './ClusterMarkerIcons';
import { addInfo } from './PopupAddInfo';
import { PopupContent } from '../styles';

const BicycleInfrastructure = () => {
  const dispatch = useDispatch();

  const BicycleInfrastructureData = useSelector(
    (state: RootStateOrAny) => state.bicycleinfrastructure.data // array of features []
  );

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
      <LayerControl position="bottomright">
        {/* Radverkehrs-Maßnahmen  */}
        <GroupedLayer
          checked
          name="Fahrradstraße 2.0"
          group="Radverkehrs-Maßnahmen"
        >
          {/* The Pane wrapping defines the overlay. The higher the zIndex the upper the layer */}
          <Pane name="cyclingStreets" style={{ zIndex: 508 }}>
            {/* The FeatureGroup wrapping is necessary, as only then all layers are cleared
              when the side bar component for the bicycle infrastructure is unselected */}
            <FeatureGroup>
              <GeoJSON
                data={cyclingStreets}
                style={cyclingstreetPathOptions}
                key={'cyclingStreets'}
                onEachFeature={addInfo}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer checked name="Radweg" group="Radverkehrs-Maßnahmen">
          <Pane name="sepCycleLanes" style={{ zIndex: 506 }}>
            <FeatureGroup>
              <GeoJSON
                data={sepCycleLanes}
                style={sepCycleLanesPathOptions}
                key={'sepCycleLanes'}
                onEachFeature={addInfo}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer checked name="Radspur" group="Radverkehrs-Maßnahmen">
          <Pane name="cycleLanes" style={{ zIndex: 507 }}>
            <FeatureGroup>
              <GeoJSON
                data={cycleLanes}
                style={cycleLanesPathOptions}
                key={'cycleLanes'}
                onEachFeature={addInfo}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer name="Fahrrad-Ampel" group="Radverkehrs-Maßnahmen">
          <Pane name="trafficSignals" style={{ zIndex: 510 }}>
            <FeatureGroup>
              <GeoJSON
                data={trafficSignals}
                pointToLayer={pointSignal}
                key={'trafficSignals'}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>

        {/* Radwege-Netz  */}
        <GroupedLayer checked name="Radwege-Netz" group="Radwege-Netz">
          <Pane name="networkLines" style={{ zIndex: 504 }}>
            <FeatureGroup>
              <GeoJSON
                data={networkLines}
                style={networkPathOptions}
                key={'networkLines'}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer name="Weg-Beschilderung" group="Radwege-Netz">
          <Pane name="wayfindingSigns" style={{ zIndex: 509 }}>
            <FeatureGroup>
              <GeoJSON
                data={wayfindingSigns}
                pointToLayer={pointWayfinding}
                key={'wayfindingSigns'}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>

        {/* Parken und Laden */}
        <GroupedLayer
          checked
          name="Parken"
          group="Parken + Laden"
          icon={<ParkingIcon />}
        >
          <Pane name="parking" style={{ zIndex: 515 }}>
            <MarkerClusterGroup
              spiderfyDistanceMultiplier={3}
              iconCreateFunction={createClusterCustomIconBlue}
              polygonOptions={{
                color: '#1c2b46',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.3,
              }}
              eventHandlers={{
                add: (e: any) => {
                  dispatch(updateParkingOverlay(true));
                },
                remove: (e: any) => {
                  dispatch(updateParkingOverlay(false));
                },
              }}
              clusterPane={'parking'}
            >
              <GeoJSON
                data={parking}
                pointToLayer={pointParking}
                key={'parking'}
                onEachFeature={addInfo}
              ></GeoJSON>
            </MarkerClusterGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer
          name="Lade-Station"
          group="Parken + Laden"
          icon={<ChargingIcon />}
        >
          <Pane name="chargingStations" style={{ zIndex: 516 }}>
            <FeatureGroup>
              <GeoJSON
                data={chargingStations}
                pointToLayer={pointCharging}
                key={'chargingStations'}
                onEachFeature={addInfo}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>

        {/* Rad-Service  */}
        <GroupedLayer
          checked
          name="Fahrrad-Laden"
          group="Rad-Service"
          icon={<ShopIcon />}
        >
          <Pane name="bicycleShops" style={{ zIndex: 514 }}>
            <MarkerClusterGroup
              spiderfyDistanceMultiplier={3}
              iconCreateFunction={createClusterCustomIconGreen}
              polygonOptions={{
                color: '#253a18',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.3,
              }}
              clusterPane={'bicycleShops'}
            >
              <GeoJSON
                data={bicycleShops}
                pointToLayer={pointShop}
                key={'bicycleShops'}
                onEachFeature={addInfo}
              ></GeoJSON>
            </MarkerClusterGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer
          name="DIY-Station"
          group="Rad-Service"
          icon={<RepairIcon fill="#000000" />}
        >
          <Pane name="repairStations" style={{ zIndex: 513 }}>
            <FeatureGroup>
              <GeoJSON
                data={repairStations}
                pointToLayer={pointRepair}
                key={'repairStations'}
                onEachFeature={addInfo}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer name="Rad-Verleih" group="Rad-Service">
          <Pane name="rentals" style={{ zIndex: 512 }}>
            <FeatureGroup>
              <GeoJSON
                data={rentals}
                pointToLayer={pointRental}
                key={'rentals'}
                onEachFeature={addInfo}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer name="Schlauch-Automat" group="Rad-Service">
          <Pane name="tubeVendings" style={{ zIndex: 511 }}>
            <FeatureGroup>
              <GeoJSON
                data={tubeVendings}
                pointToLayer={pointTube}
                key={'tubeVendings'}
                onEachFeature={addInfo}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>

        {/* Radverkehrs-Integration */}
        <GroupedLayer name="Bahnhof" group="Radverkehrs-Integration">
          <Pane name="trainStations" style={{ zIndex: 517 }}>
            <FeatureGroup>
              <GeoJSON
                data={trainStations}
                pointToLayer={pointTrain}
                key={'trainStations'}
                onEachFeature={addInfo}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer name="Verkehrsberuhigt" group="Radverkehrs-Integration">
          <Pane name="trafficCalming" style={{ zIndex: 502 }}>
            <FeatureGroup>
              <GeoJSON
                data={trafficCalming}
                style={trafficCalmingPathOptions}
                key={'trafficCalming'}
                onEachFeature={addInfo}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer
          name="Einbahnstraßen-Ausnahme"
          group="Radverkehrs-Integration"
        >
          <Pane name="onewayExceptions" style={{ zIndex: 503 }}>
            <FeatureGroup>
              <GeoJSON
                data={oneWayExceptions}
                style={oneWayExceptionsPathOptions}
                key={'onewayExceptions'}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer name="Mix-Weg" group="Radverkehrs-Integration">
          <Pane name="mixedPathLines" style={{ zIndex: 505 }}>
            <FeatureGroup>
              <GeoJSON
                data={mixedPathLines}
                style={mixedPathLinesPathOptions}
                key={'mixedPathLines'}
                onEachFeature={addInfo}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>
        <GroupedLayer name="Mix-Fläche" group="Radverkehrs-Integration">
          <Pane name="mixedPathPolygons" style={{ zIndex: 500 }}>
            <FeatureGroup>
              <GeoJSON
                data={mixedPathPolygons}
                style={mixedPathPolygonsPathOptions}
                key={'mixedPathPolygons'}
                onEachFeature={addInfo}
              />
            </FeatureGroup>
          </Pane>
        </GroupedLayer>
      </LayerControl>
    </>
  );
};

export default BicycleInfrastructure;
