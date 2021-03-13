const isLoadingAction = (loading: boolean) => ({
    loading,
    type: 'IS_LOADING'
  }),
  hasDataAction = (hasData: boolean) => ({
    hasData,
    type: 'HAS_DATA'
  });

export { isLoadingAction, hasDataAction };