//
// import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
// import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import { clearTasksAndTodolists } from 'common/actions/common.actions';
// import {appActions} from "app/app-reducer";
// import {todolistsActions, todolistsThunk} from "features/TodolistsList/todolists-reducer";
// import {ResultCode, TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "common/api/todolist-api";
// import {handleServerAppError, handleServerNetworkError} from "common/utils";
//
//
//
// interface FetchTaskReturnedType {
//     tasks:TaskType[],
//     todolistId:string
// }
//
//
// const fetchTasks = createAppAsyncThunk<FetchTaskReturnedType,string>
// ('tasks/fetchTasks', async (todolistId, thunkAPI) => {
//
//     const {dispatch,rejectWithValue} = thunkAPI
//
//     try {
//         dispatch(appActions.setAppStatus({status: 'loading'}))
//
//         const res = await todolistsAPI.getTasks(todolistId)
//         const tasks = res.data.items
//
//         dispatch(appActions.setAppStatus({status: 'succeeded'}))
//
//         return {tasks,todolistId}
//     }
//     catch (e) {
//         handleServerNetworkError(e, dispatch)
//         return rejectWithValue(null)
//     }
// })
//
//
// export type AddTaskArgType = {
//     title: string,
//     todolistId: string
// }
//
// const addTask = createAppAsyncThunk<{task:TaskType},AddTaskArgType>
// ('tasks/addTask',async (arg,thunkAPI) => {
//
//     const {dispatch,rejectWithValue} = thunkAPI
//
//     try {
//         dispatch(appActions.setAppStatus({status: 'loading'}))
//
//         const res = await todolistsAPI.createTask(arg)
//         if (res.data.resultCode === ResultCode.success) {
//             const task = res.data.data.item
//
//             dispatch(appActions.setAppStatus({status: 'succeeded'}))
//
//             return {task}
//         }else {
//             handleServerAppError(res.data, dispatch);
//             return rejectWithValue(null)
//         }
//
//
//     }catch (e) {
//         handleServerNetworkError(e, dispatch)
//         return rejectWithValue(null)
//     }
//
// })
//
// export type UpdateTaskArgType = {
//     todolistId:string
//     taskId:string
//     domainModel:UpdateDomainTaskModelType
// }
//
//
// const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
// ('tasks/updateTask', async (arg, thunkAPI) => {
//     const {dispatch, rejectWithValue, getState} = thunkAPI
//     try {
//         dispatch(appActions.setAppStatus({status: 'loading'}))
//         const state = getState()
//         const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
//         if (!task) {
//             dispatch(appActions.setAppError({error: 'Task not found'}))
//             return rejectWithValue(null)
//         }
//
//         const apiModel: UpdateTaskModelType = {
//             deadline: task.deadline,
//             description: task.description,
//             priority: task.priority,
//             startDate: task.startDate,
//             title: task.title,
//             status: task.status,
//             ...arg.domainModel
//         }
//
//         const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
//         if (res.data.resultCode === ResultCode.success) {
//             dispatch(appActions.setAppStatus({status: 'succeeded'}))
//             return arg
//         } else {
//             handleServerAppError(res.data, dispatch);
//             return rejectWithValue(null)
//         }
//     } catch (e) {
//         handleServerNetworkError(e, dispatch)
//         return rejectWithValue(null)
//     }
// })
//
//
// export type RemoveTaskType = {
//     taskId: string
//     todolistId:string
// }
//
// const removeTask = createAppAsyncThunk<RemoveTaskType, RemoveTaskType>
// ('tasks/removeTask', async (arg, thunkAPI) => {
//     const {dispatch, rejectWithValue} = thunkAPI
//     try {
//         dispatch(appActions.setAppStatus({status: 'loading'}))
//         const res = await todolistsAPI.deleteTask(arg)
//         if (res.data.resultCode === ResultCode.success) {
//             dispatch(appActions.setAppStatus({status: 'succeeded'}))
//             return arg
//         } else {
//             handleServerAppError(res.data, dispatch);
//             return rejectWithValue(null)
//         }
//     } catch (e) {
//         handleServerNetworkError(e, dispatch)
//         return rejectWithValue(null)
//     }
// })
// const initialState: TasksStateType = {}
//
//
// const slice = createSlice({
//     name: 'tasks',
//     initialState,
//     reducers: {},
//     extraReducers: builder => {
//         builder
//             .addCase(fetchTasks.fulfilled, (state, action) => {
//                 state[action.payload.todolistId] = action.payload.tasks
//             })
//             .addCase(addTask.fulfilled, (state, action) => {
//                 const tasks = state[action.payload.task.todoListId]
//                 tasks.unshift(action.payload.task)
//             })
//             .addCase(updateTask.fulfilled, (state, action) => {
//                 const tasks = state[action.payload.todolistId]
//                 const index = tasks.findIndex(t => t.id === action.payload.taskId)
//                 if (index !== -1) {
//                     tasks[index] = {...tasks[index], ...action.payload.domainModel}
//                 }
//             })
//             .addCase(removeTask.fulfilled, (state, action) => {
//                 const tasks = state[action.payload.todolistId]
//                 const index = tasks.findIndex(t => t.id === action.payload.taskId)
//                 if (index !== -1) tasks.splice(index, 1)
//             })
//             .addCase(todolistsThunk.addTodoList.fulfilled, (state, action) => {
//                 state[action.payload.todolist.id] = []
//             })
//             .addCase(todolistsThunk.removeTodolist.fulfilled, (state, action) => {
//                 delete state[action.payload.id]
//             })
//             .addCase(todolistsThunk.fetchTodolists.fulfilled, (state, action) => {
//                 action.payload.todolists.forEach((tl:any) => {
//                     state[tl.id] = []
//                 })
//             })
//             .addCase(clearTasksAndTodolists, () => {
//                 return {}
//             })
//     }
// })
//
// export const tasksReducer = slice.reducer
// export const tasksActions = slice.actions
// export const tasksThunk = {fetchTasks,addTask,updateTask,removeTask}
//
//
// // types
// export type UpdateDomainTaskModelType = {
//     title?: string
//     description?: string
//     status?: TaskStatuses
//     priority?: TaskPriorities
//     startDate?: string
//     deadline?: string
// }
// export type TasksStateType = {
//     [key: string]: Array<TaskType>
// }
import { createSlice } from '@reduxjs/toolkit';
import { todolistsThunks } from 'features/TodolistsList/todolists-reducer';
import {
    AddTaskArgType,
    RemoveTaskArgType,
    TaskType,
    todolistsApi,
    UpdateTaskArgType,
    UpdateTaskModelType
} from 'features/TodolistsList/todolist.api';
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils';
import { ResultCode, TaskPriorities, TaskStatuses } from 'common/enums';
import { clearTasksAndTodolists } from 'common/actions';
import {appActions} from "app/app-reducer";


const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>
('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsApi.getTasks(todolistId)
        const tasks = res.data.items
        console.log(tasks)
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {tasks, todolistId}
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>
('tasks/addTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsApi.createTask(arg)
        if (res.data.resultCode === ResultCode.Success) {
            const task = res.data.data.item
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {task}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})


const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const state = getState()
        const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
        if (!task) {
            dispatch(appActions.setAppError({error: 'Task not found in the state'}))
            return rejectWithValue(null)
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.domainModel
        }

        const res = await todolistsApi.updateTask(arg.todolistId, arg.taskId, apiModel)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return arg
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>
('tasks/removeTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsApi.deleteTask(arg)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return arg
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift(action.payload.task)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
            .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
            .addCase(clearTasksAndTodolists, () => {
                return {}
            })
    }
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasks, addTask, updateTask, removeTask}


// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}