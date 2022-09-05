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

export const PopupWrapper = styled.div`
  margin: 0rem;
  padding: 0rem;
  border: 0rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const ContentWrapper = styled.div`
  height: 100%;
  position: relative;
`;

export const HeadingWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.1;
`;

export const IconWrapper = styled.div`
  margin-right: 1rem;
  > svg {
    width: 3rem;
    height: 3rem;
    fill: var(--scms-primary-blue);
    stroke: var(--scms-primary-blue);
    opacity: 0.3;
  }
`;

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
`;

export const FooterButton = styled.button`
  cursor: pointer;
  user-select: none;
  background-color: rgba(189, 189, 189, 0.15);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  margin-top: 0.5rem;
  border: none;
  outline: none;

  > a {
    color: inherit;
  }

  &:hover {
    background-color: rgba(189, 189, 189, 0.5);
  }
`;

export const HighlightedFooterButton = styled(FooterButton)<{ bold?: boolean }>`
  background-color: rgba(0, 159, 227, 0.15);

  font-weight: ${(props) => (props.bold ? '600' : '')};

  &:hover {
    background-color: rgba(0, 159, 227, 0.15);
  }
`;

export const ChartHeadingWrapper = styled.div`
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: '#263238';
`;

export const CapacityLegend = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 rem;
  padding: 0 rem;

  > * {
    padding: 2 rem;
  }

  > .blue {
    color: var(--scms-primary-blue);
  }

  > .red {
    color: var(--scms-red);
  }

  > .green {
    color: var(--scms-green);
  }
`;
