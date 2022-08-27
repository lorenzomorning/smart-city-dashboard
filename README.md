# Smart City Münster Dashboard

[![Netlify Status](https://api.netlify.com/api/v1/badges/a3b0b564-6d90-4bbf-9b5f-2f5fd46d5a97/deploy-status)](https://app.netlify.com/sites/smart-city-dashboard/deploys)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Copyright (C) 2022 Reedu GmbH & Co. KG

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

# Modifications in this forked version

This forked version extends the original Smart City Dashboard by integrating cycling infrastructure data from OpenStreetMap. This integration covers the daily automated data collection via Overpass Turbo and a following data categorization, description with attributes and an aggregation of cycling data for administrative areas.

Remaining improvements are:

- More meaningful aggregation of cycling paths and services in the Stadtteil-Modus
- Better connection of the popup graphics of administrative areas in the Stadtteil-Modus and the data visualization in the background (e.g hovering coverage of service in the popup should trigger a corresponding visulization in the back)
- Data insights on the cycling infrastructure component at the home page

Smaller style improvements:

- Remaining translations to German
- Layer Control with corresponding symbols
- Animated icon on the cycling infrastructure component at the home page
