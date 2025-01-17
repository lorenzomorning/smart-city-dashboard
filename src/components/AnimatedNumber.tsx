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

import { animated, useSpring } from 'react-spring';

interface IAnimatedNumberProps {
  value: number;
  decimals?: number;
}

const AnimatedNumber = (props: IAnimatedNumberProps) => {
  const spring = useSpring({
    number: props.value,
    from: { number: 0 },
  });
  return (
    <animated.span>
      {spring.number.interpolate((val: any) => val.toFixed(props.decimals))}
    </animated.span>
  );
};

export default AnimatedNumber;
