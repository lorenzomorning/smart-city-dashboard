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

const INTERVAL = 60; // 1 minute

export function* fetchBicycleInfrastructureDataPeriodically() {
  while (true) {
    yield call(fetchBicycleInfrastructureData);
    yield delay(INTERVAL * 1000);
  }
}

export function* fetchBicycleInfrastructureData(): any {
  console.log('FetchBicycleInfrastructureData');
  try {
    console.log('start trying');
    const endpoint = `/bike_data.geojson`;
    const response = yield call(fetch, endpoint);
    console.log('response', response);
    const data = yield response.json();
    console.log('data', data);
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
