import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FETCH_TAX_FEE_BEGIN,
    FETCH_TAX_FEE_SUCCESS,
    FETCH_TAX_FEE_FAILURE
} from './constants'

import { getTaxFee } from '../../../api/appApi'

export function fetchTaxFee(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_TAX_FEE_BEGIN,
                data: { status: true }
            })
            var taxFee = await getTaxFee(data.web3)
            dispatch({
                type: FETCH_TAX_FEE_SUCCESS,
                data: { status: false, taxFee: taxFee}
            })
        } catch (error) {
            console.log("error:",error)
            dispatch({
                type: FETCH_TAX_FEE_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useFetchTaxFee() {
    const dispatch = useDispatch();

    const { fetchTaxFeePending, fetchTaxFeeError, fetchTax } = useSelector(state => ({
        fetchTaxFeePending: state.stableyield.fetchTaxFeePending,
        fetchTaxFeeError: state.stableyield.fetchTaxFeeError,
        fetchTax:state.stableyield.fetchTax,
    }))

    const boundAction = useCallback((data) => {
        dispatch(fetchTaxFee(data))
    }, [dispatch])

    return {
        fetchTaxFee: boundAction,
        fetchTaxFeePending,
        fetchTaxFeeError,
        fetchTax
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case FETCH_TAX_FEE_BEGIN:
            return {
                ...state,
                fetchTaxFeePending: action.data.status
            }
        case FETCH_TAX_FEE_SUCCESS:
            return {
                ...state,
                fetchTaxFeePending: action.data.status,
                fetchTax:action.data.taxFee,
            }
        case FETCH_TAX_FEE_FAILURE:
            return {
                ...state,
                fetchTaxFeePending: action.data.status,
                fetchTaxFeeError: action.data.error
            }
        default:
            return state

    }
}