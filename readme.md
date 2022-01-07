# Weather Data Center

[![Unit & integration tests](https://github.com/Daveiano/weather-data-center/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/Daveiano/weather-data-center/actions/workflows/unit-tests.yml)
[![End-to-end tests](https://github.com/Daveiano/weather-data-center/actions/workflows/e2e-tests.yml/badge.svg?branch=develop)](https://github.com/Daveiano/weather-data-center/actions/workflows/e2e-tests.yml)


## Introduction

Weather Data Center is an application written with TypeScript + React in an Electron environment. This way it is a
cross-platform Desktop application. The main purpose is to collect, organize, analyze and visualize weather data 
from your backyards weather station.

You need to export/backup the data from your weather station and import them as a .csv file into the app.

### Supported characteristics

* Temperature
* Pressure
* Humidity
* Wind direction
* Wind Speed
* Guest Speed
* Felt temperature
* Dew point temperature
* Rain
* Solar radiation
* UV Index

### Import file requirements

Currently, only .csv files with named headers are supported. This is likely to change and be configurable in a
future release. At the time your csv will need the following structure:

| time                                          | temperature | humidity | pressure | rain                       | solar   | uvi | wind    | wind_direction | gust    | dew_point | felt_temperature |
|-----------------------------------------------|-------------|----------|----------|----------------------------|---------|-----|---------|----------------|---------|-----------|------------------|
| 2022/1/30 7:21                                | 10          | 80       | 950      | 0                          | 100.4   | 3   | 15      | 303            | 25      | 8         | 10               |
| 2022/1/30 13:1                                | 15.7        | 75       | 951      | 0.9                        | 124.9   | 5   | 12      | 187            | 37      | 10        | 15.7             |
| ...                                           | ...         | ...      | ...      | ...                        | ...     | ... | ...     | ...            | ...     | ...       | ...              |
| YYYY/M/D k:m, e.g. 2022/1/30 7:21, k = 1 - 24 | in °C       | in %     | in hPa   | in mm, accumulated per day | in w/m² | UVI | in km/h | in degree      | in km/h | in °C     | in °C            |

### Screenshots

#### Front Page

<img align="center" alt="Weather Data Center Start Page Screenshot" src="https://raw.githubusercontent.com/Daveiano/weather-data-center/develop/src/main/__image_snapshots__/renderer-small-data-test-ts-start-the-app-with-a-small-set-of-data-overview-page-1-snap.png">

## Installation

Coming soon

## FAQ

Coming soon

## Development

### Upstream issues

* Carbon structure: components-react vs @carbon - https://github.com/carbon-design-system/carbon/issues/9540
* <s>Carbon DataTable sort all pages, not only current visible - https://github.com/carbon-design-system/carbon/issues/6373</s>
* <s>Carbon - Support React Link in SideNav - https://github.com/carbon-design-system/carbon/issues/2473</s>
* Nivo Annotations for line diagram (show min and max value for e.g. temperature) - https://github.com/plouc/nivo/issues/1857
* playwright: Filechooser not working - https://github.com/microsoft/playwright/issues/5013
* Carbon: \<button> cannot appear as a descendant of \<button> when using tooltips in table headers