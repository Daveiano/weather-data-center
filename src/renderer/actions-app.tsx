import { dataItem } from "./diagrams/types";
import { ImportSettingsFormValues } from "./components/import-settings-modal";

/**
 * @todo Refactor to use @reduxjs/toolkit
 * @see https://redux-toolkit.js.org/api/createslice
 */

const isLoadingAction = (
    loading: boolean
  ): { loading: boolean; type: string } => ({
    loading,
    type: "IS_LOADING",
  }),
  dataAction = (data: dataItem[]): { data: dataItem[]; type: string } => ({
    data,
    type: "DATA",
  }),
  dataFilteredPerTimeAction = (
    data: dataItem[]
  ): { data: dataItem[]; type: string } => ({
    data,
    type: "DATA_FILTERED_TIME",
  }),
  userSetDateAction = (
    userSetDate: Date[]
  ): { userSetDate: Date[]; type: string } => ({
    userSetDate,
    type: "USER_SET_DATE",
  }),
  dateAction = (date: Date[]): { date: Date[]; type: string } => ({
    date,
    type: "DATE",
  }),
  configAction = (
    config: ImportSettingsFormValues
  ): { config: ImportSettingsFormValues; type: string } => ({
    config,
    type: "CONFIG",
  });

export {
  isLoadingAction,
  dataAction,
  dataFilteredPerTimeAction,
  userSetDateAction,
  dateAction,
  configAction,
};
