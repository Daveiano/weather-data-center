import queryString from 'query-string';
import moment from "moment";

const { has_data, end, start } = queryString.parse(window.location.search);

console.log('reducer', has_data);
console.log('reducer', end);
console.log('reducer', start);

const appReducerDefaultState = {
    loading: false,
    // @todo: Silly TS workaround.
    hasData: typeof has_data === "string" ? parseInt(has_data) > 0 : 0,
    numberOfDocuments: typeof has_data === "string" ? parseInt(has_data) : has_data,
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
  // @todo Simplify, just dispatch data and get everything from it.
  appReducer = (state = appReducerDefaultState, action: any) => {
    switch (action.type) {
      case 'IS_LOADING': {
        return Object.assign({}, state, { loading: action.loading });
      }
      case 'USER_HAS_DATA': {
        return Object.assign({}, state, {
          hasData: typeof action.userHasData === "string" ? parseInt(action.userHasData) > 0 : action.userHasData > 0,
          numberOfDocuments: typeof action.userHasData === "string" ? parseInt(action.userHasData) : action.userHasData
        });
      }
      case 'DATE': {
        return Object.assign({}, state, { date: {
            start: moment.unix(action.date[0]).format('DD-MM-YYYY'),
            end: moment.unix(action.date[1]).format('DD-MM-YYYY')
          }
        });
      }
      case 'DATA': {
        return Object.assign({}, state, {
          data: action.data,
          numberOfDocuments: action.data.length,
          hasData: action.data.length > 0,
          date: {
            start: moment.unix(action.data[0].time).format('DD-MM-YYYY'),
            end: moment.unix(action.data[action.data.length - 1].time).format('DD-MM-YYYY')
          },
          dateSetByUser: {
            start: moment.unix(action.data[0].time).format('DD-MM-YYYY'),
            end: moment.unix(action.data[action.data.length - 1].time).format('DD-MM-YYYY')
          }
        });
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