import { instance } from 'common/api/common.api';
import { ResponseType } from 'common/types/common.types';


export const todolistsApi = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title});
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`);
    },
    updateTodolist(arg: UpdateTodolistTitleArgType) {
        return instance.put<ResponseType>(`todo-lists/${arg.id}`, {title: arg.title});
    }
}

// Types
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

// export type TaskType = {
//     description: string
//     title: string
//     status: TaskStatuses
//     priority: TaskPriorities
//     startDate: string
//     deadline: string
//     id: string
//     todoListId: string
//     order: number
//     addedDate: string
// }

// export type UpdateTaskModelType = {
//     title: string
//     description: string
//     status: TaskStatuses
//     priority: TaskPriorities
//     startDate: string
//     deadline: string
// }
//
// type GetTasksResponse = {
//     error: string | null
//     totalCount: number
//     items: TaskType[]
// }
//
// export type AddTaskArgType = {
//     title: string
//     todolistId: string
// }
//
// export type UpdateTaskArgType = {
//     taskId: string,
//     domainModel: UpdateDomainTaskModelType,
//     todolistId: string
// }
//
// export type RemoveTaskArgType = {
//     todolistId: string
//     taskId: string
// }

export type UpdateTodolistTitleArgType = {
    id: string
    title: string
}