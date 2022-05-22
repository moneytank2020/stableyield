import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FETCH_USER_TOKEN_REWARD_BEGIN,
    FETCH_USER_TOKEN_REWARD_SUCCESS,
    FETCH_USER_TOKEN_REWARD_FAILURE
} from './constants'

import { getTokenReward } from '../../../api/appApi'
import { contractAddress } from 'network';

export function fetchUserTokenReward(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_USER_TOKEN_REWARD_BEGIN,
                data: { status: true }
            })
            const contract = contractAddress(data.web3.currentProvider.networkVersion)
            var userTokenReward = await getTokenReward(data.web3,contract)
            dispatch({
                type: FETCH_USER_TOKEN_REWARD_SUCCESS,
                data: { status: false, userTokenReward: userTokenReward }
            })
        } catch (error) {
            dispatch({
                type: FETCH_USER_TOKEN_REWARD_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useFetchUserTokenReward() {
    const dispatch = useDispatch();

    const { fetchUserTokenRewardPending, fetchUserTokenRewardError, fetchUserTokenRewardValue } = useSelector(state => ({
        fetchUserTokenRewardPending: state.stableyield.fetchUserTokenRewardPending,
        fetchUserTokenRewardError: state.stableyield.fetchUserTokenRewardError,
        fetchUserTokenRewardValue: state.stableyield.fetchUserTokenRewardValue,
    }))

    const boundAction = useCallback((data) => {
        dispatch(fetchUserTokenReward(data))
    }, [dispatch])

    return {
        fetchUserTokenReward: boundAction,
        fetchUserTokenRewardPending,
        fetchUserTokenRewardError,
        fetchUserTokenRewardValue
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case FETCH_USER_TOKEN_REWARD_BEGIN:
            return {
                ...state,
                fetchUserTokenRewardPending: action.data.status
            }
        case FETCH_USER_TOKEN_REWARD_SUCCESS:
            return {
                ...state,
                fetchUserTokenRewardPending: action.data.status,
                fetchUserTokenRewardValue: action.data.userTokenReward,
            }
        case FETCH_USER_TOKEN_REWARD_FAILURE:
            return {
                ...state,
                fetchUserTokenRewardPending: action.data.status,
                fetchUserTokenRewardError: action.data.error
            }
        default:
            return state

    }
}