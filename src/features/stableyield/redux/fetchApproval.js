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

export function fetchApproval(data) {
    return async dispatch => {
        try {
            dispatch({
                type: FETCH_APPROVAL_BEGIN,
                data: { status: true }
            })
            await approve(data.web3)
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
    const { fetchApprovalPending, fetchApprovalError, fetchHasApprovedPending, fetchHasApprovedError, fetchNeedApproval } = useSelector(state => ({
        fetchApprovalPending: state.stableyield.fetchApprovalPending,
        fetchApprovalError: state.stableyield.fetchApprovalError,
        fetchHasApprovedPending: state.stableyield.fetchHasApprovedPending,
        fetchHasApprovedError: state.stableyield.fetchHasApprovedError,
        fetchNeedApproval: state.stableyield.fetchNeedApproval
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
        fetchNeedApproval
    }
}

export function reducer(state, action) {
    console.log("appprove success:", action.type)
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
                fetchNeedApproval: action.data.hasApproved
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
                fetchNeedApproval: action.data.hasApproved
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