  const initialState = {
    fetchFeesDone: false,
    fetchFeesPending: false,
    fetchApysDone: false,
    fetchApysPending: false,
    fetchApprovalPending:false,
    fetchNeedApproval:false,
    fetchHasApprovedPending:false,
    fetchHasApprovedError:false,
    fetchAprovalError:"",
    fetchBalancesDone: false,
    fetchBalancesPending: false,
    buyTokensPending: false,
    buyTokensError:"",
    fetchApyAndRatePending:false,
    fetchApyAndRateError:"",
    fetchApy:"0%",
    fetchRate:"0%",
    fetchTaxFeePending:false,
    fetchTaxFeeError:"",
    fetchTax:"0%",
    fetchUserBalancePending: false, 
    fetchUserBalanceError:"", 
    fetchUserBalanceValue:"0"
  }

  export default initialState;