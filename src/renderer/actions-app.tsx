import {dataItem} from "./diagrams/types";

const isLoadingAction = (loading: boolean): { loading: boolean, type: string } => ({
    loading,
    type: 'IS_LOADING'
  }),
  dataAction = (data: dataItem[]): { data: dataItem[], type: string } => ({
    data,
    type: 'DATA'
  }),
  dataFilteredPerTimeAction = (data: dataItem[]): { data: dataItem[], type: string } => ({
    data,
    type: 'DATA_FILTERED_TIME'
  }),
  userSetDateAction = (userSetDate: Date[]): { userSetDate: Date[], type: string } => ({
    userSetDate,
    type: 'USER_SET_DATE'
  }),
  dateAction = (date: Date[]): { date: Date[], type: string } => ({
    date,
    type: 'DATE'
  });

export { isLoadingAction, dataAction, dataFilteredPerTimeAction, userSetDateAction, dateAction };