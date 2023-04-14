import { Dispatch } from 'redux'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {authAPI} from "api/todolist-api";
import {authActions} from "features/auth/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";


const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export type AppInitialStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'



const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('app/initializeApp', async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(appActions.setAppInitialized({isInitialized: true}));
    }
})


const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppInitialized: (state, action: PayloadAction<{isInitialized: boolean}>) => {
            state.isInitialized = action.payload.isInitialized
        },
    },
})

export const appReducer = slice.reducer
export const appActions = slice.actions
export const appThunks = {initializeApp}


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
        } else {

        }

        dispatch(appActions.setAppInitialized({isInitialized: true}));
    })
}

