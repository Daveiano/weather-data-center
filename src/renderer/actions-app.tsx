import {dataItem} from "./diagrams/types";

const isLoadingAction = (loading: boolean): { loading: boolean, type: string } => ({
    loading,
    type: 'IS_LOADING'
  }),
  dataAction = (data: dataItem[]): { data: dataItem[], type: string } => ({
    data,
    type: 'DATA'
  }),
  userSetDateAction = (userSetDate: Date[]): { userSetDate: Date[], type: string } => ({
    userSetDate,
    type: 'USER_SET_DATE'
  }),
  dateAction = (date: Date[]): { date: Date[], type: string } => ({
    date,
    type: 'DATE'
  }),
  userHasDataAction = (userHasData: number): { userHasData: number, type: string } => ({
    userHasData,
    type: 'USER_HAS_DATA'
  });

export { isLoadingAction, dataAction, userSetDateAction, userHasDataAction, dateAction };