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

// Function add info automatically creates a table for the popoup with the entries from feature.properties.attributes
export function addInfo(feature: any, layer: any) {
  let bIType = feature.properties.bike_infrastructure_type;
  let heading =
    "<p style='text-align:center; font-size:150%; font-weight:bold;'> " +
    bIType +
    ' </p>';
  // Create table if attributes are filled
  if (feature.properties?.attributes.length > 0) {
    let attributes = feature.properties.attributes;
    let html_table =
      heading +
      "<table class='table is-striped is-narrow'> <tbody> <tr> <th> Weitere Infos </th> <th> </th> <tr>";
    // loop through the dictionary to feed the table with rows
    attributes.forEach((attr: any) => {
      for (let key in attr) {
        let value = attr[key];
        let tr = ' <tr> <td> ' + key + '</td> <td> ' + value + '</td> </tr>';
        html_table = html_table + tr;
      }
    });
    // close the table
    html_table = html_table + ' </tbody> </table>';
    layer.bindPopup(html_table);
  } else if (feature.properties?.attributes.length === 0) {
    layer.bindPopup(heading);
  }
}
