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
  useMap,
  useMapEvent,
} from 'react-leaflet';

const AdministrativeAreas = () => {
  const BicycleInfrastructureData = useSelector(
    (state: RootStateOrAny) => state.bicycleinfrastructure.data // array of features []
  );
  // Retrieve whether exploreMode is activated
  const exploreMode = useSelector(
    (state: RootStateOrAny) => state.globalsettings.exploreMode
  );
  console.log('exploreMode', exploreMode);
  // Filter, style and ref parking polygons
  const administrativeAreas = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'admin_area'
  );
  let adminAreaOptions = {
    color: '#969696',
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.5,
  };

  // return Feature Group only when zoom is higher than 16 and if parkingOverlay === true
  return (
    <>
      {exploreMode && (
        <FeatureGroup>
          <Pane name="administrativeAreas" style={{ zIndex: 600 }}>
            <GeoJSON
              data={administrativeAreas}
              style={adminAreaOptions}
              key={'administrativeAreas'}
            />
          </Pane>
        </FeatureGroup>
      )}
    </>
  );
};

export default AdministrativeAreas;
