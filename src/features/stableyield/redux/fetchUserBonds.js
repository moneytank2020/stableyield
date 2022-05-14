import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FETCH_USER_BONDS_BEGIN,
    FETCH_USER_BONDS_SUCCESS,
    FETCH_USER_BONDS_FAILURE
} from './constants'

import { getUserBonds } from '../../../api/appApi'

export function fetchUserBonds(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_USER_BONDS_BEGIN,
                data: { status: true }
            })
            var userBonds = await getUserBonds(data.web3)
            dispatch({
                type: FETCH_USER_BONDS_SUCCESS,
                data: { status: false, userBonds: userBonds}
            })
        } catch (error) {
            console.log("error:",error)
            dispatch({
                type: FETCH_USER_BONDS_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useFetchUserBonds() {
    const dispatch = useDispatch();

    const { fetchUserBondsPending, fetchUserBondsError, fetchUserBondsValue } = useSelector(state => ({
        fetchUserBondsPending: state.stableyield.fetchUserBondsPending,
        fetchUserBondsError: state.stableyield.fetchUserBondsError,
        fetchUserBondsValue:state.stableyield.fetchUserBondsValue,
    }))

    const boundAction = useCallback((data) => {
        dispatch(fetchUserBonds(data))
    }, [dispatch])

    return {
        fetchUserBonds: boundAction,
        fetchUserBondsPending,
        fetchUserBondsError,
        fetchUserBondsValue
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case FETCH_USER_BONDS_BEGIN:
            return {
                ...state,
                fetchUserBondsPending: action.data.status
            }
        case FETCH_USER_BONDS_SUCCESS:
            return {
                ...state,
                fetchUserBondsPending: action.data.status,
                fetchUserBondsValue:action.data.taxFee,
            }
        case FETCH_USER_BONDS_FAILURE:
            return {
                ...state,
                fetchUserBondsPending: action.data.status,
                fetchUserBondsError: action.data.error
            }
        default:
            return state

    }
}