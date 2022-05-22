import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    SELL_TOKENS_BEGIN,
    SELL_TOKENS_SUCCESS,
    SELL_TOKENS_FAILURE
} from './constants'

import { sellTokensForUser } from '../../../api/appApi'
import { contractAddress } from 'network';

export function sellTokens(data) {
    return async dispatch => {
        try {
            dispatch({
                type: SELL_TOKENS_BEGIN,
                data: { status: true }
            })
            const contract = contractAddress(data.web3.currentProvider.networkVersion)
            await sellTokensForUser(data.web3,contract)
            dispatch({
                type: SELL_TOKENS_SUCCESS,
                data: { status: false }
            })
        } catch (error) {
            console.log("error:",error)
            dispatch({
                type: SELL_TOKENS_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useSellTokens() {
    const dispatch = useDispatch();

    const { sellTokensPending, sellTokensError } = useSelector(state => ({
        sellTokensPending: state.stableyield.sellTokensPending,
        sellTokensError: state.stableyield.sellTokensError
    }))

    const boundAction = useCallback((data) => {
        dispatch(sellTokens(data))
    }, [dispatch])

    return {
        sellTokens: boundAction,
        sellTokensPending,
        sellTokensError
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case SELL_TOKENS_BEGIN:
            return {
                ...state,
                sellTokensPending: action.data.status
            }
        case SELL_TOKENS_SUCCESS:
            return {
                ...state,
                sellTokensPending: action.data.status
            }
        case SELL_TOKENS_FAILURE:
            return {
                ...state,
                sellTokensPending: action.data.status,
                sellTokensError: action.data.error
            }
        default:
            return state

    }
}