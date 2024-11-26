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

import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const Content = styled(ReactMarkdown)`
  > p {
    margin-bottom: 1rem;
  }
`;
function Info() {
  return (
    <React.Fragment>
      <div className="container is-fluid mt-5">
        <Content
          children={`
# Informationen
Dieses Dashboard ist eine Erweiterung des [Smart City Dashboards der Stadt Münster](https://dashboard.smartcity.ms/).
Es wurde von Lorenz Beck und Simge Özdal Oktay entwickelt. Weitere Informationen gibt es in dieser Publikation: https://www.mdpi.com/2071-1050/15/17/12829
        `}
        />
      </div>
    </React.Fragment>
  );
}

export default Info;
