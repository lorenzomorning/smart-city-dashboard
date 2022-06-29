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

import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import styled from 'styled-components';

// Create DeafultMapMarker
const DefaultMapMarker = styled.div<{
  colorbg: string;
  color: string;
  size: string;
  font: string;
}>`
  background-color: ${(props) => props.colorbg};
  font-size: ${(props) => props.font}rem;
  border-radius: 50%;
  border: 1px solid white;
  width: ${(props) => props.size}rem;
  height: ${(props) => props.size}rem;
  color: ${(props) => props.color};
  box-shadow: var(--scms-box-shadow);
  font-weight: var(--scms-semi-bold);
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Create customized MarkerClusterIcons
export function createClusterCustomIconGreen(cluster: any) {
  let count = cluster.getChildCount();
  if (count < 10) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker
          color="#E2F0D9"
          colorbg="#385723"
          size="1.5"
          font="0.9"
        >
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  } else if (count >= 10 && count < 50) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker color="#E2F0D9" colorbg="#385723" size="2" font="1.1">
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  } else if (count >= 50) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker
          color="#E2F0D9"
          colorbg="#385723"
          size="2.5"
          font="1.5"
        >
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  }
}

export function createClusterCustomIconBlue(cluster: any) {
  let count = cluster.getChildCount();
  if (count < 10) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker
          color="#DEEBF7"
          colorbg="#203864"
          size="1.5"
          font="0.9"
        >
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  } else if (count >= 10 && count < 50) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker color="#DEEBF7" colorbg="#203864" size="2" font="1">
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  } else if (count >= 50) {
    return L.divIcon({
      html: renderToStaticMarkup(
        <DefaultMapMarker
          color="#DEEBF7"
          colorbg="#203864"
          size="2.5"
          font="1.25"
        >
          {count}
        </DefaultMapMarker>
      ),
      className: '',
      iconSize: L.point(40, 40, true),
    });
  }
}
