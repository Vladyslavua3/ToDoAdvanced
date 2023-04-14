import React, { useCallback, useEffect } from 'react'
import './App.css'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from 'features/auth/Login'
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@mui/material';
import { Menu } from '@mui/icons-material'
import { useAppDispatch } from 'common/hooks/useAppDispatch';
import {TodolistsList} from "features/TodolistsList/ListTodo";
import {ErrorSnackbar} from "common/components/ErrorSnackbar";
import {AppRootStateType} from "app/store";
import {authThunks} from "features/auth/auth-reducer";
import {selectIsLoggedIn} from "common/selectors/selectAuth/selectAuth";
import {initializeAppTC, RequestStatusType} from "app/app-reducer";

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.app.isInitialized)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logoutHandler = useCallback(() => {
        dispatch(authThunks.logout())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <BrowserRouter>
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                    </Routes>
                </Container>
            </div>
        </BrowserRouter>
    )
}

export default App
