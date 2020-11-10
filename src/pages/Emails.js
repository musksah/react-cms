import React, { useState, useEffect } from 'react';
import { Box, Grid, Table, TableBody, Typography, TableCell, TableContainer, TableHead, IconButton, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, TableRow, Paper, TablePagination, Button, InputLabel, TextField } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import axios from 'axios';
import { CSVLink } from "react-csv";
import Enviroment from '../enviroment';

const URL = `${Enviroment.urlApi}/user/email`;



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
    const history = useHistory();
    const [openProgress, setOpenProgress] = useState(false);
    const [email, setEmail] = useState([]);

    useEffect(() => {
        findEmail();
    }, []);


    const findEmail = () => {
        setOpenProgress(true);
        axios.get(URL).then(res => {
            setOpenProgress(false);
            if (res.data.length > 0) {
                Emails(res.data);
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
                <center>
                    <Button variant="contained" color="primary">
                        <CSVLink data={email} filename={"Correos.csv"} style={{ color: "white", textDecoration: "none" }}><CloudDownloadIcon style={{ marginRight: '0.3em' }} /> Descargar Correos
                    </CSVLink>
                    </Button>
                </center>
            </Grid>
        </Box >
    );
}