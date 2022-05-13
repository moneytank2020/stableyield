import initialState from './initialState'
import { reducer as fetchApprovalReducer } from './fetchApproval'
import { reducer as fetchApyAndRateReducer } from './fetchApyAndRate'
import { reducer as fetchTaxFeeReducer } from './fetchTaxFee'

const reducers = [
    fetchApprovalReducer,
    fetchApyAndRateReducer,
    fetchTaxFeeReducer
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