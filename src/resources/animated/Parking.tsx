import styled from 'styled-components';
import BaseAnimatedIcon from './BaseAnimatedIcon';

interface IAnimatedIconProps {
  start: boolean;
}
const IconStyled = styled.svg<{ animate: boolean; duration: number }>`
  #parkhaus-autoinner,
  #parkhaus-autoinner2 {
    fill: #fff;
  }
  #licht1,
  #licht2 {
    animation: ${({ animate, duration }) =>
      animate ? `parkhaus-anime ${duration}ms linear 1 normal forwards` : ''};
  }
  @keyframes parkhaus-anime {
    0% {
      fill: #ffdb13;
    }
    10% {
      fill: #afe0f5;
    }
    20% {
      fill: #ffdb13;
    }
    30% {
      fill: #afe0f5;
    }
    40% {
      fill: #ffdb13;
    }
    50% {
      fill: #afe0f5;
    }
    80% {
      fill: #ffdb13;
    }
    100% {
      fill: #afe0f5;
    }
  }
`;

const Parking = (props: IAnimatedIconProps) => {
  return (
    <BaseAnimatedIcon
      start={props.start}
      AnimatedIconStyled={IconStyled}
      viewBox="0 0 56 56"
    >
      <>
        <path
          id="auto"
          d="M47.580000,32.350000C48.410000,33.610000,48.850000,35.090000,48.830000,36.600000L48.830000,48C48.840000,49.080000,48.010000,49.960000,46.990000,49.970000C46.160000,49.950000,44.990000,50.140000,44.380000,49.400000C43.550000,48.710000,43.890000,46.900000,43.830000,45.970000L13.830000,45.970000L13.830000,47.970000C13.850000,49.060000,12.960000,49.950000,11.860000,49.970000C11.840000,49.970000,12.190000,49.970000,12.170000,49.970000C11.310000,49.950000,10.060000,50.140000,9.420000,49.400000C9.040000,49.030000,8.820000,48.510000,8.830000,47.980000L8.830000,36.620000C8.780000,33.620000,10.660000,30.760000,13.330000,29.450000L15.490000,24.110000C16.420000,21.610000,18.990000,19.900000,21.650000,19.950000C21.650000,19.950000,35.970000,19.950000,35.970000,19.950000C38.620000,19.900000,41.210000,21.610000,42.130000,24.110000L44.290000,29.450000C45.620000,30.100000,46.740000,31.110000,47.530000,32.370000L47.580000,32.350000Z"
        />
        <g id="autoinner">
          <path
            id="parkhaus-autoinner"
            d="M16.880000,29.540000L40.750000,29.540000L39.450000,26.310000C39.220000,25.780000,38.840000,25.330000,38.350000,25.020000C37.860000,24.690000,37.280000,24.520000,36.690000,24.540000L20.910000,24.540000C19.730000,24.510000,18.620000,25.250000,18.150000,26.310000L16.880000,29.540000Z"
          />
          <path
            id="parkhaus-autoinner2"
            d="M45.360000,36.340000C45.330000,34.210000,43.460000,32.500000,41.180000,32.520000C41.180000,32.520000,16.430000,32.520000,16.430000,32.520000C14.150000,32.520000,12.300000,34.250000,12.300000,36.380000L12.300000,36.380000L12.300000,40.240000C12.290000,40.580000,12.430000,40.920000,12.690000,41.160000C12.950000,41.410000,13.300000,41.540000,13.670000,41.520000L43.930000,41.520000C44.300000,41.530000,44.660000,41.400000,44.930000,41.160000C45.180000,40.910000,45.320000,40.580000,45.300000,40.240000L45.360000,36.340000Z"
          />
        </g>
        <g id="licht">
          <path
            id="licht1"
            d="M41.650000,35.070000C43.550000,37.100000,41.680000,39.910000,39.080000,39.550000C38.280000,39.570000,37.480000,39.520000,36.690000,39.390000C35.970000,39.230000,35.600000,38.840000,35.600000,38.230000C35.720000,37.230000,36.240000,36.310000,37.050000,35.680000C37.700000,34.910000,38.640000,34.410000,39.670000,34.290000C40.410000,34.260000,41.130000,34.550000,41.650000,35.070000Z"
          />
          <path
            id="licht2"
            d="M20.350000,35.450000C21.160000,36.110000,21.670000,37.040000,21.780000,38.060000C21.780000,38.670000,21.430000,39.060000,20.690000,39.220000C19.900000,39.350000,19.100000,39.410000,18.300000,39.380000L17.710000,39.380000C13.850000,39.530000,13.850000,33.960000,17.710000,34.110000C18.740000,34.220000,19.680000,34.700000,20.350000,35.450000Z"
          />
        </g>
        <path
          id="dach"
          d="M55.980000,17.910000C56.070000,18.260000,56.020000,18.620000,55.860000,18.940000L55.180000,20.090000C55.030000,20.410000,54.730000,20.640000,54.380000,20.700000C54.020000,20.780000,53.650000,20.740000,53.320000,20.580000L28.800000,7.610000L4.340000,20.610000C4.010000,20.770000,3.630000,20.810000,3.280000,20.730000C2.920000,20.660000,2.620000,20.440000,2.460000,20.120000L1.780000,18.970000C1.610000,18.650000,1.570000,18.290000,1.660000,17.940000C1.730000,17.590000,1.960000,17.300000,2.290000,17.150000L27.760000,3.580000C28.400000,3.240000,29.170000,3.240000,29.810000,3.580000L55.280000,17.150000C55.630000,17.270000,55.890000,17.560000,55.980000,17.910000Z"
        />
      </>
    </BaseAnimatedIcon>
  );
};

export default Parking;
