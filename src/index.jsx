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

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// import reportWebVitals from './reportWebVitals';
import {
  loadParkhausData,
  loadParkhausTimeseriesData,
} from './actions/parkhaus';
import { loadAaseeData } from './actions/aasee';
import { loadOsemData } from './actions/opensensemap';
import { loadPedestrianData } from './actions/passanten';
import { loadBicycleData } from './actions/bicycle';
import { loadBicycleInfrastructureData } from './actions/bicycleinfrastructure';

import mainReducer from './reducers';
import rootSaga from './sagas';

import './index.css';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/**
 * Core Concepts: Store
 * A Redux store contains the current state value. Stores are created using the
 * createStore method, which takes the root reducer function and an optional 
 * preloaded state value.
 * 
 * Stores have three main methods:
    getState: returns the current stored state value
    dispatch: starts a state update with the provided action object
    subscribe: accepts a callback function that will be run every time an action is dispatched 
              (get current store state 
              -> exctract the data needed by this piece of UI 
              -> updates the UI with this data)
 */
const store = createStore(
  mainReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

// we might want to run that somewhere else
store.dispatch(loadBicycleInfrastructureData());
store.dispatch(loadParkhausData());
let from = new Date();
from.setDate(from.getDate() - 1);
store.dispatch(loadParkhausTimeseriesData(from, new Date()));
store.dispatch(loadAaseeData());
store.dispatch(loadOsemData());
store.dispatch(loadPedestrianData());
store.dispatch(loadBicycleData());

/**
 * App Setup with Provider:
 * Wrapping your root application component in <Provider>
 * and passing it the store reference makes that store available
 * to all connected components in the component tree.
 */
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
