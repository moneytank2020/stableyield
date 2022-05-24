import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FETCH_USER_BALANCE_BEGIN,
    FETCH_USER_BALANCE_SUCCESS,
    FETCH_USER_BALANCE_FAILURE
} from './constants'

import { getUserTokenBalance } from '../../../api/appApi'
import { contractAddress } from 'network';

export function fetchUserBalance(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_USER_BALANCE_BEGIN,
                data: { status: true }
            })
            let web3 = data.web3
            let chainId = web3.currentProvider.chainId
            let networkId = web3.utils.isHex(chainId) ? web3.utils.hexToNumber(chainId) : chainId;
            const contract = contractAddress(networkId)
            var balance = await getUserTokenBalance(data.web3,contract)
            dispatch({
                type: FETCH_USER_BALANCE_SUCCESS,
                data: { status: false, balance: balance}
            })
        } catch (error) {
            console.log("error:",error)
            dispatch({
                type: FETCH_USER_BALANCE_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useFetchUserBalance() {
    const dispatch = useDispatch();

    const { fetchUserBalancePending, fetchUserBalanceError, fetchUserBalanceValue } = useSelector(state => ({
        fetchUserBalancePending: state.stableyield.fetchUserBalancePending,
        fetchUserBalanceError: state.stableyield.fetchUserBalanceError,
        fetchUserBalanceValue:state.stableyield.fetchUserBalanceValue,
    }))

    const boundAction = useCallback((data) => {
        dispatch(fetchUserBalance(data))
    }, [dispatch])

    return {
        fetchUserBalance: boundAction,
        fetchUserBalancePending,
        fetchUserBalanceError,
        fetchUserBalanceValue
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case FETCH_USER_BALANCE_BEGIN:
            return {
                ...state,
                fetchUserBalancePending: action.data.status
            }
        case FETCH_USER_BALANCE_SUCCESS:
            return {
                ...state,
                fetchUserBalancePending: action.data.status,
                fetchUserBalanceValue:action.data.balance,
            }
        case FETCH_USER_BALANCE_FAILURE:
            return {
                ...state,
                fetchUserBalancePending: action.data.status,
                fetchUserBalanceError: action.data.error
            }
        default:
            return state

    }
}