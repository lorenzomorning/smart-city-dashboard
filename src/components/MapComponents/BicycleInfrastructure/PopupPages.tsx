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
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

import { FooterWrapper } from '../../styles';

import { CyclingIcon, ShopIcon, ParkingIcon } from '../../Icons';

interface IPopupAdminAreaProps {
  name: string;
}

const PopupWrapper = styled.div`
  margin: 0rem;
  padding: 0rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const ContentWrapper = styled.div`
  height: 100%;
  position: relative;
`;

const HeadingWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  > svg {
    width: 2rem;
    height: 2rem;
  }
`;

const FooterButton = styled.button`
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

const HighlightedFooterButton = styled(FooterButton)<{ bold?: boolean }>`
  background-color: rgba(0, 159, 227, 0.15);

  font-weight: ${(props) => (props.bold ? '600' : '')};

  &:hover {
    background-color: rgba(0, 159, 227, 0.15);
  }
`;

const PopupAdminArea = (props: IPopupAdminAreaProps) => {
  const dispatch = useDispatch();

  const [showParking, setShowParking] = useState(true);
  const [showCycling, setShowCycling] = useState(false);
  const [showService, setShowService] = useState(false);

  return (
    <>
      {showParking && (
        <PopupWrapper>
          <HeadingWrapper>
            <IconWrapper>
              <ParkingIcon fill="#203864" />
            </IconWrapper>
            {<p className="is-size-5">{'arken in ' + props.name}</p>}
          </HeadingWrapper>
          <ContentWrapper></ContentWrapper>
          <FooterWrapper>
            <HighlightedFooterButton bold={showParking}>
              Parken
            </HighlightedFooterButton>
            <FooterButton
              onClick={() => {
                setShowCycling(true);
                setShowParking(false);
              }}
            >
              Radwege
            </FooterButton>
            <FooterButton
              onClick={() => {
                setShowService(true);
                setShowParking(false);
              }}
            >
              Service
            </FooterButton>
          </FooterWrapper>
        </PopupWrapper>
      )}
      {showCycling && (
        <PopupWrapper>
          <HeadingWrapper>
            <IconWrapper>
              <CyclingIcon />
            </IconWrapper>
            {<p className="is-size-5">{'Radwege in ' + props.name}</p>}
          </HeadingWrapper>
          <ContentWrapper></ContentWrapper>
          <FooterWrapper>
            <FooterButton
              onClick={() => {
                setShowParking(true);
                setShowCycling(false);
              }}
            >
              Parken
            </FooterButton>
            <HighlightedFooterButton bold={showCycling}>
              Radwege
            </HighlightedFooterButton>
            <FooterButton
              onClick={() => {
                setShowService(true);
                setShowCycling(false);
              }}
            >
              Service
            </FooterButton>
          </FooterWrapper>
        </PopupWrapper>
      )}
      {showService && (
        <PopupWrapper>
          <HeadingWrapper>
            <IconWrapper>
              <ShopIcon fill="#385723" />
            </IconWrapper>
            {<p className="is-size-5">{'Läden in ' + props.name}</p>}
          </HeadingWrapper>
          <ContentWrapper></ContentWrapper>
          <FooterWrapper>
            <FooterButton
              onClick={() => {
                setShowParking(true);
                setShowService(false);
              }}
            >
              Parken
            </FooterButton>
            <FooterButton
              onClick={() => {
                setShowCycling(true);
                setShowService(false);
              }}
            >
              Radwege
            </FooterButton>
            <HighlightedFooterButton bold={showService}>
              Service
            </HighlightedFooterButton>
          </FooterWrapper>
        </PopupWrapper>
      )}
    </>
  );
};

export default PopupAdminArea;
