import React, { useState } from 'react';
import { Backdrop, CircularProgress, Container, Card, CardContent, TextField, Button, InputLabel, Grid, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import Enviroment from '../enviroment';
import './Login.css';

const URL = `${Enviroment.urlApi}/user`;

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: 'white'
    },
}));


export default function Login() {
    const classes = useStyles();
    const [openProgress, setOpenProgress] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const history = useHistory();

    const changeEmail = (e) => {
        const { value } = e.target;
        setEmail(value);
    }

    const changePassword = (e) => {
        const { value } = e.target;
        setPassword(value);
    }

    const findUser = (e) => {
        e.preventDefault();
        setOpenProgress(true);
        axios.post(URL, { email, password }).then(res => {
            setOpenProgress(false);
            if (res.status === 200) {
                if (res.data.rol === 2) {
                    localStorage.setItem("h_tiovad", res.data.token);
                    localStorage.setItem("name", res.data.name.split(" ")[0]);
                    localStorage.setItem("sessionid", res.data.session);
                    history.push("/Menu");
                } else {
                    openMessage("Credenciales Inválidas");
                }

            } else {
                openMessage(res.data.message);
            }
        });

    }

    const openMessage = (message) => {
        setMessage(message);
        handleClick();
    }

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: '2.6rem' }}>
            <Backdrop className={classes.backdrop} open={openProgress}>
                <CircularProgress color="inherit" variant="indeterminate" disableShrink style={{ width: 80, height: 80 }} />
            </Backdrop>
            <Card elevation={5}>
                <CardContent>
                    <Grid item xs={12} className={classes.centered}>
                        <img
                            src={`img/FULLIPS_COLOMBIA_JPG.jpg`}
                            alt={`logo`}
                            width="200"
                            style={{ marginBottom: '1em', marginTop: '1em' }}
                        />
                    </Grid>
                    <form className={classes.form} onSubmit={findUser}>

                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <InputLabel >Usuario</InputLabel>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="usuario"
                                    name="usuario"
                                    autoComplete="off"
                                    autoFocus
                                    onChange={changeEmail}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <InputLabel >Contraseña</InputLabel>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="contraseña"
                                    type="password"
                                    id="contraseña"
                                    autoComplete="off"
                                    onChange={changePassword}
                                />
                            </Grid>
                            <Grid item xs={12} >

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Ingresar
                             </Button>

                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
            <Snackbar open={open} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    {message}
                </Alert>
            </Snackbar>
        </Container >
    );
}
