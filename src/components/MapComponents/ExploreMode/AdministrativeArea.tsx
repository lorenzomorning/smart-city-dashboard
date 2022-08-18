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
import React, { lazy, Suspense, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector, RootStateOrAny } from 'react-redux';
import { FeatureGroup, Pane, Polygon, Popup, Tooltip } from 'react-leaflet';
import flip from '@turf/flip';
import styled from 'styled-components';

import { TilesWrapper } from '../../styles';
import {
  ChartHeadingWrapper,
  CapacitySliderWrapper,
  CapacityLegend,
} from './styles';
import MeasurementTilePopup from '../../MeasurementTilePopup';

import PopupPages from './PopupPages';
import DonutChart from './DonutChart';
import SliderCarousel from './SlideCarousel';
import { CapacitySlider } from './CapacitySlider';

const StyledPopup = styled(Popup)`
  min-width: 350px;
  padding: 0rem;
  margin: 0rem;
`;

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
    fillOpacity: 0.5,
  };

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
      fillOpacity: 0.5,
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

  return (
    <>
      {exploreMode && (
        <FeatureGroup>
          <Pane name="administrativeAreas" style={{ zIndex: 650 }}>
            {administrativeAreas.map((feature: any, index: any) => {
              return (
                <Polygon
                  positions={flip(feature).geometry.coordinates}
                  key={index}
                  pathOptions={adminAreaOptions}
                  eventHandlers={{
                    click: clickAdminArea,
                    popupclose: popupCloseAdminArea,
                    mousemove: mouseMoveAdminArea,
                    mouseover: mouseOverAdminArea,
                  }}
                >
                  <Tooltip pane="tooltip">{feature.properties.name}</Tooltip>
                  <StyledPopup
                    pane="popup"
                    autoClose={false}
                    closeOnClick={false}
                  >
                    <PopupPages
                      name={feature.properties.name}
                      contentParking={
                        <SliderCarousel
                          contentCapacity={
                            <>
                              <ChartHeadingWrapper>
                                <span className="is-size-6">
                                  {'Bekannte Kapazitäten'}
                                </span>
                              </ChartHeadingWrapper>
                              <CapacityLegend>
                                <p className="green">
                                  Parkeinheiten mit bekannter <br /> Kapazität
                                </p>
                                <p className="blue">Summe an Radplätzen</p>
                                <p className="red">
                                  Parkeinheiten <br /> mit unbekannter Kapazität
                                </p>
                              </CapacityLegend>
                              <CapacitySliderWrapper>
                                <CapacitySlider
                                  freqKnown={
                                    feature.properties.parking.capacity
                                      .freqKnown
                                  }
                                  freqUnknown={
                                    feature.properties.parking.capacity
                                      .freqUnknown
                                  }
                                  max={
                                    feature.properties.parking.capacity
                                      .freqKnown +
                                    feature.properties.parking.capacity
                                      .freqUnknown
                                  }
                                  sumStands={
                                    feature.properties.parking.capacity
                                      .sumStands
                                  }
                                ></CapacitySlider>
                              </CapacitySliderWrapper>
                            </>
                          }
                          contentWeather={<span>Wettergeschützt</span>}
                          contentTheft={<span>Diebstahlegschützt</span>}
                          contentTypes={
                            <>
                              <ChartHeadingWrapper>
                                <span className="is-size-6">{'Parktypen'}</span>
                              </ChartHeadingWrapper>
                              <DonutChart
                                id="parkingTypes"
                                type="donut"
                                width={300}
                                height={200}
                                series={Object.values(
                                  feature.properties.parking.type
                                )}
                                chartOptions={{
                                  labels: Object.keys(
                                    feature.properties.parking.type
                                  ),
                                }}
                                colors={Object.keys(
                                  feature.properties.parking.type
                                ).map((type: string) => {
                                  switch (type) {
                                    case 'Unbekannt':
                                      return '#bcbcbc';
                                    case 'Radstall':
                                      return '#f8cc1b';
                                    case 'Anlehnbügel':
                                      return '#fa7a48';
                                    case '(Boden)Anker':
                                      return '#ab0a58';
                                    case 'Radboxen':
                                      return '#bed057';
                                    case 'Reifenständer':
                                      return '#84a2cd';
                                    case 'Rad-Gebäude':
                                      return '#442276';
                                    case 'Lenkerhalter':
                                      return '#ffa5c8';
                                    case 'Doppeletage':
                                      return '#4777cd';
                                  }
                                })}
                              />
                            </>
                          }
                        ></SliderCarousel>
                      }
                      contentCycling={
                        <progress
                          className="progress is-large"
                          value="80"
                          max="100"
                        >
                          80%
                        </progress>
                      }
                      contentService={
                        <TilesWrapper>
                          <Suspense
                            fallback={<Skeleton width="100%" height="100%" />}
                          >
                            <MeasurementTilePopup
                              header="Innerhalb"
                              value={feature.properties.service.shopsWithin}
                              decimals={0}
                            ></MeasurementTilePopup>
                          </Suspense>
                          <Suspense
                            fallback={<Skeleton width="100%" height="100%" />}
                          >
                            <MeasurementTilePopup
                              header="In der Nähe"
                              value={feature.properties.service.shopsNearby}
                              decimals={0}
                            ></MeasurementTilePopup>
                          </Suspense>
                          <Suspense
                            fallback={<Skeleton width="100%" height="100%" />}
                          >
                            <MeasurementTilePopup
                              header="Abdeckung"
                              value={feature.properties.service.coverage}
                              decimals={2}
                              unit="km2"
                            ></MeasurementTilePopup>
                          </Suspense>
                        </TilesWrapper>
                      }
                    ></PopupPages>
                  </StyledPopup>
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
