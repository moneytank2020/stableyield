import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FETCH_BONDS_FOR_TOKEN_BEGIN,
    FETCH_BONDS_FOR_TOKEN_SUCCESS,
    FETCH_BONDS_FOR_TOKEN_FAILURE
} from './constants'

import { getBondsForTokens } from '../../../api/appApi'
import { contractAddress } from 'network';

export function fetchBondsForTokens(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_BONDS_FOR_TOKEN_BEGIN,
                data: { status: true }
            })
            var bonds = 0
            if(data.amount > 0){
                const contract = contractAddress(data.web3.currentProvider.networkVersion)
                bonds = await getBondsForTokens(data.web3, data.amount, contract)
            }
            dispatch({
                type: FETCH_BONDS_FOR_TOKEN_SUCCESS,
                data: { status: false, bonds: bonds}
            })
        } catch (error) {
            console.log("error:",error)
            dispatch({
                type: FETCH_BONDS_FOR_TOKEN_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useFetchBondsForTokens() {
    const dispatch = useDispatch();

    const { fetchBondsForTokensPending, fetchBondsForTokensError, fetchBondsForTokensValue } = useSelector(state => ({
        fetchBondsForTokensPending: state.stableyield.fetchBondsForTokensPending,
        fetchBondsForTokensError: state.stableyield.fetchBondsForTokensError,
        fetchBondsForTokensValue:state.stableyield.fetchBondsForTokensValue,
    }))

    const boundAction = useCallback((data) => {
        dispatch(fetchBondsForTokens(data))
    }, [dispatch])

    return {
        fetchBondsForTokens: boundAction,
        fetchBondsForTokensPending,
        fetchBondsForTokensError,
        fetchBondsForTokensValue
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case FETCH_BONDS_FOR_TOKEN_BEGIN:
            return {
                ...state,
                fetchBondsForTokensPending: action.data.status
            }
        case FETCH_BONDS_FOR_TOKEN_SUCCESS:
            return {
                ...state,
                fetchBondsForTokensPending: action.data.status,
                fetchBondsForTokensValue:action.data.bonds,
            }
        case FETCH_BONDS_FOR_TOKEN_FAILURE:
            return {
                ...state,
                fetchBondsForTokensPending: action.data.status,
                fetchBondsForTokensError: action.data.error
            }
        default:
            return state

    }
}