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
  pressure?: number
}

export { DiagramBaseProps, dataItem };