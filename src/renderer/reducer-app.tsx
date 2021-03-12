const appReducerDefaultState = {
    loading: false,
  },
  appReducer = (state = appReducerDefaultState, action: any) => {
    switch (action.type) {
      case 'IS_LOADING': {
        return Object.assign({}, state, { loading: action.loading });
      }

      default:
        return state;
    }
  };

export { appReducerDefaultState, appReducer };