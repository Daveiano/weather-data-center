const appReducerDefaultState = {
    loading: false,
    hasData: false
  },
  appReducer = (state = appReducerDefaultState, action: any) => {
    switch (action.type) {
      case 'IS_LOADING': {
        return Object.assign({}, state, { loading: action.loading });
      }
      case 'HAS_DATA': {
        return Object.assign({}, state, { hasData: action.hasData });
      }

      default:
        return state;
    }
  };

export { appReducerDefaultState, appReducer };