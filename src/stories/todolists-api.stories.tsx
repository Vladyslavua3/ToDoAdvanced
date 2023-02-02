import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../api/todolist-api";

export default {
    title: 'API'
}


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        todolistAPI.getToDoList()
            .then((res) => {
              setState(res.data[0].title)
            })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const toDoName = 'REACT&REDUX'
        todolistAPI.createToDoList(toDoName)
            .then((res)=>{
                debugger
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const toDoId = '6a1a1621-49a0-4717-8e4c-9b19b96f0867'
        todolistAPI.deleteTodolist(toDoId)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const toDoName = 'REACT&JS'
        const toDoId = '6fbd7728-283b-485d-a890-16f80a148c94'
        todolistAPI.updateTodolist(toDoId,toDoName).then((res)=> setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

