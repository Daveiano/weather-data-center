import {Precision} from "./scaling";

type DiagramBaseProps = {
  title?: string,
  height: string,
  data: dataItem[],
  precision?: Precision
};

type dataItem = {
  [key: string]: any,
  id: string,
  _id: string,
  time: number,
  timeParsed: string,
  temperature?: number,
  humidity?: number,
  pressure?: number,
  rain?: number,
  solar?: number,
  uvi?: number,
  gust?: number,
  wind?: number,
  wind_direction?: number,
  dew_point?: number,
  felt_temperature?: number,
  temperature_max?: number,
  temperature_min?: number,
  temperature_average?: number
}

export { DiagramBaseProps, dataItem };