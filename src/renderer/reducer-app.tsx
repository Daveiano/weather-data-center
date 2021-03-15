const appReducerDefaultState = {
    loading: false,
    hasData: false,
    numberOfDocuments: 0
  },
  appReducer = (state = appReducerDefaultState, action: any) => {
    switch (action.type) {
      case 'IS_LOADING': {
        return Object.assign({}, state, { loading: action.loading });
      }
      case 'HAS_DATA': {
        return Object.assign({}, state, {
          hasData: Boolean(action.hasData),
          numberOfDocuments: action.hasData
        });
      }

      default:
        return state;
    }
  };

export { appReducerDefaultState, appReducer };