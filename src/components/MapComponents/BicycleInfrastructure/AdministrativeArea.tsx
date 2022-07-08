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

//import L from 'leaflet';
import React, { useState } from 'react';
import { useSelector, RootStateOrAny } from 'react-redux';
import {
  FeatureGroup,
  GeoJSON,
  Pane,
  Polygon,
  Popup,
  Tooltip,
} from 'react-leaflet';
import flip from '@turf/flip';
import { PopupContent } from '../styles';

const AdministrativeAreas = () => {
  // retrieve data from the store
  const BicycleInfrastructureData = useSelector(
    (state: RootStateOrAny) => state.bicycleinfrastructure.data // array of features []
  );
  const exploreMode = useSelector(
    (state: RootStateOrAny) => state.globalsettings.exploreMode
  );

  // Filter and style admininstrative Areas
  const administrativeAreas = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'admin_area'
  );
  let adminAreaOptions = {
    color: '#000000',
    weight: 2,
    opacity: 1,
    fillColor: '#4d514d',
    fillOpacity: 0.8,
  };

  // add exemplary data to administrative Area 'Innenstadtring'
  const arrayLength = administrativeAreas.length;
  for (var i = 0; i < arrayLength; i++) {
    if (administrativeAreas[i].properties.name === 'Innenstadtring') {
      console.log('Innenstadtring before', administrativeAreas[i]);
      administrativeAreas[i].properties.attributes = {};
      administrativeAreas[i].properties.attributes.parking_indicator = {
        facilities: 20,
        capacity: {
          sumStands: 40,
          unknownFacilities: 15,
        },
        weatherProtection: {
          yesFacilities: 2,
          noFacilities: 10,
          unknownFacilities: 8,
        },
        theftProtection: {
          yesFacilities: 2,
          noFacilities: 10,
          unknownFacilities: 8,
        },
      };
      administrativeAreas[i].properties.attributes.lane_indicator = {
        lenghtCyclingStreet: 2412,
      };
      administrativeAreas[i].properties.attributes.service_indicator = {
        shops: 5,
        diyStations: 0,
        rentals: 1,
        tubeVendingMachine: 2,
      };
      console.log('Innenstadtring after', administrativeAreas[i]);
    }
  }

  // Create event functions
  function clickAdminArea(e: any) {
    e.target.setStyle({
      color: '#000000',
      weight: 2,
      opacity: 1,
      fillColor: '#4d514d',
      fillOpacity: 0,
    });
    if (e.target.isTooltipOpen()) {
      e.target.closeTooltip();
    }
  }
  function popupCloseAdminArea(e: any) {
    e.target.setStyle({
      color: '#000000',
      weight: 2,
      opacity: 1,
      fillColor: '#4d514d',
      fillOpacity: 0.8,
    });
  }
  function mouseMoveAdminArea(e: any) {
    if (!e.target.isPopupOpen()) {
      e.target.openTooltip(e.latlng);
    }
  }
  function mouseOverAdminArea(e: any) {
    if (e.target.isPopupOpen()) {
      e.target.closeTooltip();
    }
  }

  // return Feature Group only when zoom is higher than 16 and if parkingOverlay === true
  return (
    <>
      {exploreMode && (
        <FeatureGroup>
          <Pane name="administrativeAreas" style={{ zIndex: 650 }}>
            {administrativeAreas.map((feature: any) => {
              console.log(feature.geometry.coordinates);
              return (
                <Polygon
                  positions={flip(feature).geometry.coordinates}
                  key={feature.properties.id}
                  pathOptions={adminAreaOptions}
                  eventHandlers={{
                    click: clickAdminArea,
                    popupclose: popupCloseAdminArea,
                    mousemove: mouseMoveAdminArea,
                    mouseover: mouseOverAdminArea,
                  }}
                >
                  <Tooltip pane="tooltip">{feature.properties.name}</Tooltip>
                  <Popup pane="popup" autoClose={false} closeOnClick={false}>
                    <PopupContent>{feature.properties.name}</PopupContent>
                  </Popup>
                </Polygon>
              );
            })}
          </Pane>
        </FeatureGroup>
      )}
    </>
  );
};

export default AdministrativeAreas;
