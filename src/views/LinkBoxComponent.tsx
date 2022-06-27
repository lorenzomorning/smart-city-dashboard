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
import { ComponentWrapper } from '../components/styles';

import logo from './../resources/cycling-dashboard.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LinkContainer = styled.div`
  background-color: var(--scms-primary-blue);
  margin: 1rem;
  padding: 1rem;
  text-align: center;
  border-radius: 1rem;
  width: 9rem;
  height: 9rem;
  box-shadow: var(--scms-box-shadow);

  a:link {
    color: white;
  }
  a:visited {
    color: white;
  }
  a:hover {
    color: #503c6e;
  }

  @media screen and (min-width: 769px) and (max-width: 960px) {
    width: 120px;
    height: 120px;
  }
`;

const LinkSemiBold = styled.a`
  font-weight: var(--scms-semi-bold);
`;

const Logo = styled.img`
  max-height: 100%;
  width: auto;
`;

const LinkBoxComponent = () => {
  return (
    <ComponentWrapper>
      <Container>
        <p className="is-size-5">Radfahr-Dashboard</p>
        <LinkContainer>
          <LinkSemiBold
            className="is-size-3"
            href={'https://bikemaps.org/@51.9608486,7.6330090,14z'}
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            Hier <Logo src={logo} alt="Smart City Münster Logo"></Logo>
          </LinkSemiBold>
        </LinkContainer>
        <p>finden Sie Münsters Dashboard zur Radinfrastruktur</p>
      </Container>
    </ComponentWrapper>
  );
};

export default LinkBoxComponent;
