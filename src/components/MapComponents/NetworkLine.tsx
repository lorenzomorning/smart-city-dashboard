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
import {
  Circle,
  FeatureGroup,
  Marker,
  Polyline,
  GeoJSON,
  Popup,
} from 'react-leaflet';
import { useSelector, RootStateOrAny } from 'react-redux';

const NetworkLine = () => {
  const networkData = useSelector(
    (state: RootStateOrAny) => state.bicycleinfrastructure.data // array of features []
  );

  // filter feature.properties.bicyle_infrastructure_type = cycling_network
  console.log('networkData', networkData);
  const networkLines = networkData.features.filter(
    (e: any) => e.properties.bike_infrastructure_type === 'cycling_network'
  );
  console.log('networkLines', networkLines);
  /**
   * No local state needed for simple visualization
   * But if tile is plotted on main page, data is stored here
   */
  //const [length, setLength] = useState(0);

  /**useEffect(() => {
   * if (networkData.data.data) {
   *   setLength(networkData.data?.data?.length.value);
   * }
   * }, [networkData]); // dependency to check if it has changed
   */

  let networkPathOptions = {
    color: '#f5d63b',
    weight: 10,
    opacity: 0.4,
  };

  return (
    <>
      <GeoJSON
        data={networkLines}
        pathOptions={networkPathOptions}
        key={'whatever'}
      />
      {/* <FeatureGroup 
      pathOptions={networkPathOptions}
      >
      {networkLines?.length > 0 && // conditional rendering
        networkLines.map((networkFeature: any, index:number) => (
          <Polyline
            key={index}
            positions={networkFeature.geometry}  
          />
        ))}
      </FeatureGroup>   */}
    </>
  );
};

export default NetworkLine;