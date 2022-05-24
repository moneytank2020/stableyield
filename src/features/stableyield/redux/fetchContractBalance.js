import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FETCH_CONTRACT_BALANCE_BEGIN,
    FETCH_CONTRACT_BALANCE_SUCCESS,
    FETCH_CONTRACT_BALANCE_FAILURE
} from './constants'

import { getContractTokenBalance } from '../../../api/appApi'
import { contractAddress } from 'network';

export function fetchContractBalance(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_CONTRACT_BALANCE_BEGIN,
                data: { status: true }
            })
            let web3 = data.web3
            let chainId = web3.currentProvider.chainId
            let networkId = web3.utils.isHex(chainId) ? web3.utils.hexToNumber(chainId) : chainId;
            const contract = contractAddress(networkId)
            var balance = await getContractTokenBalance(data.web3,contract)
            dispatch({
                type: FETCH_CONTRACT_BALANCE_SUCCESS,
                data: { status: false, balance: balance}
            })
        } catch (error) {
            dispatch({
                type: FETCH_CONTRACT_BALANCE_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useFetchContractBalance() {
    const dispatch = useDispatch();

    const { fetchContractBalancePending, fetchContractBalanceError, fetchContractBalanceValue } = useSelector(state => ({
        fetchContractBalancePending: state.stableyield.fetchContractBalancePending,
        fetchContractBalanceError: state.stableyield.fetchContractBalanceError,
        fetchContractBalanceValue:state.stableyield.fetchContractBalanceValue,
    }))

    const boundAction = useCallback((data) => {
        dispatch(fetchContractBalance(data))
    }, [dispatch])

    return {
        fetchContractBalance: boundAction,
        fetchContractBalancePending,
        fetchContractBalanceError,
        fetchContractBalanceValue
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case FETCH_CONTRACT_BALANCE_BEGIN:
            return {
                ...state,
                fetchContractBalancePending: action.data.status
            }
        case FETCH_CONTRACT_BALANCE_SUCCESS:
            return {
                ...state,
                fetchContractBalancePending: action.data.status,
                fetchContractBalanceValue:action.data.balance,
            }
        case FETCH_CONTRACT_BALANCE_FAILURE:
            return {
                ...state,
                fetchContractBalancePending: action.data.status,
                fetchContractBalanceError: action.data.error
            }
        default:
            return state

    }
}