import initialState from './initialState'
import { reducer as fetchApprovalReducer } from './fetchApproval'
import { reducer as fetchApyAndRateReducer } from './fetchApyAndRate'
import { reducer as fetchTaxFeeReducer } from './fetchTaxFee'
import { reducer as fetchUserBalanceReducer } from './fetchUserBalance'

const reducers = [
    fetchApprovalReducer,
    fetchApyAndRateReducer,
    fetchTaxFeeReducer,
    fetchUserBalanceReducer
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