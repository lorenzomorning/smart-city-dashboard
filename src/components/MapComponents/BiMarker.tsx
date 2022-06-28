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
  icon: JSX.Element;
}

const BaseMapMarker = styled.div`
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  box-shadow: var(--scms-box-shadow);
  font-weight: var(--scms-semi-bold);
  display: flex;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  border-radius: 50px;

  > svg {
    width: 1rem;
    pointer-events: none;
  }
`;

const BiMarker = (props: BiMarkerProps) => {
  return <BaseMapMarker>{props.icon}</BaseMapMarker>;
};

export default BiMarker;
