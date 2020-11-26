import React, { useState, useEffect } from 'react';
import { Box, Grid, Backdrop, CircularProgress, Button, Typography, Paper, TableCell, TableContainer, Table, TableHead, TableRow, TableBody } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import axios from 'axios';
import { CSVLink } from "react-csv";
import Enviroment from '../enviroment';

const URL = `${Enviroment.urlApi}`;

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
    const [email, setEmail] = useState([]);
    const [donation, setDonation] = useState([]);

    useEffect(() => {
        findEmail();
        findDonation();
    }, []);


    const findEmail = () => {
        setOpenProgress(true);
        axios.get(URL + "/user/email").then(res => {
            setOpenProgress(false);
            if (res.data.length > 0) {
                Emails(res.data);
            }
        });
    }

    const findDonation = () => {
        setOpenProgress(true);
        axios.get(URL + "/donation").then(res => {
            setOpenProgress(false);
            setDonation(res.data);
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
                <Grid xs={12}>
                    <center>
                        <Typography variant="h5" style={{ marginBottom: '1.5em' }}>
                            DONACIONES
                    </Typography>
                    </center>
                </Grid>
                <Grid xs={3} style={{ marginBottom: '5em' }}>
                    <Paper className={classes.root}>
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Donación Total</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {donation.map(d => (
                                        <TableRow key={d.id_donation}>
                                            <TableCell align="left">{d.total}</TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid xs={12}>
                    <center>
                        <Typography variant="h5" style={{ marginBottom: '1.5em' }}>
                            CORREOS
                    </Typography>
                    </center>
                </Grid>
                <Grid xs={12}>
                    <center>
                        <Button variant="contained" color="primary">
                            <CSVLink data={email} filename={"Correos.csv"} style={{ color: "white", textDecoration: "none" }}><CloudDownloadIcon style={{ marginRight: '0.3em' }} /> Descargar Correos
                    </CSVLink>
                        </Button>
                    </center>
                </Grid>
            </Grid>
        </Box >
    );
}