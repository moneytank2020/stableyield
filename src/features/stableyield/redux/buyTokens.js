import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BUY_TOKENS_BEGIN,
    BUY_TOKENS_SUCCESS,
    BUY_TOKENS_FAILURE
} from './constants'

import { buyTokensForUser } from '../../../api/appApi'

export function buyTokens(data) {
    return async dispatch => {
        try {
            dispatch({
                type: BUY_TOKENS_BEGIN,
                data: { status: true }
            })
            console.log("buying")
            var buyingTokens = await buyTokensForUser(data.web3, data.amount, data.referral)
           
            await buyingTokens.wait()
            dispatch({
                type: BUY_TOKENS_SUCCESS,
                data: { status: false }
            })
        } catch (error) {
            console.log("error:",error)
            dispatch({
                type: BUY_TOKENS_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useBuyTokens() {
    const dispatch = useDispatch();

    const { buyTokensPending, buyTokensError } = useSelector(state => ({
        buyTokensPending: state.stableyield.buyTokensPending,
        buyTokensError: state.stableyield.buyTokensError
    }))

    const boundAction = useCallback((data) => {
        dispatch(buyTokens(data))
    }, [dispatch])

    return {
        buyTokens: boundAction,
        buyTokensPending,
        buyTokensError
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case BUY_TOKENS_BEGIN:
            return {
                ...state,
                buyTokensPending: action.data.status
            }
        case BUY_TOKENS_SUCCESS:
            return {
                ...state,
                buyTokensPending: action.data.status
            }
        case BUY_TOKENS_FAILURE:
            return {
                ...state,
                buyTokensPending: action.data.status,
                buyTokensError: action.data.error
            }
        default:
            return state

    }
}