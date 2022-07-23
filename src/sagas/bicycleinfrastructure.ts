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

import { call, delay, put, takeEvery } from 'redux-saga/effects';
import {
  LOAD_BICYCLEINFRASTRUCTURE_DATA,
  LOAD_BICYCLEINFRASTRUCTURE_DATA_FAILED,
  RENDER_BICYCLEINFRASTRUCTURE_DATA,
} from '../actions/bicycleinfrastructure';
import { ENDPOINT_BI } from './bicycleinfrastructureHelpers/overpassQueryBI';
import { ENDPOINT_NW } from './bicycleinfrastructureHelpers/overpassQueryNW';
import { ENDPOINT_AA } from './bicycleinfrastructureHelpers/overpassQueryAA';
import {
  addAttributes,
  addBikeInfrastructureType,
  aggregateBiAdminArea,
  appendAdminAreatoBI,
  appendNWtoBI,
  duplicatePolygonsToPoints,
  duplicateTrafficCalming,
  splitTrafficSignalLines,
} from './bicycleinfrastructureHelpers/helperFunctions';

const osmtogeojson = require('osmtogeojson');
const INTERVAL = 60 * 60 * 24; // 1 day

export function* fetchBicycleInfrastructureDataPeriodically() {
  while (true) {
    yield call(fetchBicycleInfrastructureData);
    yield delay(INTERVAL * 1000);
  }
}

export function* fetchBicycleInfrastructureData(): any {
  try {
    // Biycle Infrastructure Data from OSM
    // console.log('start API-Request BI data...');
    // const responseBi = yield call(fetch, ENDPOINT_BI);
    // console.log('finish API-Request BI data');
    // const osmdataBi = yield responseBi.json();
    // const dataBi = osmtogeojson(osmdataBi);
    const responseBi = yield call(fetch, '/dataBI.geojson');
    const dataBi = yield responseBi.json();
    console.log('Bicycle Infrastructure Data', dataBi);
    let dataBiType = addBikeInfrastructureType(dataBi);
    // check of any nd appear in the FeatureCollection
    const nd = dataBiType.features.filter(
      (feature: any) => feature.properties.bike_infrastructure_type === 'nd'
    );
    console.log('NDs', nd);
    // duplicate Polygons to Points
    dataBiType = duplicatePolygonsToPoints(dataBiType);
    // duplicate overwritten traffic calmed ways
    dataBiType = duplicateTrafficCalming(dataBiType);
    // split Traffic Signal LineStrings
    dataBiType = splitTrafficSignalLines(dataBiType);
    // add attributes for every Feature
    dataBiType = addAttributes(dataBiType);

    //  Network Data from OSM
    // console.log('start API-Request NW data...');
    // const responseNw = yield call(fetch, ENDPOINT_NW);
    // console.log('finish API-Request NW data');
    // const osmdataNw = yield responseNw.json();
    // const dataNw = osmtogeojson(osmdataNw);
    const responseNw = yield call(fetch, '/dataNW.geojson');
    const dataNw = yield responseNw.json();
    console.log('Network Data', dataNw);
    dataBiType = appendNWtoBI(dataNw, dataBiType);

    // Administrative areas from OSM
    // console.log('start API-Request AA data...');
    // const responseAa = yield call(fetch, ENDPOINT_AA);
    // console.log('finish API-Request AA data');
    // const osmdataAa = yield responseAa.json();
    // const dataAa = osmtogeojson(osmdataAa);
    const responseAa = yield call(fetch, '/dataAA.geojson');
    const dataAa = yield responseAa.json();
    console.log('Administrative Areas Data', dataAa);
    console.log('Calculate parking, cycling, service data for admin areas...');
    dataBiType = aggregateBiAdminArea(dataAa, dataBiType);
    // dataBiType = appendAdminAreatoBI(dataAa, dataBiType);
    console.log('Calculation completed!');

    const data = dataBiType;
    yield put({
      type: RENDER_BICYCLEINFRASTRUCTURE_DATA,
      bicycleinfrastructure: data,
    }); // this is used in reducers/bicycleinfrastructure.ts
  } catch (error) {
    console.log(error);
    yield put({ type: LOAD_BICYCLEINFRASTRUCTURE_DATA_FAILED, error });
  }
}

export function* loadBicycleInfrastructureData() {
  yield takeEvery(
    LOAD_BICYCLEINFRASTRUCTURE_DATA,
    fetchBicycleInfrastructureDataPeriodically
  );
}
