import queryString from 'query-string';
import moment from "moment";

const { has_data, end, start } = queryString.parse(window.location.search);

const appReducerDefaultState = {
    loading: false,
    // @todo: Silly TS workaround.
    hasData: typeof has_data === "string" ? parseInt(has_data) > 0 : 0,
    numberOfDocuments: has_data,
    dateSetByUser: {
      start: start,
      end: end
    },
    date: {
      start: start,
      end: end
    },
    data: [] as any[]
  },
  appReducer = (state = appReducerDefaultState, action: any) => {
    switch (action.type) {
      case 'IS_LOADING': {
        return Object.assign({}, state, { loading: action.loading });
      }
      case 'DATA': {
        return Object.assign({}, state, { data: action.data });
      }
      case 'USER_SET_DATE': {
        return Object.assign({}, state, { dateSetByUser: {
            start: moment(action.userSetDate[0]).format('DD-MM-YYYY'),
            end: moment(action.userSetDate[1]).format('DD-MM-YYYY')
          }
        });
      }

      default:
        return state;
    }
  };

export { appReducerDefaultState, appReducer };