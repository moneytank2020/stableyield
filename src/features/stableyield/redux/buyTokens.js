import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BUY_TOKENS_BEGIN,
    BUY_TOKENS_SUCCESS,
    BUY_TOKENS_FAILURE
} from './constants'

import { buyTokens } from '../../../api/appApi'

export function buyTokens(data) {
    return async dispatch => {
        try {
            dispatch({
                type: BUY_TOKENS_BEGIN,
                data: { status: true }
            })
            var buyingTokens = await buyTokens(data.amount, data.referral)
            await buyingTokens.wait()
            dispatch({
                type: BUY_TOKENS_SUCCESS,
                data: { status: false }
            })
        } catch (error) {
            dispatch({
                type: BUY_TOKENS_FAILED,
                data: { status: false, error: error }
            })
        }
    }
}

export function useBuyToken() {
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
            data = action.data
            return {
                ...state,
                buyTokensPending: data.status
            }
        case BUY_TOKENS_SUCCESS:
            data = action.data
            return {
                ...state,
                buyTokensPending: data.status
            }
        case BUY_TOKENS_FAILURE:
            data = action.data
            return {
                ...state,
                buyTokensPending: data.status,
                buyTokensError: data.error
            }
        default:
            return state

    }
}