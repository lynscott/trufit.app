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

import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'

import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import {useDispatch, useSelector} from 'react-redux'
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter'
import HomeIcon from '@material-ui/icons/Home'
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import BugReportIcon from '@material-ui/icons/BugReport'

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
    const userProfile = useSelector(state => state.auth)

    if (isAuthenticating) {
        return <Spinner color="dark" />
    }

    if (currentUser && !isAuthenticating) {
        return children
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

const AppRoutes = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(actions.fetchUser())
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
                                        <AuthCheckOrRedirect
                                            children={<TrainingDash />}
                                        />
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
