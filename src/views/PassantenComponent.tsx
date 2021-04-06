import React, { lazy, Suspense } from 'react';
import Skeleton from 'react-loading-skeleton';
import { RootStateOrAny, useSelector } from 'react-redux';
import styled from 'styled-components';
import BaseWidgetComponent from '../components/BaseWidget';
import { TilesWrapper } from '../components/styles';
import Pedestrian from '../resources/animated/Pedestrian';

const MeasurementTile = lazy(() => import('../components/MeasurementTile'));
const TimeSeriesChart = lazy(() => import('../components/TimeSeriesChart'));

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const PassantenComponent = () => {
  const pedestrianData: ServiceState = useSelector(
    (state: RootStateOrAny) => state.passanten
  );

  return (
    <BaseWidgetComponent
      title="Passanten"
      icon={Pedestrian}
      mapFeatureTag="pedestrians"
      dataSource={`
**Datenquelle**

Die Passantenfrequenzen in Münster stellt Ihnen die Wirtschaftsförderung Münster GmbH in Kooperation mit hystreet.com zur Verfügung.

![WFM](https://www.wfm-muenster.de/wp-content/themes/wfm/images/logo_wfm.svg)
`}
      detailsDefault={true}
      details={
        <ChartWrapper>
          <Suspense fallback={<Skeleton count={5} />}>
            <TimeSeriesChart
              id="temperature"
              series={
                pedestrianData.data?.length > 0 &&
                pedestrianData.data?.map((sensor: any) => {
                  return {
                    name: sensor.name,
                    data: sensor.measurements.slice(0, -1).map((m: any) => ({
                      x: m.timestamp,
                      y: m.pedestrians_count,
                    })),
                  };
                })
              }
              title="Passanten"
              type={'line'}
              chartOptions={{
                colors: ['#009fe3', '#86bc25', '#fdc300'],
                yaxis: {
                  labels: {
                    formatter: (value: number) => {
                      return value.toFixed(0);
                    },
                  },
                },
                tooltip: {
                  x: {
                    show: false,
                    formatter: (value: number) => {
                      const date = new Date(value);

                      return `${date.getHours()} - ${date.getHours() + 1} Uhr`;
                    },
                  },
                  y: {
                    formatter: (value: number) => {
                      return `${value.toFixed(0)}`;
                    },
                  },
                },
              }}
            ></TimeSeriesChart>
          </Suspense>
        </ChartWrapper>
      }
    >
      <TilesWrapper>
        {pedestrianData.data?.length > 0 &&
          pedestrianData.data?.map((p: any) => (
            <Suspense
              key={p.id}
              fallback={<Skeleton width="100%" height="100%" />}
            >
              <MeasurementTile
                key={p.id}
                footer={'letzte Stunde'}
                header={p.name}
                value={
                  p.measurements[p.measurements.length - 2].pedestrians_count
                }
                decimals={0}
              ></MeasurementTile>
            </Suspense>
          ))}
      </TilesWrapper>
    </BaseWidgetComponent>
  );
};

export default PassantenComponent;
