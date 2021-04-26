import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ExitToApp, ChevronRight, ChevronLeft, Menu } from '@material-ui/icons';
import { Backdrop, CircularProgress, ListItemIcon, ListItemText, ListItem, IconButton, Divider, CssBaseline, List, Toolbar, AppBar, Drawer, Typography } from '@material-ui/core';
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import AssignmentIcon from '@material-ui/icons/Assignment';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import EmailIcon from '@material-ui/icons/Email';
import Collapse from '@material-ui/core/Collapse';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import StarBorder from '@material-ui/icons/StarBorder';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Products from './Products';
import Coupons from './Coupons';
import Orders from './Orders';
import Emails from './Emails';
import CarrouselPersonalization from './Personalize/Carrousel';



const drawerWidth = 300;



const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    end: {
        marginLeft: 'auto'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export default function MenuC() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [openPersonalize, setopenPersonalize] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem("h_tiovad") === null) {
            history.push("/");
        }
    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        setopenPersonalize(!openPersonalize);
    };

    const logOut = () => {
        localStorage.clear();
        history.push("/");
    }

    return (
        <Box className={classes.root}>
            <CssBaseline />
            <AppBar
                
                // position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <Menu />
                    </IconButton>
                    {/* <Typography variant="h4">Soporte P&S</Typography> */}
                    <IconButton
                        aria-label="display more actions"
                        edge="end" color="inherit" className={classes.end} onClick={logOut}>
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <Typography style={{textAlign:'left', fontWeight:'700', marginLeft:'2em'}}>Administrador Fullips</Typography>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button key={1} component={Link} to='/Menu/Pedidos'>
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Pedidos" />
                        </ListItem>
                        <ListItem button key={2} component={Link} to='/Menu/Productos'>
                            <ListItemIcon>
                                <ShoppingCartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Productos" />
                        </ListItem>
                        <ListItem button key={3} component={Link} to='/Menu/Cupones'>
                            <ListItemIcon>
                                <LocalOfferIcon />
                            </ListItemIcon>
                            <ListItemText primary="Cupones" />
                        </ListItem>
                        <ListItem button key={4} component={Link} to='/Menu/Correos'>
                            <ListItemIcon>
                                <EmailIcon />
                            </ListItemIcon>
                            <ListItemText primary="Correos" />
                        </ListItem>
                        <ListItem button onClick={handleClick}>
                            <ListItemIcon>
                                <PermMediaIcon />
                            </ListItemIcon>
                            <ListItemText primary="Personalizar" />
                            {openPersonalize ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openPersonalize} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested} key={5} component={Link} to='/Menu/Personalizar/Carrousel'>
                                    <ListItemIcon>
                                        <StarBorder />
                                    </ListItemIcon>
                                    <ListItemText primary="Carrousel" button/>
                                </ListItem>
                            </List>
                        </Collapse>
                    </List>
                </Drawer>
            </Box>
            <Box style={{ width: '100%', backgroundColor:'#E9E9E9' }}>
                <Switch>
                    <Route path="/Menu/Pedidos" component={Orders} />
                    <Route path="/Menu/Productos" component={Products} />
                    <Route path="/Menu/Cupones" component={Coupons} />
                    <Route path="/Menu/Correos" component={Emails} />
                    <Route path="/Menu/Personalizar/Carrousel" component={CarrouselPersonalization} />
                    <Redirect from="/" to="/Menu/Pedidos" />
                </Switch>
            </Box>

        </Box>

    );
}
