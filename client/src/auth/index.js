import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    ACCOUNT_ERROR: "ACCOUNT_ERROR",
    ACCOUNT_ERROR_CLEAR: "ACCOUNT_ERROR_CLEAR"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null, 
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: null
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: null
                })
            }
            case AuthActionType.ACCOUNT_ERROR:{
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    errorMessage: payload
                })
            }
            case AuthActionType.ACCOUNT_ERROR_CLEAR:{
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    errorMessage: null
                })
            }
            default:
                return auth;
        }
    }

    // Gets the user that is currently logged into the application 
    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    // Function for registering a user and updating our database. Once updated, logged the user into the application. 
    auth.registerUser = async function(firstName, lastName, email, password, passwordVerify) {
        const response = await api.registerUser(firstName, lastName, email, password, passwordVerify).then(function (res){
            if (res.status === 200) {
                // Success! Login the user into the application in order for them to use. 
                auth.loginUser(email,password)
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: res.data.user
                    }
                })
            }
        }).catch(function (error){
            if (error.response) {
                // Get the error message that was sent back by the server
                var errorMessage = error.response.data.errorMessage
                authReducer({
                    type: AuthActionType.ACCOUNT_ERROR,
                    payload: errorMessage
                })
              } 
        });    
    }

    // Function for logging in the user to the application so they can begin working in the application. 
    auth.loginUser = async function(email, password) {
        const response = await api.loginUser(email, password).then(function (res){
            if (res.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: res.data.user
                    }
                })
                // Sent them back to the homescreen but since we have a user logged in, it'll take them to Workspace!
                history.push("/");
            }
        }).catch(function (error){
            if (error.response) {
                // Get the error message that was sent back by the server
                var errorMessage = error.response.data.errorMessage
                authReducer({
                    type: AuthActionType.ACCOUNT_ERROR,
                    payload: errorMessage
                })
              } 
        });
    }

    // Function for logging the user out the application. 
    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.closeError = function(){
        authReducer( {
            type: AuthActionType.ACCOUNT_ERROR_CLEAR,
            payload: null
        })
    }

    // Function for getting the initials of the user. 
    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };