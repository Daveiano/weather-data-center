const isLoadingAction = (loading: boolean): { loading: boolean, type: string } => ({
    loading,
    type: 'IS_LOADING'
  }),
  dataAction = (data: any[]): { data: any[], type: string } => ({
    data,
    type: 'DATA'
  }),
  userSetDateAction = (userSetDate: Date[]): { userSetDate: Date[], type: string } => ({
    userSetDate,
    type: 'USER_SET_DATE'
  });

export { isLoadingAction, dataAction, userSetDateAction };