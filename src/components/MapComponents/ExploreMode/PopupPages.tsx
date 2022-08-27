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

import React, { useState } from 'react';
import {
  PopupWrapper,
  ContentWrapper,
  HeadingWrapper,
  IconWrapper,
  FooterWrapper,
  FooterButton,
  HighlightedFooterButton,
} from './styles';

import { CyclingIcon, ShopIcon, ParkingIcon } from '../../Icons';

interface IPopupPagesProps {
  name: string;
  contentParking?: JSX.Element;
  contentCycling?: JSX.Element;
  contentService?: JSX.Element;
}

const PopupPages = (props: IPopupPagesProps) => {
  const [showParking, setShowParking] = useState(true);
  const [showCycling, setShowCycling] = useState(false);
  const [showService, setShowService] = useState(false);

  return (
    <>
      {showParking && (
        <PopupWrapper>
          <HeadingWrapper>
            <IconWrapper>
              <ParkingIcon />
            </IconWrapper>
            <p className="is-size-4 has-text-weight-semibold">
              Parken <br />
              <span className="is-size-4 has-text-weight-normal">
                in {props.name}
              </span>
            </p>
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
              Fahrradstraßen 2.0
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
            <p className="is-size-4 has-text-weight-semibold">
              Fahrradstraßen 2.0 <br />
              <span className="is-size-4 has-text-weight-normal">
                in {props.name}
              </span>
            </p>
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
              Fahrradstraßen 2.0
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
              <ShopIcon />
            </IconWrapper>
            {
              <p className="is-size-4 has-text-weight-semibold">
                Fahrradläden <br />
                <span className="is-size-4 has-text-weight-normal">
                  in {props.name}
                </span>
              </p>
            }
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
              Fahrradstraßen 2.0
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
