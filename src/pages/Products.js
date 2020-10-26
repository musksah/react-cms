import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';

const URL = "http://localhost:3001/api/usuario";

const useStyles = makeStyles((theme) => ({
    root: {
        background: '#FFEAEA',
    },
    container_card: {
        background: '#FFFFFF',
        marginBottom: '3em'
    },
    content: {
        marginTop: '8em',
        marginBottom: '8em',
        marginLeft: '2em',
    }
}));

export default function Product() {
    const classes = useStyles();
    const history = useHistory();
    const [visible, setVisible] = useState("hidden");


    return (
        <Box className={classes.content}>
            <h1>Aquí estan los productos</h1>
        </Box >
    );
}