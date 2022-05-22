import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FETCH_APY_AND_RATE_BEGIN,
    FETCH_APY_AND_RATE_SUCCESS,
    FETCH_APY_AND_RATE_FAILURE
} from './constants'
import { contractAddress } from 'network';

import { getApyAndRate } from '../../../api/appApi'

export function fetchApyAndRate(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_APY_AND_RATE_BEGIN,
                data: { status: true }
            })
            const contract= contractAddress(data.web3.currentProvider.networkVersion)
            var getRatesAndApr = await getApyAndRate(data.web3,contract)
            dispatch({
                type: FETCH_APY_AND_RATE_SUCCESS,
                data: { status: false, apyAndRate: getRatesAndApr}
            })
        } catch (error) {
            dispatch({
                type: FETCH_APY_AND_RATE_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useFetchApyAndRate() {
    const dispatch = useDispatch();

    const { fetchApyAndRatePending, fetchApyAndRateError,fetchApy,fetchRate } = useSelector(state => ({
        fetchApyAndRatePending: state.stableyield.fetchApyAndRatePending,
        fetchApyAndRateError: state.stableyield.fetchApyAndRateError,
        fetchApy:state.stableyield.fetchApy,
        fetchRate:state.stableyield.fetchRate
    }))

    const boundAction = useCallback((data) => {
        dispatch(fetchApyAndRate(data))
    }, [dispatch])

    return {
        fetchApyAndRate: boundAction,
        fetchApyAndRatePending,
        fetchApyAndRateError,
        fetchApy,
        fetchRate
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case FETCH_APY_AND_RATE_BEGIN:
            return {
                ...state,
                fetchApyAndRatePending: action.data.status
            }
        case FETCH_APY_AND_RATE_SUCCESS:
            return {
                ...state,
                fetchApyAndRatePending: action.data.status,
                fetchApy:action.data.apyAndRate.apy,
                fetchRate:action.data.apyAndRate.rate
            }
        case FETCH_APY_AND_RATE_FAILURE:
            return {
                ...state,
                fetchApyAndRatePending: action.data.status,
                fetchApyAndRateError: action.data.error
            }
        default:
            return state

    }
}