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

import React, { useEffect, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useMediaQuery } from 'beautiful-react-hooks';
import { updateFeaturesVisible } from '../../actions/map';
import { updateExploreMode } from '../../actions/globalsettings';

import {
  BicycleInfrastructureIcon,
  Humidity,
  CarParking,
  Bicycle,
  Pedestrian,
  ChevronLeft,
  ChevronRight,
  Water,
} from '../../components/Icons';

interface IconLabelProps {
  active?: boolean;
}

const IconLabel = styled.div<IconLabelProps>`
  min-height: 48px;
  font-weight: var(--scms-semi-bold);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 1rem;
  padding-right: 2rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.active ? 'rgba(255, 255, 255, 0.2)' : ''};

  > svg {
    width: 3rem;
  }

  :hover {
    background-color: rgba(255, 255, 255, 0.35);
  }
`;

interface ISidebarProps {
  collapsed: boolean;
}

const Sidebar = styled.div<ISidebarProps>`
  position: absolute;
  height: 100%;
  z-index: 1000;
  top: 0;
  color: white;
  background-color: rgba(0, 159, 227, 0.8);
  box-shadow: var(--scms-box-shadow);
  padding-top: 1rem;

  > ${IconLabel} {
    padding-right: ${(props) => (props.collapsed ? '1rem' : '2rem')};
  }
`;

interface CheckBoxWrapperProps {
  active?: boolean;
}
const CheckBoxWrapper = styled.div<CheckBoxWrapperProps>`
  position: relative;
  display: flex;
  felx-direction: row-reverse;

  background-color: ${(props) =>
    props.active ? 'rgba(255, 255, 255, 0.2)' : ''};
`;

const CheckBoxLabel = styled.label`
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #4fbe79;
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

const SidebarComponent = () => {
  const features = useSelector((state: RootStateOrAny) => state.map.features);
  const exploreMode = useSelector(
    (state: RootStateOrAny) => state.globalsettings.exploreMode
  );
  const dispatch = useDispatch();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isSmall = useMediaQuery('(max-width: 48rem)');

  useEffect(() => {
    setSidebarCollapsed(isSmall);
  }, [isSmall]);

  return (
    <Sidebar collapsed={sidebarCollapsed}>
      <IconLabel
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        style={{
          marginBottom: '1rem',
        }}
      >
        {/* Icons from FeatherIcons */}
        {!sidebarCollapsed ? (
          <>
            <ChevronLeft />
            <p>Minimieren</p>
          </>
        ) : (
          <ChevronRight />
        )}
      </IconLabel>
      <IconLabel
        active={features.opensensemap}
        onClick={() =>
          dispatch(
            updateFeaturesVisible({
              ...features,
              opensensemap: !features.opensensemap,
            })
          )
        }
      >
        <Humidity fill="#fff" />
        {!sidebarCollapsed && <p>Wetter</p>}
      </IconLabel>
      <IconLabel
        active={features.aasee}
        onClick={() =>
          dispatch(
            updateFeaturesVisible({
              ...features,
              aasee: !features.aasee,
            })
          )
        }
      >
        <Water fill="#fff" />
        {!sidebarCollapsed && <p>Wasserqualität Aasee</p>}
      </IconLabel>
      <IconLabel
        active={features.parking}
        onClick={() =>
          dispatch(
            updateFeaturesVisible({
              ...features,
              parking: !features.parking,
            })
          )
        }
      >
        <CarParking fill="#fff" />
        {!sidebarCollapsed && <p>Parkhäuser</p>}
      </IconLabel>
      <IconLabel
        active={features.pedestrians}
        onClick={() =>
          dispatch(
            updateFeaturesVisible({
              ...features,
              pedestrians: !features.pedestrians,
            })
          )
        }
      >
        <Pedestrian fill="#fff" />
        {!sidebarCollapsed && <p>Passant:innen</p>}
      </IconLabel>
      <IconLabel
        active={features.bicycle}
        onClick={() =>
          dispatch(
            updateFeaturesVisible({
              ...features,
              bicycle: !features.bicycle,
            })
          )
        }
      >
        <Bicycle fill="#fff" />
        {!sidebarCollapsed && <p>Fahrräder</p>}
      </IconLabel>
      <IconLabel
        active={features.bicycleinfrastructure}
        onClick={() =>
          dispatch(
            updateFeaturesVisible({
              ...features,
              bicycleinfrastructure: !features.bicycleinfrastructure,
            })
          )
        }
      >
        <BicycleInfrastructureIcon fill="#fff" />
        {!sidebarCollapsed && <p>Rad-Infrastruktur</p>}
      </IconLabel>
      {features.bicycleinfrastructure && !sidebarCollapsed && (
        <CheckBoxWrapper active={features.bicycleinfrastructure}>
          <CheckBox
            type="checkbox"
            id="checkbox"
            defaultChecked={exploreMode}
            onChange={() => dispatch(updateExploreMode(!exploreMode))}
          />
          <CheckBoxLabel htmlFor="checkbox" />
          <span>Stadtteil-Modus</span>
        </CheckBoxWrapper>
      )}
    </Sidebar>
  );
};

export default SidebarComponent;
