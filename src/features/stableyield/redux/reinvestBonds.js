import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    REINVEST_BONDS_BEGIN,
    REINVEST_BONDS_SUCCESS,
    REINVEST_BONDS_FAILURE
} from './constants'

import { reInvestUserBonds } from '../../../api/appApi'

export function reInvestBonds(data) {
    return async dispatch => {
        try {
            dispatch({
                type: REINVEST_BONDS_BEGIN,
                data: { status: true }
            })
            await reInvestUserBonds(data.web3, data.referral)
            dispatch({
                type: REINVEST_BONDS_SUCCESS,
                data: { status: false }
            })
        } catch (error) {
            console.log("error:",error)
            dispatch({
                type: REINVEST_BONDS_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useReInvestBonds() {
    const dispatch = useDispatch();

    const { reInvestBondsPending, reInvestBondsError } = useSelector(state => ({
        reInvestBondsPending: state.stableyield.reInvestBondsPending,
        reInvestBondsError: state.stableyield.reInvestBondsError
    }))

    const boundAction = useCallback((data) => {
        dispatch(reInvestBonds(data))
    }, [dispatch])

    return {
        reInvestBonds: boundAction,
        reInvestBondsPending,
        reInvestBondsError
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case REINVEST_BONDS_BEGIN:
            return {
                ...state,
                reInvestBondsPending: action.data.status
            }
        case REINVEST_BONDS_SUCCESS:
            return {
                ...state,
                reInvestBondsPending: action.data.status
            }
        case REINVEST_BONDS_FAILURE:
            return {
                ...state,
                reInvestBondsPending: action.data.status,
                reInvestBondsError: action.data.error
            }
        default:
            return state

    }
}