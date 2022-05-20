import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FETCH_TAX_FEE_BEGIN,
    FETCH_TAX_FEE_SUCCESS,
    FETCH_TAX_FEE_FAILURE
} from './constants'

import { getFees } from '../../../api/appApi'

export function fetchTaxFee(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_TAX_FEE_BEGIN,
                data: { status: true }
            })
            var fees = await getFees(data.web3)
            console.log("fees:", fees)
            dispatch({
                type: FETCH_TAX_FEE_SUCCESS,
                data: { status: false, fees: fees }
            })
        } catch (error) {
            console.log("error:", error)
            dispatch({
                type: FETCH_TAX_FEE_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function useFetchTaxFee() {
    const dispatch = useDispatch();

    const { fetchTaxFeePending, fetchTaxFeeError, fetchTax, fetchCharityFee } = useSelector(state => ({
        fetchTaxFeePending: state.stableyield.fetchTaxFeePending,
        fetchTaxFeeError: state.stableyield.fetchTaxFeeError,
        fetchTax: state.stableyield.fetchTax,
        fetchCharityFee: state.stableyield.fetchCharityFee
    }))

    const boundAction = useCallback((data) => {
        dispatch(fetchTaxFee(data))
    }, [dispatch])

    return {
        fetchTaxFee: boundAction,
        fetchTaxFeePending,
        fetchTaxFeeError,
        fetchTax,
        fetchCharityFee
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
                fetchTax: `${action.data.fees.taxFeeVal}%`,
                fetchCharityFee: `${action.data.fees.charFeeVal}%`,
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