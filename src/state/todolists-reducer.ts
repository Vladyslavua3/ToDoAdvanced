import {appActions, RequestStatusType} from 'app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ResultCode, todolistsAPI, TodolistType} from "api/todolist-api";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";
import {Todolist} from "Todolist";


const fetchTodolists = createAppAsyncThunk<any, any>
('todo/fetchTodo', async (arg, thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI

    try {

        dispatch(appActions.setAppStatus({status: 'loading'}))

        const res = await todolistsAPI.getTodolists()

        const todoLists = res.data

        dispatch(todolistsActions.setTodolists({todolists: res.data}))
        dispatch(appActions.setAppStatus({status: 'succeeded'}))

       return {todoLists}

    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})


const addTodoList = createAppAsyncThunk<{todolist: TodolistType},{title:string}>
('todo/addTodo', async (arg,thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI


    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.createTodolist(arg.title)

        dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
        dispatch(appActions.setAppStatus({status: 'succeeded'}))

        return {todolist: res.data.data.item}
    }catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})




const changeTodoListTitle = createAppAsyncThunk<{ id: string, title: string }, { id: string, title: string }>
('todo/changeTodoTitle', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI

    try {
        const res = await todolistsAPI.updateTodolist({id: arg.id, title: arg.title})

        dispatch(todolistsActions.changeTodolistTitle({id:arg.id,title:arg.title}))

        return {id:arg.id,title:arg.title}
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const removeTodolist = createAppAsyncThunk<{ id: string }, any>
('todo/removeTodo', async (arg, thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI

    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))

        dispatch(todolistsActions.changeTodolistEntityStatus({id: arg.id, entityStatus: 'loading'}))
        const res = await todolistsAPI.deleteTodolist(arg.id)
        if(res.data.resultCode === ResultCode.success){
            dispatch(todolistsActions.removeTodolist({id: arg.id}))

            dispatch(appActions.setAppStatus({status: 'succeeded'}))

            return arg
        }else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }

    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }


})


const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            const newTodolist: TodolistDomainType = {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
            state.unshift(newTodolist)
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const todo = state.find(todo => todo.id === action.payload.id)
            if (todo) {
                todo.title = action.payload.title
            }
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const todo = state.find(todo => todo.id === action.payload.id)
            if (todo) {
                todo.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
            const todo = state.find(todo => todo.id === action.payload.id)
            if (todo) {
                todo.entityStatus = action.payload.entityStatus
            }
        },
        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            // return action.payload.forEach(t => ({...t, filter: 'active', entityStatus: 'idle'}))
        },
        reset: (state, action: PayloadAction<{ initState:any }>) => {
            return action.payload.initState
        }
    },
    extraReducers:builder => {
        builder
            .addCase(fetchTodolists.fulfilled,(state, action)=>{
                state = action.payload.todolist
            })
            .addCase(addTodoList.fulfilled, (state, action)=>{
                const newTodolist: TodolistDomainType = {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
                state.unshift(newTodolist)
            })
    }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunk = {removeTodolist,fetchTodolists,addTodoList,changeTodoListTitle}


// thunks



// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
