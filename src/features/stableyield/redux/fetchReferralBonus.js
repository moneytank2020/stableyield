import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FETCH_REFERRAL_BONUS_BEGIN,
    FETCH_REFERRAL_BONUS_SUCCESS,
    FETCH_REFERRAL_BONUS_FAILURE
} from './constants'

import { getReferralBonus } from '../../../api/appApi'
import { contractAddress } from 'network';

export function fetchReferralBonus(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_REFERRAL_BONUS_BEGIN,
                data: { status: true }
            })
            const contract = contractAddress(data.web3.currentProvider.networkVersion)

            var bonus = await getReferralBonus(data.web3,contract)
            dispatch({
                type: FETCH_REFERRAL_BONUS_SUCCESS,
                data: { status: false, bonus: bonus}
            })
        } catch (error) {
            dispatch({
                type: FETCH_REFERRAL_BONUS_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useFetchReferralBonus() {
    const dispatch = useDispatch();

    const { fetchReferralBonusPending, fetchReferralBonusError, fetchReferralBonusValue } = useSelector(state => ({
        fetchReferralBonusPending: state.stableyield.fetchReferralBonusPending,
        fetchReferralBonusError: state.stableyield.fetchReferralBonusError,
        fetchReferralBonusValue:state.stableyield.fetchReferralBonusValue,
    }))

    const boundAction = useCallback((data) => {
        dispatch(fetchReferralBonus(data))
    }, [dispatch])

    return {
        fetchReferralBonus: boundAction,
        fetchReferralBonusPending,
        fetchReferralBonusError,
        fetchReferralBonusValue
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case FETCH_REFERRAL_BONUS_BEGIN:
            return {
                ...state,
                fetchReferralBonusPending: action.data.status
            }
        case FETCH_REFERRAL_BONUS_SUCCESS:
            return {
                ...state,
                fetchReferralBonusPending: action.data.status,
                fetchReferralBonusValue:action.data.bonus,
            }
        case FETCH_REFERRAL_BONUS_FAILURE:
            return {
                ...state,
                fetchReferralBonusPending: action.data.status,
                fetchReferralBonusError: action.data.error
            }
        default:
            return state

    }
}