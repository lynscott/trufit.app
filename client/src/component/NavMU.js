import React, {useState, useEffect} from 'react'
import {
    Route,
    withRouter,
    Switch,
    Redirect,
    BrowserRouter,
    useHistory,
    NavLink
} from 'react-router-dom'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import LoginForm from './LoginForm'
import Button from '@material-ui/core/Button'
import * as actions from '../actions'
import Grid from '@material-ui/core/Grid'
import SlackFeedback, {themes} from 'react-slack-feedback'
import axios from 'axios'

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
import {makeStyles, useTheme, withStyles} from '@material-ui/core/styles'
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

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            // width: drawerWidth,
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

const StyledFeedBack = withStyles({
    fprCaL: {
        position: 'relative !important',
        backgroundColor: 'blue'
    }
})(SlackFeedback)

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.auth.user)
    const history = useHistory()
    const [signUp, setSignUp] = useState(false)

    const loginDialog = (
        <Dialog
            onClose={() => setSignUp(false)}
            aria-labelledby="simple-dialog-title"
            open={signUp}
        >
            <DialogTitle id="simple-dialog-title">Welcome Back!</DialogTitle>
            <LoginForm />
        </Dialog>
    )

    const handleSignOut = event => {
        // setAuth(event.target.checked)
        dispatch(actions.signOut())
    }

    const handleMenu = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleDash = () => {
        history.push('/dashboard')
        setAnchorEl(null)
    }

    return currentUser ? (
        <div>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                <MenuItem onClick={handleDash}>My Dashboard</MenuItem>
            </Menu>
        </div>
    ) : (
        <>
            <Button
                onClick={() => setSignUp(true)}
                style={{color: 'rgba(237,49,100,0.9)'}}
            >
                Sign In
            </Button>
            {loginDialog}
        </>
    )
}

{
    /* <NavItem active={this.props.currentTab === 'admin'}>
            <Link style={{textDecoration:'none'}} to="/dashboard/admin">
              <NavLink  onClick={() => {
                        if (!this.state.collapsed && this.props.windowWidth < COLLAPSE_TRIGGER_WIDTH) {
                            this.toggleNavbar()
                        }
                      }} >
                  Admin 
              </NavLink>
            </Link>
            </NavItem>
          </> */
}

/**
 * Navigation component
 * @param {*} props
 */
function NavMUI(props) {
    const {children} = props
    const classes = useStyles()
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = React.useState(false)

    const currentUser = useSelector(state => state.auth.user)
    const iconPack = {
        Overview: <HomeIcon />,
        Nutrition: <LocalGroceryStoreIcon />,
        Workout: <FitnessCenterIcon />
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const slackFeedBack = (
        <StyledFeedBack
            channel="#user-feedback"
            errorTimeout={8 * 1000}
            onClose={() => {}}
            onOpen={() => {}}
            sentTimeout={5 * 1000}
            showChannel={false}
            showIcon={true}
            theme={themes.dark}
            style={{maxWidth: '300px', position: 'absolute'}}
            user={currentUser}
            onSubmit={(payload, success, error) =>
                axios
                    .post('/api/send_feedback', payload)
                    .then(success)
                    .catch(error)
            } //TODO: wire up
            onImageUpload={(file, success, error) => {}}
        />
    )

    const drawer = (
        <div>
            <Divider />
            <List>
                {['Overview', 'Nutrition', 'Workout'].map((text, index) =>
                    text === 'Workout' ? (
                        <ListItem
                            key={index}
                            disabled={true}
                            button
                            onClick={handleDrawerToggle}
                        >
                            <ListItemIcon>{iconPack[text]}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ) : (
                        <NavLink
                            activeStyle={{
                                fontWeight: 'bold',
                                color: 'red'
                            }}
                            key={text}
                            style={{textDecoration: 'none', color: 'white'}}
                            to={`/dashboard/${text.toLowerCase()}`}
                        >
                            <ListItem button onClick={handleDrawerToggle}>
                                <ListItemIcon>{iconPack[text]}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        </NavLink>
                    )
                )}
            </List>
            <Divider />
            <List>
                {['Report Bug'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                            <BugReportIcon />
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        <div className="feedback">{slackFeedBack}</div>
                    </ListItem>
                ))}
            </List>
        </div>
    )

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    {currentUser && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" className={classes.title} noWrap>
                        {/* TruFit */}
                    </Typography>
                    <UserMenu />
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden smUp implementation="js">
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                        }}
                    >
                        <div className={classes.drawerHeader}>
                            <IconButton onClick={handleDrawerToggle}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="js">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <Grid item xs={12}>
                <main className={classes.content}>{children}</main>
            </Grid>
        </div>
    )
}

export default NavMUI
