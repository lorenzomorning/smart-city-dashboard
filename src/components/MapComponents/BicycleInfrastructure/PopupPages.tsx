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
import {
  PopupWrapper,
  ContentWrapper,
  HeadingWrapper,
  IconWrapper,
  FooterWrapper,
  FooterButton,
  HighlightedFooterButton,
} from './styles';
import ReactMarkdown from 'react-markdown';

import { CyclingIcon, ShopIcon, ParkingIcon } from '../../Icons';

interface IPopupPagesProps {
  name: string;
  contentParking?: JSX.Element;
  contentCycling?: JSX.Element;
  contentService?: JSX.Element;
}

const PopupPages = (props: IPopupPagesProps) => {
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
            {<p className="is-size-4">{'Parken ' + props.name}</p>}
          </HeadingWrapper>
          <ContentWrapper>{props.contentParking}</ContentWrapper>
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
            {<p className="is-size-5">{'Radwege ' + props.name}</p>}
          </HeadingWrapper>
          <ContentWrapper>{props.contentCycling}</ContentWrapper>
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
            {<p className="is-size-5">{'Läden ' + props.name}</p>}
          </HeadingWrapper>
          <ContentWrapper>{props.contentService}</ContentWrapper>
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

export default PopupPages;
