import queryString from 'query-string';

const { has_data, end, start } = queryString.parse(window.location.search);

const appReducerDefaultState = {
    loading: false,
    // TODO: Silly TS workaround...
    hasData: typeof has_data === "string" ? parseInt(has_data) > 0 : 0,
    numberOfDocuments: has_data,
    userDataDate: {
      start: start,
      end: end
    },
    date: {
      start: start,
      end: end
    },
    dataTemperature: [] as any[]
  },
  appReducer = (state = appReducerDefaultState, action: any) => {
    switch (action.type) {
      case 'IS_LOADING': {
        return Object.assign({}, state, { loading: action.loading });
      }
      case 'TEMPERATURE': {
        return Object.assign({}, state, { dataTemperature: action.dataTemperature });
      }

      default:
        return state;
    }
  };

export { appReducerDefaultState, appReducer };