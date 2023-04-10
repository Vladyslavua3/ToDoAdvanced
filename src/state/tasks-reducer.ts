import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {createAppAsyncThunk} from "utils/create-app-async-thunk";
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { clearTasksAndTodolists } from 'common/actions/common.actions';
import {appActions} from "app/app-reducer";
import {todolistsActions} from "state/todolists-reducer";
import {ResultCode, TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "api/todolist-api";



interface FetchTaskReturnedType {
    tasks:TaskType[],
    todolistId:string
}


const fetchTasks = createAppAsyncThunk<FetchTaskReturnedType,string>
('tasks/fetchTasks', async (todolistId, thunkAPI) => {

    const {dispatch,rejectWithValue} = thunkAPI

    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))

        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items

        // dispatch(tasksActions.setTasks({tasks, todolistId}))
        dispatch(appActions.setAppStatus({status: 'succeeded'}))

        return {tasks, todolistId}
    }
    catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})


export type AddTaskArgType = {
    title: string,
    todolistId: string
}

const addTask = createAppAsyncThunk<{task:TaskType},AddTaskArgType>
('tasks/addTask',async (arg,thunkAPI) => {

    const {dispatch,rejectWithValue} = thunkAPI

    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))

        const res = await todolistsAPI.createTask(arg)
        if (res.data.resultCode === ResultCode.success) {
            const task = res.data.data.item

            dispatch(appActions.setAppStatus({status: 'succeeded'}))

            return {task}
        }else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }


    }catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }

})

export type UpdateTaskArgType = {
    todolistId:string
    taskId:string
    domainModel:UpdateDomainTaskModelType
}


const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const state = getState()
        const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
        if (!task) {
            dispatch(appActions.setAppError({error: 'Task not found'}))
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

        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
        if (res.data.resultCode === ResultCode.success) {
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


export type removeTaskType = {
    taskId: string
    todolistId:string
}

const removeTask = createAppAsyncThunk<removeTaskType,removeTaskType>
('tasks/removeTask',async (arg,thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI

    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)

        if(res) dispatch(tasksActions.removeTask({taskId:arg.taskId,todolistId:arg.todolistId}))


        if (res.data.resultCode === ResultCode.success) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return arg
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    }catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }

})

const initialState: TasksStateType = {}


const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTask: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTasks.fulfilled,(state, action)=>{
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled,(state, action)=>{
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift(action.payload.task)
            })
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(updateTask.fulfilled,(state, action)=>{
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
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
export const tasksThunk = {fetchTasks,addTask,updateTask,removeTask}


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
