const isLoadingAction = (loading: boolean) => ({
    loading,
    type: 'IS_LOADING'
  }),
  dataTemperatureAction = (dataTemperature: any[]) => ({
    dataTemperature,
    type: 'TEMPERATURE'
  });

export { isLoadingAction, dataTemperatureAction };