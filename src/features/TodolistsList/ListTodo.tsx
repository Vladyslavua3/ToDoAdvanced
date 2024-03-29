import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
    FilterValuesType,
    todolistsActions,  todolistsThunks
} from 'features/TodolistsList/TodoList/todolists-reducer'
import { Grid, Paper } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from 'common/hooks/useAppDispatch';
import {AddItemForm} from "common/components/AddItemForm";
import {Todolist} from "features/TodolistsList/TodoList/Todolist";
import {tasksThunks} from "features/TodolistsList/Task/tasks-reducer";
import {TaskStatuses} from "common/enums";
import {selectTasks} from "features/TodolistsList/Task/tasks.selector";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTodolists} from "features/TodolistsList/TodoList/todolist.selectors";


export const TodolistsList = () => {

    const todolists = useSelector(selectTodolists)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        dispatch(todolistsThunks.fetchTodolists())
    }, [])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(tasksThunks.removeTask({taskId,todolistId}))
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        const thunk = tasksThunks.addTask({title, todolistId})
        dispatch(thunk)
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        const thunk = tasksThunks.updateTask({taskId, domainModel:{status}, todolistId})
        dispatch(thunk)
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
        const thunk = tasksThunks.updateTask({taskId, domainModel:{title:newTitle}, todolistId})
        dispatch(thunk)
    }, [])

    const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
        dispatch(todolistsActions.changeTodolistFilter({id, filter}))
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        const thunk = todolistsThunks.removeTodolist(id)
        dispatch(thunk)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const thunk = todolistsThunks.changeTodolistTitle({id, title})
        dispatch(thunk)
    }, [])

    const addTodolist = useCallback((title: string) => {
        const thunk = todolistsThunks.addTodolist(title)
        dispatch(thunk)
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}