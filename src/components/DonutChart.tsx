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

import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import merge from 'lodash/merge';

interface IDonutChartProps {
  id: string;
  series: any[];
  colors?: any[];
  height?: number | string;
  width?: number | string;
  title?: string;
  unit?: string;
  chartOptions?: ApexOptions;
  type:
    | 'area'
    | 'line'
    | 'bar'
    | 'histogram'
    | 'pie'
    | 'donut'
    | 'rangeBar'
    | 'radialBar'
    | 'scatter'
    | 'bubble'
    | 'heatmap'
    | 'candlestick'
    | 'radar'
    | 'polarArea';
}

const DonutChart = (props: IDonutChartProps) => {
  const baseOptions: ApexOptions = {
    chart: {
      id: props.id,
      toolbar: {
        show: false,
      },
      selection: {
        enabled: false,
      },
      sparkline: {
        enabled: false,
      },
      zoom: {
        enabled: false,
      },
      fontFamily: 'Open Sans, sans-serif',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: props.colors,
    dataLabels: {
      enabled: true,
      style: { fontSize: '8px' },
    },
    legend: {
      position: 'right',
      fontSize: '12px',
      fontFamily: 'Open Sans, sans-serif',
      fontWeight: 400,
      itemMargin: {
        horizontal: 0,
        vertical: 0,
      },
    },
    title: {
      text: props.title
        ? props.unit
          ? `${props.title} in ${props.unit}`
          : `${props.title}`
        : undefined,
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: 'Open Sans, sans-serif',
        color: '#263238',
      },
    },
  };

  return (
    <Chart
      options={merge(baseOptions, props.chartOptions)}
      series={props.series}
      type={props.type || 'area'}
      height={props.height || '100%'}
      width={props.width || '100%'}
    />
  );
};

export default DonutChart;
