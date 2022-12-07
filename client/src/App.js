import './App.css';
import { React, useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import { FunctionBarProvider } from './context/FunctionBarContext';

import {
    AppBanner,
    HomeWrapper,
    LoginScreen,
    RegisterScreen,
    Statusbar,
    WorkspaceScreen,
    PeopleScreen,
    UserScreen
} from './components'

const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <FunctionBarProvider>              
                        <AppBanner />
                        <Switch>
                            <Route path="/" exact component={HomeWrapper} />
                            <Route path="/login/" exact component={LoginScreen} />
                            <Route path="/register/" exact component={RegisterScreen} />
                            <Route path="/playlist/:id" exact component={WorkspaceScreen} />
                            <Route path='/people' exact component={PeopleScreen}/>
                            <Route path='/user' exact component={UserScreen}/>
                        </Switch>
                    </FunctionBarProvider>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App