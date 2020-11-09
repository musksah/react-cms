import React, { useState, useEffect } from 'react';
import { Box, Grid, Table, TableBody, Typography, TableCell, TableContainer, TableHead, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, TableRow, Paper, TablePagination, Button, InputLabel, TextField } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import Enviroment from '../enviroment';

const URL = `${Enviroment.urlApi}/order`;

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#FF0D00",
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
    container_card: {
        background: '#FFFFFF',
        marginBottom: '3em'
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
}));

export default function Order() {
    const classes = useStyles();
    const history = useHistory();
    const [openProgress, setOpenProgress] = useState(false);
    const [visible, setVisible] = useState(false);
    const [order, setOrder] = useState([]);
    const [orderId, setOrderId] = useState("");
    const [orderS, setOrderS] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        findOrder();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const findOrder = () => {
        setOpenProgress(true);
        axios.get(URL).then(res => {
            setOpenProgress(false);
            setOrder(res.data);
        });
    }

    const orderDetail = (o) => {
        setVisible(true);
        setOrderDetails(o.order_details);
        setOrderId(o.id_order);
        setOrderS(o.shipping);
    }

    const handleClose = () => {
        setVisible(false);
    };


    return (
        <Box className={classes.content}>
            <Backdrop className={classes.backdrop} open={openProgress}>
                <CircularProgress color="inherit" variant="indeterminate" disableShrink style={{ width: 80, height: 80 }} />
            </Backdrop>
            <Grid container className={classes.centered}>

                <Grid item xs={10}>
                    <Paper className={classes.root}>
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">No Orden</StyledTableCell>
                                        <StyledTableCell align="left">Fecha</StyledTableCell>
                                        <StyledTableCell align="left">Estado</StyledTableCell>
                                        <StyledTableCell align="left">Cliente Envío</StyledTableCell>
                                        <StyledTableCell align="left">Dirección Envío</StyledTableCell>
                                        <StyledTableCell align="left">Total Compra</StyledTableCell>
                                        <StyledTableCell align="left">Acción</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.length > 0 ?
                                        order.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(o => (
                                            <TableRow key={o.id_order}>
                                                <TableCell align="left">{o.id_order}</TableCell>
                                                <TableCell align="left">{o.shipping.agreed_date}</TableCell>
                                                <TableCell align="left">{o.status}</TableCell>
                                                <TableCell align="left">{o.shipping.name} {o.shipping.lastname}</TableCell>
                                                <TableCell align="left">{o.shipping.address} {o.shipping.extra_address}</TableCell>
                                                <TableCell align="left">$ {o.total_value}</TableCell>
                                                <TableCell align="left"><Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => orderDetail(o)}
                                                >
                                                    <EditIcon />
                                                </Button></TableCell>
                                            </TableRow>
                                        ))
                                        : (
                                            <TableRow >
                                                <TableCell colSpan={6} align="center">No Hay Datos</TableCell>
                                            </TableRow>
                                        )}

                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={order.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelRowsPerPage='Registros por Página'
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={visible}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Detalle Orden No {orderId}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container>
                            <Grid item xs={12} style={{ margin: '1em' }}>
                                <Typography variant="h6" style={{ marginBottom: '1em' }}>Productos</Typography>
                                <TableContainer >
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">Producto</StyledTableCell>
                                                <StyledTableCell align="left">Cantidad</StyledTableCell>
                                                <StyledTableCell align="left">Valor</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orderDetails.length > 0 ?
                                                orderDetails.map(details => (
                                                    <TableRow key={details.id_order_details}>
                                                        <TableCell align="left">{details.item.name}</TableCell>
                                                        <TableCell align="left">{details.quantity}</TableCell>
                                                        <TableCell align="left">$ {details.value}</TableCell>
                                                    </TableRow>
                                                ))
                                                : (
                                                    <TableRow >
                                                        <TableCell colSpan={3} align="center">No Hay Datos</TableCell>
                                                    </TableRow>
                                                )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} style={{ margin: '1em' }}>
                                <Typography variant="h6" style={{ marginBottom: '1em' }}>Información Envío</Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Cliente Envío:{orderS.name} {orderS.lastname}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Cédula Envío:{orderS.dni_id}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Dirección Envío:{orderS.address} {orderS.extra_address}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    País:{orderS.country}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Ciudad:{orderS.city}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Teléfono:{orderS.phone}
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Grid>
        </Box >
    );
}