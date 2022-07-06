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
    console.log('start API-Request BI data...');
    const response_bi = yield call(fetch, ENDPOINT_BI);
    console.log('finish API-Request BI data');
    const osmdata_bi = yield response_bi.json();
    const data_bi = osmtogeojson(osmdata_bi);
    console.log('Bicycle Infrastructure Data', data_bi);
    //  Network Data from OSM
    console.log('start API-Request NW data...');
    const response_nw = yield call(fetch, ENDPOINT_NW);
    console.log('finish API-Request NW data');
    const osmdata_nw = yield response_nw.json();
    const data_nw = osmtogeojson(osmdata_nw);
    console.log('Network Data', data_nw);
    // Administrative areas from OSM
    console.log('start API-Request AA data...');
    const response_aa = yield call(fetch, ENDPOINT_AA);
    console.log('finish API-Request AA data');
    const osmdata_aa = yield response_aa.json();
    const data_aa = osmtogeojson(osmdata_aa);
    console.log('Administrative Areas Data', data_aa);

    const data = data_bi;
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
