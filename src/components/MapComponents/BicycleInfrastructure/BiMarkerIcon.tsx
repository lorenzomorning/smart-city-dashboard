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

import styled from 'styled-components';
import React from 'react';

interface BiMarkerProps {
  color:
    | '#385723'
    | '#203864'
    | '#FF0000'
    | 'blue'
    | 'green'
    | 'orange'
    | 'red'; // 'darkgreen', 'darkblue', 'red'
  icon: JSX.Element;
}

const BaseMapMarker = styled.div`
  background-color: ${(props) => props.color};
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  border: 1px solid white;
  width: 1.5rem;
  height: 1.5rem;
  color: white;
  box-shadow: var(--scms-box-shadow);
  font-weight: var(--scms-semi-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: small;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  border-radius: 50px;

  > svg {
    width: 1rem;
    pointer-events: none;
  }
`;

const BiMarkerIcon = (props: BiMarkerProps) => {
  return <BaseMapMarker color={props.color}>{props.icon}</BaseMapMarker>;
};

export default BiMarkerIcon;
