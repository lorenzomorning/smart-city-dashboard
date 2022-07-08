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
import { FeatureGroup, GeoJSON, Pane } from 'react-leaflet';

const AdministrativeAreas = () => {
  // retrieve data from the store
  const BicycleInfrastructureData = useSelector(
    (state: RootStateOrAny) => state.bicycleinfrastructure.data // array of features []
  );
  const exploreMode = useSelector(
    (state: RootStateOrAny) => state.globalsettings.exploreMode
  );

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

  function onEachAdminArea(feature: any, layer: any) {
    // bind popup with dashboard information on every admin area
    layer.bindPopup(feature.properties.name, {
      autoClose: false,
      closeOnClick: false,
    });
    // bind tooltip with the name to every admin area
    layer.bindTooltip(feature.properties.name, {
      pane: 'tooltip',
    });
    // organize mouse events on admin area
    layer.on({
      click: clickAdminArea,
      popupclose: popupCloseAdminArea,
      mousemove: mouseMoveAdminArea,
      mouseover: mouseOverAdminArea,
    });
  }

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

  // return Feature Group only when zoom is higher than 16 and if parkingOverlay === true
  return (
    <>
      {exploreMode && (
        <FeatureGroup>
          <Pane name="administrativeAreas" style={{ zIndex: 650 }}>
            <GeoJSON
              data={administrativeAreas}
              style={adminAreaOptions}
              key={'administrativeAreas'}
              onEachFeature={onEachAdminArea}
            />
          </Pane>
        </FeatureGroup>
      )}
    </>
  );
};

export default AdministrativeAreas;
