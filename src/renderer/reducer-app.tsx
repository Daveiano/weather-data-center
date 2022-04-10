import queryString from "query-string";
import moment from "moment";
import { dataItem } from "./diagrams/types";
import { ImportSettingsFormValues } from "./components/import-settings-modal";

interface RootState {
  loading: boolean;
  dateSetByUser: {
    start: string | string[];
    end: string | string[];
  };
  date: {
    start: string | string[];
    end: string | string[];
  };
  data: dataItem[] | [];
  dataFilteredPerTime: dataItem[] | [];
  config: ImportSettingsFormValues | null;
}

const { end, start } = queryString.parse(window.location.search);

const appReducerDefaultState: RootState = {
    loading: false,
    dateSetByUser: {
      start: start,
      end: end,
    },
    date: {
      start: start,
      end: end,
    },
    data: [],
    dataFilteredPerTime: [],
    config: null,
  },
  appReducer = (state = appReducerDefaultState, action: any): RootState => {
    switch (action.type) {
      case "IS_LOADING": {
        return Object.assign({}, state, { loading: action.loading });
      }
      case "CONFIG": {
        return Object.assign({}, state, { config: action.config });
      }
      case "DATE": {
        return Object.assign({}, state, {
          date: {
            start: moment.unix(action.date[0]).format("DD-MM-YYYY"),
            end: moment.unix(action.date[1]).format("DD-MM-YYYY"),
          },
        });
      }
      case "DATA": {
        if (action.data.length > 0) {
          return Object.assign({}, state, {
            data: action.data,
            date: {
              start: moment.unix(action.data[0].time).format("DD-MM-YYYY"),
              end: moment
                .unix(action.data[action.data.length - 1].time)
                .format("DD-MM-YYYY"),
            },
            dateSetByUser: {
              start: moment.unix(action.data[0].time).format("DD-MM-YYYY"),
              end: moment
                .unix(action.data[action.data.length - 1].time)
                .format("DD-MM-YYYY"),
            },
          });
        } else {
          return Object.assign({}, state, {
            dataFilteredPerTime: [],
            data: [],
            date: {
              start,
              end,
            },
            dateSetByUser: {
              start,
              end,
            },
          });
        }
      }
      case "DATA_FILTERED_TIME": {
        return Object.assign({}, state, { dataFilteredPerTime: action.data });
      }
      case "USER_SET_DATE": {
        return Object.assign({}, state, {
          dateSetByUser: {
            start: moment(action.userSetDate[0]).format("DD-MM-YYYY"),
            end: moment(action.userSetDate[1]).format("DD-MM-YYYY"),
          },
        });
      }

      default:
        return state;
    }
  };

export { appReducerDefaultState, appReducer };
