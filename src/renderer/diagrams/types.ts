type DiagramBaseProps= {
  title: string,
  height: string,
  data: dataItem[]
};

type dataItem = {
  time: number,
  timeParsed: string,
  temperature?: number,
  humidity?: number,
  pressure?: number,
  rain?: number,
  solar?: number,
  uvi?: string,
  gust?: number,
  wind?: number,
  wind_direction?: number
}

export { DiagramBaseProps, dataItem };