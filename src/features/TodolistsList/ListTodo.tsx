import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
    FilterValuesType,
    todolistsActions, todolistsThunk
} from 'features/TodolistsList/todolists-reducer'
import { Grid, Paper } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from 'common/hooks/useAppDispatch';
import {tasksThunk} from "features/TodolistsList/tasks-reducer";
import {TaskStatuses} from "common/api/todolist-api";
import {AddItemForm} from "common/components/AddItemForm";
import {Todolist} from "features/TodolistsList/TodoList/Todolist";
import {selectToDo} from "common/selectors/selectTodo/selectTodo";
import {selectTask} from "common/selectors/selectTask/selectTask";
import {selectIsLoggedIn} from "common/selectors/selectAuth/selectAuth";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {

    const todolists = useSelector(selectToDo)
    const tasks = useSelector(selectTask)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        const thunk = todolistsThunk.fetchTodolists({})
        dispatch(thunk)
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        const thunk = tasksThunk.removeTask({taskId:id,todolistId:todolistId})
        dispatch(thunk)
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        const thunk = tasksThunk.addTask({title, todolistId})
        dispatch(thunk)
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        const thunk = tasksThunk.updateTask({taskId, domainModel:{status}, todolistId})
        dispatch(thunk)
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
        const thunk = tasksThunk.updateTask({taskId, domainModel:{title:newTitle}, todolistId})
        dispatch(thunk)
    }, [])

    const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
        dispatch(todolistsActions.changeTodolistFilter({id, filter}))
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        const thunk = todolistsThunk.removeTodolist({id})
        dispatch(thunk)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const thunk = todolistsThunk.changeTodoListTitle({id, title})
        dispatch(thunk)
    }, [])

    const addTodolist = useCallback((title: string) => {
        const thunk = todolistsThunk.addTodoList({title:title})
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
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}