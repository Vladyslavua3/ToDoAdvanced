import React, { useCallback, useEffect } from 'react'
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
import {initializeAppTC} from "app/app-reducer";
import {selectAppStatus, selectIsInitialized} from "app/app.selector";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {logoutTC} from "features/auth/auth.reducer";




function App() {
    const status = useSelector(selectAppStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logoutHandler = useCallback(() => {
        dispatch(logoutTC())
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
                            TODO APP
                        </Typography>
                        {isLoggedIn && <Button color="inherit" style={{position:"absolute",right:'0'}} onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                    </Routes>
                </Container>
            </div>
        </BrowserRouter>
    )
}

export default App
