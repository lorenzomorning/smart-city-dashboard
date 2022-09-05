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

import BaseWidgetComponent from '../components/BaseWidget';
import logobi from './../resources/cycling-dashboard.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.div`
  background-color: var(--scms-primary-blue);
  margin: 1rem;
  padding: 1rem;
  text-align: center;
  border-radius: 1rem;
  width: 9rem;
  height: 9rem;
  box-shadow: var(--scms-box-shadow);

  @media screen and (min-width: 769px) and (max-width: 960px) {
    width: 120px;
    height: 120px;
  }
`;

const Logo = styled.img`
  max-height: 100%;
  width: auto;
`;

const BicycleInfrastructureComponent = () => {
  return (
    <BaseWidgetComponent
      title="Rad-Infrastruktur"
      mapFeatureTag="bicycleinfrastructure"
      dataSource={`
Hier können Sie die Rad-Infrastruktur der Stadt Münster entdecken. Die Daten stammen von der OpenData Plattform OpenStreetMap und werden durch das Smart-City Dashboard so aufbereitet, dass sie in ihren Einzelheiten (z.B. Separarierte Radwege, Radwege-Netz, Fahrradstraßen 2.0, Parkeinheiten, Fahrradläden, Reparaturstationen, Wegweiser, Rad-Ampeln), sowie auch auf Stadtteil-Ebene erkundet werden können. Auf dieser einheitlichen Daten-Grundlage kann ein ergebnisorientierter Dialog zwischen der Stadt Münster und ihren Bürger*innen gefördert und gemeinsame Entscheidungen getroffen werden.

OpenStreetMap ist eine OpenData-Initiative, welche 2004 gegründet worden ist und heute das größte öffentliche Geoportal für allgemeine Infrastrukturen oder Landnutzungen darstellt. Alle Daten werden von Nutzer*innen und somit normalen Bürger*innen gemappt und geordnet. Daher kann der Datensatz für Münsters Rad-Infrastruktur keine Vollständigkeit garantieren, kann aber durch Sie selber um neue Objekte erweitert werden ([Einführung in OSM](https://wiki.openstreetmap.org/wiki/Main_Page)). Durch seine OpenData-Orientierung gibt es zahlreiche App-Anwendungen auch im Radverkehr, und -sport (komoot oder strava). 

Die Daten werden von der Plattform OpenStreetMap mittels der API [OverpassTurbo](https://overpass-turbo.eu/) abgerufen und anschließend kategorisiert und mit Attributen aufbereitet. Dieses Konzept und die anschließende Visulasierung wurde durch zwei Absolventen des Geoinformatik Institus Münster 2022 entwickelt.

Datenquelle: [openstreetmap.org](https://www.openstreetmap.org/#map=13/51.9631/7.6276)

Kontakt für inhaltliche Fragen: [Lorenz Beck - Geoinformatik Institut Münster](lorenz.beck@uni-muenster.de)
`}
    >
      <Container>
        <LogoContainer>
          <Logo src={logobi} alt="Logo Rad-Infrasrtuktur"></Logo>
        </LogoContainer>
        <p className="has-text-centered">
          Entdecken Sie Münsters Rad-Infrastruktur in seinen jeweiligen
          Einzelheiten und Stadtteilen.
        </p>
      </Container>
    </BaseWidgetComponent>
  );
};

export default BicycleInfrastructureComponent;
