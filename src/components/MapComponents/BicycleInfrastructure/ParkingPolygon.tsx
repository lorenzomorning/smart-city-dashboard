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

const ParkingPolygons = () => {
  const BicycleInfrastructureData = useSelector(
    (state: RootStateOrAny) => state.bicycleinfrastructure.data // array of features []
  );
  // Retrieve whether parking points are shown or not
  const parkingOverlay = useSelector(
    (state: RootStateOrAny) => state.globalsettings.parkingOverlay
  );
  // Filter, style and ref parking polygons
  const parkingPolygons = BicycleInfrastructureData.features.filter(
    (feature: any) =>
      feature.properties.bike_infrastructure_type === 'parking' &&
      feature.geometry.type === 'Polygon'
  );
  let parkingPolygonsPathOptions = {
    color: '#203864',
  };

  // Define zoom related visualization
  let map = useMap(); // get map as this component is a child of the <MapContainer>
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvent('zoomend', (e) => {
    setZoom(e.target._zoom);
  });
  console.log('zoom', zoom);

  // return Feature Group only when zoom is higher than 16 and if parkingOverlay === true
  return (
    <>
      {zoom >= 16 && parkingOverlay && (
        <Pane name="parkinPolygons" style={{ zIndex: 501 }}>
          <FeatureGroup>
            <GeoJSON
              data={parkingPolygons}
              style={parkingPolygonsPathOptions}
              key={'parkingPolygons'}
            />
          </FeatureGroup>
        </Pane>
      )}
    </>
  );
};

export default ParkingPolygons;
