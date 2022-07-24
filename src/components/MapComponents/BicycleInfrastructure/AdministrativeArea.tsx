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
import { TilesWrapper } from '../../styles';
import styled from 'styled-components';
import PopupAdminArea from './PopupPages';
import MeasurementTilePopup from '../../MeasurementTilePopup';
import DonutChart from '../../DonutChart';
import SliderCarousel from '../../SlideCarousel';

const MeasurementTile = lazy(() => import('../../MeasurementTilePopup'));

const StyledPopup = styled(Popup)`
  min-width: 350px;
  padding: 0rem;
  margin: 0rem;
`;

const ChartWrapper = styled.div``;

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

  // return Feature Group only when zoom is higher than 16 and if parkingOverlay === true
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
                    <PopupAdminArea
                      name={feature.properties.name}
                      contentParking={
                        <SliderCarousel
                          contentCapacity={feature.properties.name}
                          contentWeather={feature.properties.name}
                          contentTheft={feature.properties.name}
                          contentTypes={
                            <DonutChart
                              id="parkingTypes"
                              title="Parktyp"
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
                                dataLabels: {
                                  enabled: false,
                                  // style: {
                                  //   colors: Array(
                                  //     Object.keys(feature.properties.parking.type)
                                  //       .length
                                  //   ).fill('#00000'),
                                  // },
                                  // dropShadow: {
                                  //   enabled: true,
                                  // },
                                },
                              }}
                            />
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
                    ></PopupAdminArea>
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
