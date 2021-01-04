import React, { useState, useEffect } from 'react';
import { Box, Grid, Backdrop, CircularProgress, Button, Typography, Paper, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, Checkbox, FormControlLabel, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import axios from 'axios';
import { CSVLink } from "react-csv";
import Enviroment from '../enviroment';

const URL = `${Enviroment.urlApi}`;

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#3D4057",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);



const useStyles = makeStyles((theme) => ({
    root: {
        background: '#FFFFFF',
        width: '80%',
        marginLeft: '10%'
    },
    content: {
        marginTop: '8em',
        marginBottom: '8em',
    },
    centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export default function Order() {
    const classes = useStyles();
    const [openProgress, setOpenProgress] = useState(false);
    const [messageSnack, setMessageSnack] = useState("");
    const [email, setEmail] = useState([]);
    const [donation, setDonation] = useState([]);
    const [checked, setChecked] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        findEmail();
        findDonation();
        getConfirmAuth();
    }, []);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const findEmail = () => {
        setOpenProgress(true);
        axios.get(URL + "/user/email").then(res => {
            setOpenProgress(false);
            if (res.data.length > 0) {
                Emails(res.data);
            }
        });
    }

    const updateConfirmAuth = () => {
        let checkedopt = checked == false ? 0 : 1;
        setOpenProgress(true);
        axios.put(URL + "/settings/update", { 'activated': checkedopt }).then(res => {
            setOpenProgress(false);
            setMessageSnack(res.data);
            setOpen(true);
        });
    }

    const findDonation = () => {
        setOpenProgress(true);
        axios.get(URL + "/donation").then(res => {
            setOpenProgress(false);
            setDonation(res.data);
        });
    }

    const getConfirmAuth = () => {
        setOpenProgress(true);
        axios.get(URL + "/settings").then(res => {
            setOpenProgress(false);
            let activated = res.data.activated;
            if (activated == 1) {
                setChecked(true);
            } else {
                setChecked(false);
            }
        });
    }

    const Emails = (emails) => {
        setOpenProgress(true);
        let array_email = [];
        for (let i = 0; i < emails.length; i++) {
            array_email.push([emails[i].email]);
        }
        setEmail(array_email);
        setOpenProgress(false);
    }


    return (
        <Box className={classes.content}>
            <Backdrop className={classes.backdrop} open={openProgress}>
                <CircularProgress color="inherit" variant="indeterminate" disableShrink style={{ width: 80, height: 80 }} />
            </Backdrop>
            <Grid container className={classes.centered}>
                <Grid xs={6}>
                    {/* <center>
                        <Typography variant="h5" style={{ marginBottom: '1.5em' }}>
                            DONACIONES
                        </Typography>
                    </center> */}
                    <Paper className={classes.root}>
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">TOTAL DONACIONES</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {donation.map(d => (
                                        <TableRow key={d.id_donation}>
                                            <TableCell align="left">$ {d.total}</TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid xs={6}>
                    <Paper className={classes.root}>
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">COMPRA CON AUTENTICACIÓN</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            <FormControlLabel style={{ marginLeft: '1em' }}
                                                control={
                                                    <Checkbox
                                                        checked={checked}
                                                        color="primary"
                                                        onChange={handleChange}
                                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                                    />
                                                }
                                                label="Activar"
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            <center>
                                                <Button variant="contained" color="primary" onClick={updateConfirmAuth}>Actualizar</Button>
                                            </center>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid xs={12} style={{marginTop:'3em'}}>
                    <center>
                        <Button variant="contained" color="primary">
                            <CSVLink data={email} filename={"Correos.csv"} style={{ color: "white", textDecoration: "none" }}><CloudDownloadIcon style={{ marginRight: '0.3em' }} /> Descargar Correos
                    </CSVLink>
                        </Button>
                    </center>
                </Grid>
            </Grid>
            <Snackbar anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    La opción fue actualizada con éxito
                </Alert>
            </Snackbar>
        </Box >
    );
}