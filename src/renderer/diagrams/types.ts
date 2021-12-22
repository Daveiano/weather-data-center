type DiagramBaseProps = {
  title?: string,
  height: string,
  data: dataItem[]
};

type dataItem = {
  [key: string]: number | string,
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
  felt_temperature?: number
}

export { DiagramBaseProps, dataItem };