import React, {Component, Suspense, lazy, useEffect, useState} from 'react'
import {
    Route,
    withRouter,
    Switch,
    Redirect,
    BrowserRouter,
    useHistory,
    NavLink
} from 'react-router-dom'
import '../index.css' //TODO: Clean this old css file and make .scss

// import Nav from './Nav'
import NavMUI from './NavMU'
import keys from '../config/keys'
import ShowPlan from './ShowPlan'
import * as actions from '../actions'
import {Fade, Spinner} from 'reactstrap'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import LoginForm from './LoginForm'
import Loadable from 'react-loadable'

import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import {useDispatch, useSelector} from 'react-redux'

import SignUpV2 from './SignUpV2'

const drawerWidth = 200
//TODO: clean out unused styles
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0
        }
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${0}px)`
        },
        backgroundColor: 'black'
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: 'darkgrey'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end'
    },
    content: {
        flexGrow: 1
        // padding: theme.spacing(3)
    },
    title: {
        flexGrow: 1
    }
}))

const loaderCircle = props => {
    if (props.error) {
        console.log(props)
        return (
            <div>
                Error! <button onClick={props.retry}>Retry</button>
            </div>
        )
    } else {
        return <Spinner color="primary" />
    }
}

const loadFromPath = loaderCallBack =>
    Loadable({
        loader: loaderCallBack,
        loading: loaderCircle,
        timeout: 5000
    })

const Home = loadFromPath(() => import('./App'))
const About = lazy(() => import('./About'))
// const DashSideBar = loadFromPath(() => import('../DashBoard/DashSideBar'))
const Dash = loadFromPath(() => import('../DashBoard/Dashboard'))
const Dash2 = loadFromPath(() => import('../DashBoard/OverView/OverView'))
const Admin = loadFromPath(() => import('./Admin'))
const TrainingDash = loadFromPath(() => import('../DashBoard/TrainingDash'))
const ReactAdminDash = loadFromPath(() => import('./Admin/ReactAdmin'))
const NutritionDashV2 = loadFromPath(() =>
    import('../DashBoard/Nutrition/NutritionDashV2')
)

/**
 * Check to see whether or not the user is authenticated. If so render the component appropriately.
 * Perform all authentication checks here.
 * Otherwise redirect to root.
 * Must return a function as this is expected from routes.
 */
const AuthCheckOrRedirect = ({children}) => {
    // Required for asynchronous authentication.
    // You must handle the authentication race condition on direct routes.
    const currentUser = useSelector(state => state.auth.user)
    const isAuthenticating = useSelector(state => state.auth.isAuthenticating)
    const userProfile = useSelector(state => state.auth.userProfile)
    // console.log(userProfile, currentUser, 'AUTH')

    if (isAuthenticating) {
        return <Spinner color="dark" />
    }

    if (currentUser && userProfile && !isAuthenticating) {
        return children
    }

    //If no user profile route to setup page
    if (currentUser && !isAuthenticating && !userProfile) {
        return <Redirect to="/account_setup" />
    }

    return <Redirect to="/" />
}

const renderAccountSettings = () => {
    return (
        <Redirect to="/" /> //TODO: Complete settings dash
    )
}

const renderReactAdmin = () => {
    return <ReactAdminDash />
}

const renderAdmin = () => {
    // if (this.props.userProfile.isAdmin) {
    return <Admin />
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({children, ...rest}) => {
    const userProfile = useSelector(state => state.auth.userProfile)
    return (
        <Route
            {...rest}
            render={({location}) =>
                !userProfile ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    )
}

const AppRoutes = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        // dispatch(actions.fetchUser())
        dispatch(actions.fetchProfile())
    }, [])

    return (
        <Container
            style={{padding: 0, backgroundColor: 'white'}}
            maxWidth={'xl'}
        >
            <BrowserRouter>
                <NavMUI>
                    <>
                        <Toolbar />
                        <Grid container>
                            <Switch>
                                <Route exact path="/" render={() => <Home />} />

                                <Route
                                    exact
                                    path="/dashboard"
                                    render={() => (
                                        <Redirect to="/dashboard/overview" />
                                    )}
                                />
                                <Route
                                    exact
                                    path="/dashboard/overview"
                                    render={() => (
                                        <AuthCheckOrRedirect
                                            children={<Dash2 />}
                                        />
                                    )}
                                />

                                <Route
                                    exact
                                    path="/dashboard/training"
                                    render={() => (
                                        <Redirect to="/dashboard/overview" />
                                        // <AuthCheckOrRedirect
                                        //     children={<TrainingDash />}
                                        // />
                                    )}
                                />

                                <Route
                                    exact
                                    path="/dashboard/nutrition"
                                    render={() => (
                                        <AuthCheckOrRedirect
                                            children={<NutritionDashV2 />}
                                        />
                                    )}
                                />

                                <Route
                                    exact
                                    path="/dashboard/admin"
                                    render={() => (
                                        <AuthCheckOrRedirect
                                            children={() => renderReactAdmin}
                                        />
                                    )}
                                />

                                <PrivateRoute exact path="/account_setup">
                                    <SignUpV2 profileMode={true} />
                                </PrivateRoute>

                                <Route
                                    exact
                                    path="/dashboard/settings"
                                    render={() => (
                                        <AuthCheckOrRedirect
                                            children={renderAccountSettings}
                                        />
                                    )}
                                />
                            </Switch>
                        </Grid>
                    </>
                </NavMUI>
            </BrowserRouter>
        </Container>
    )
}

export default AppRoutes
