  const initialState = {
    fetchFeesDone: false,
    fetchFeesPending: false,
    fetchApysDone: false,
    fetchApysPending: false,
    fetchApprovalPending:false,
    isApproved:false,
    fetchHasApprovedPending:false,
    fetchHasApprovedError:false,
    fetchAprovalError:"",
    fetchBalancesDone: false,
    fetchBalancesPending: false,
    buyTokensPending: false,
    buyTokensError:"",
    sellTokensPending:false, 
    sellTokensError:"",
    fetchApyAndRatePending:false,
    fetchApyAndRateError:"",
    fetchApy:"0%",
    fetchRate:"0%",
    fetchTaxFeePending:false,
    fetchTaxFeeError:"",
    fetchTax:"0%",
    fetchCharityFee:"0%",
    fetchUserBalancePending: false, 
    fetchUserBalanceError:"", 
    fetchUserBalanceValue:"0",
    fetchContractBalancePending:false, 
    fetchContractBalanceError:"", 
    fetchContractBalanceValue:"0",
    fetchUserBondsPending:false,
    fetchUserBondsError:"",
    fetchUserBondsValue:"0.0",
    fetchBondsForTokensPending:false,
    fetchBondsForTokensError:"",
    fetchBondsForTokensValue:"0.0",
    fetchUserTokenRewardPending:false, 
    fetchUserTokenRewardError:"", 
    fetchUserTokenRewardValue:"0",
  }

  export default initialState;