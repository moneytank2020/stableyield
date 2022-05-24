import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FETCH_APPROVAL_BEGIN,
    FETCH_APPROVAL_SUCCESS,
    FETCH_APPROVAL_FAILURE,
    FETCH_HAS_APPROVED_BEGIN,
    FETCH_HAS_APPROVED_SUCCESS,
    FETCH_HAS_APPROVED_FAILURE
} from './constants'

import { hasApproved, approve } from '../../../api/appApi';
import { contractAddress } from 'network';


export function fetchApproval(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_APPROVAL_BEGIN,
                data: { status: true }
            })
            let web3 = data.web3
            let chainId = web3.currentProvider.chainId
            let networkId = web3.utils.isHex(chainId) ? web3.utils.hexToNumber(chainId) : chainId;
            const contract = contractAddress(networkId)
            await approve(data.web3,contract)
            dispatch({
                type: FETCH_APPROVAL_SUCCESS,
                data: { status: false, hasApproved: true }
            })
        } catch (error) {
            dispatch({
                type: FETCH_APPROVAL_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}

export function fetchHasApproved(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_HAS_APPROVED_BEGIN,
                data: { status: true }
            })
            var HasApproved = await hasApproved(data.web3)
            if (HasApproved) {
                dispatch({
                    type: FETCH_HAS_APPROVED_SUCCESS,
                    data: { status: false, hasApproved: true }
                })
            } else {
                dispatch({
                    type: FETCH_HAS_APPROVED_SUCCESS,
                    data: { status: false, hasApproved: false }
                })
            }
        } catch (error) {
            dispatch({
                type: FETCH_HAS_APPROVED_FAILURE,
                data: { status: false, error: error }
            })
        }
    }
}


export function useFetchApproval() {
    const dispatch = useDispatch();
    const { fetchApprovalPending, fetchApprovalError, fetchHasApprovedPending, fetchHasApprovedError, isApproved } = useSelector(state => ({
        fetchApprovalPending: state.stableyield.fetchApprovalPending,
        fetchApprovalError: state.stableyield.fetchApprovalError,
        fetchHasApprovedPending: state.stableyield.fetchHasApprovedPending,
        fetchHasApprovedError: state.stableyield.fetchHasApprovedError,
        isApproved: state.stableyield.isApproved
    }))

    const boundAction = useCallback((data) => {
        dispatch(fetchApproval(data))
    }, [dispatch])


    const boundcheckApprovalAction = useCallback((data) => {
        dispatch(fetchHasApproved(data))
    }, [dispatch])

    return {
        fetchApproval: boundAction,
        fetchHasApproved: boundcheckApprovalAction,
        fetchApprovalPending,
        fetchApprovalError,
        fetchHasApprovedPending,
        fetchHasApprovedError,
        isApproved
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case FETCH_APPROVAL_BEGIN:
            return {
                ...state,
                fetchApprovalPending: action.data.status
            }
        case FETCH_APPROVAL_SUCCESS:
            return {
                ...state,
                fetchApprovalPending: action.data.status,
                isApproved: action.data.hasApproved
            }
        case FETCH_APPROVAL_FAILURE:
            return {
                ...state,
                fetchApprovalPending: action.data.status,
                fetchApprovalError: action.data.error
            }
        case FETCH_HAS_APPROVED_BEGIN:
            return {
                ...state,
                fetchHasApprovedPending: action.data.status
            }
        case FETCH_HAS_APPROVED_SUCCESS:
            return {
                ...state,
                fetchHasApprovedPending: action.data.status,
                isApproved: action.data.hasApproved
            }
        case FETCH_HAS_APPROVED_FAILURE:
            return {
                ...state,
                fetchHasApprovedPending: action.data.status,
                fetchApprovalError: action.data.error
            }
        default:
            return state
    }
}