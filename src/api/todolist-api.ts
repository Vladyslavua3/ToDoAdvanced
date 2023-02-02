import axios from 'axios'


type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}


export  type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data:D
}


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '4b6c2636-e1e2-4358-a36e-5279ebb3e1c6',
    },
})

export const todolistAPI = {
    updateTodolist(toDoId: string, title: string) {
        const promise = instance.put<ResponseType>(
            `/todo-lists/${toDoId}`,
            { title: title }
        )
        return promise
    },
    deleteTodolist(toDoId:string){
        const promise = instance.delete<ResponseType>(`/todo-lists/${toDoId}`)
        return promise
    },
    createToDoList(toDoName:string){
        const promise = instance.post<ResponseType<{ item:TodolistType }>>('/todo-lists'
        , {title:toDoName})
        return promise
    },
    getToDoList(){
        const promise = instance.get<Array<TodolistType>>('/todo-lists')
        return promise
    }
}