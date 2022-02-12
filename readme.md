<img align="left" width="80" height="80" alt="Weather Data Center" src="https://raw.githubusercontent.com/Daveiano/weather-data-center/1.x/src/assets/weather-data-center-icon.png">

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

### Import file & App settings

Currently, only .csv files with named headers are supported. You can manage the header names and the units within
the app settings. You can also configure the input date and time format (this is important because various personal
weather stations backup their data in different date formats). For the rain, you need to provide the data in a form 
where the data is accumulated per day, so the last entry of the day is the total amount of rain. See the
[Docs](https://daveiano.github.io/weather-data-center/manual.html) for more info.

### Screenshots

#### Front Page

<img align="center" alt="Weather Data Center Start Page Screenshot" src="https://raw.githubusercontent.com/Daveiano/weather-data-center/develop/src/main/__image_snapshots__/renderer-small-data-test-ts-start-the-app-with-a-small-set-of-data-overview-page-1-snap.png">

## [Manual](https://daveiano.github.io/weather-data-center/manual.html)

## Development

### Upstream issues

* Carbon structure: components-react vs @carbon - https://github.com/carbon-design-system/carbon/issues/9540
* <s>Carbon DataTable sort all pages, not only current visible - https://github.com/carbon-design-system/carbon/issues/6373</s>
* <s>Carbon - Support React Link in SideNav - https://github.com/carbon-design-system/carbon/issues/2473</s>
* Nivo Annotations for line diagram (show min and max value for e.g. temperature) - https://github.com/plouc/nivo/issues/1857
* <s>playwright: Filechooser not working - https://github.com/microsoft/playwright/issues/5013</s>
* Carbon: \<button> cannot appear as a descendant of \<button> when using tooltips in table headers