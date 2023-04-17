import axios from 'axios'
import {AddTaskArgType} from "features/TodolistsList/tasks-reducer";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '100d0932-3043-4bc6-924b-e072bdf31f60'
    }
}
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})

// api
export const todolistsAPI = {
    getTodolists() {
        const promise = instance.get<TodolistType[]>('todo-lists');
        return promise;
    },
    createTodolist(title: string) {
        const promise = instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title});
        return promise;
    },
    deleteTodolist(id: string) {
        const promise = instance.delete<ResponseType>(`todo-lists/${id}`);
        return promise;
    },
    updateTodolist(arg:{id:string,title:string}) {
        const promise = instance.put<ResponseType>(`todo-lists/${arg.id}`, {title: arg.title});
        return promise;
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(arg:{todolistId: string, taskId: string}) {
        return instance.delete<ResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
    },
    createTask(arg:AddTaskArgType) {
        return instance.post<ResponseType<{ item: TaskType}>>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}


export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export const authAPI = {
    login(data: LoginParamsType) {
        const promise = instance.post<ResponseType<{userId?: number}>>('auth/login', data);
        return promise;
    },
    logout() {
        const promise = instance.delete<ResponseType<{userId?: number}>>('auth/login');
        return promise;
    },
    me() {
        const promise =  instance.get<ResponseType<{id: number; email: string; login: string}>>('auth/me');
        return promise
    }
}

// types
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

export const ResultCode = {
    success: 0,
    error: 1,
    captcha: 10
} as const