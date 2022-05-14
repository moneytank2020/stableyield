import initialState from './initialState'
import { reducer as buyTokensReducer } from './buyTokens'
import { reducer as sellTokensReducer } from './sellTokens'
import { reducer as fetchApprovalReducer } from './fetchApproval'
import { reducer as fetchApyAndRateReducer } from './fetchApyAndRate'
import { reducer as fetchTaxFeeReducer } from './fetchTaxFee'
import { reducer as fetchUserBalanceReducer } from './fetchUserBalance'
import { reducer as fetchContractBalanceReducer } from './fetchContractBalance'
import { reducer as fetchUserBondsReducer } from './fetchUserBonds'

const reducers = [
    buyTokensReducer,
    sellTokensReducer,
    fetchApprovalReducer,
    fetchApyAndRateReducer,
    fetchTaxFeeReducer,
    fetchUserBalanceReducer,
    fetchContractBalanceReducer,
    fetchUserBondsReducer
]

export default function reducer(state = initialState, action) {
    let newState
    switch (action.type) {
        default:
            newState = state;
            break;
    }
    return reducers.reduce((s,r)=> r(s,action), newState)
}