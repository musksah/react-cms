import React, { useState, useEffect } from 'react';
import { Box, Grid, Table, TableBody, Typography, TableCell, TableContainer, Select, FormControl, TableHead, IconButton, TextField, InputLabel, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, TableRow, Paper, TablePagination, Button } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import Enviroment from '../enviroment';
import { green, orange, red } from '@material-ui/core/colors';

const URL = `${Enviroment.urlApi}/order`;

const MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#3D4057",
        // backgroundColor: "#FF0D00",
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
    inputtext: {
        padding: 14
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
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1000,
        color: '#fff',
    },
    detail_shipping: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: '1.1em'
    }
}));

export default function Order() {
    const classes = useStyles();
    const [openProgress, setOpenProgress] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [order, setOrder] = useState([]);
    const [orderId, setOrderId] = useState("");
    const [dateO, setDateO] = useState("");
    const [status, setStatus] = useState("");
    const [delivered, setDelivered] = useState(0);
    const [address, setAddress] = useState("");
    const [price, setPrice] = useState("");
    const [name, setName] = useState("");
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

    const date = (data) => {
        const f = new Date(data.toString().replace(/\s/, 'T'));
        return f.getDate() + " de " + MESES[f.getMonth()] + " del " + f.getFullYear() + " " + ("0" + (f.getHours())).slice(-2) + ":" + ("0" + (f.getMinutes())).slice(-2) + ":" + ("0" + (f.getSeconds())).slice(-2);
    }

    const findOrder = () => {
        setOpenProgress(true);
        axios.get(URL).then(res => {
            setOpenProgress(false);
            setOrder(res.data);
        });
    }

    const GreenButton = withStyles((theme) => ({
        root: {
            color: 'white',
            backgroundColor: green[500],
            '&:hover': {
                backgroundColor: green[700],
            },
        },
    }))(Button);

    const RedButton = withStyles((theme) => ({
        root: {
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[500],
            '&:hover': {
                backgroundColor: red[700],
            },
        },
    }))(Button);

    const OrangeButton = withStyles((theme) => ({
        root: {
            color: 'white',
            backgroundColor: orange[500],
            '&:hover': {
                backgroundColor: orange[700],
            },
        },
    }))(Button);

    const orderDetail = (o) => {
        setOrderDetails(o.order_details);
        setOrderId(o.order_code);
        setOrderS(o.shipping);
        setVisible(true);
    }

    const handleClose = () => {
        setVisible(false);
    };

    const handleClose2 = () => {
        setVisible2(false);
    };

    const changeOrder = (o) => {
        setOrderId(o.order_code);
        setDateO(o.shipping.agreed_date);
        setStatus(o.status);
        setDelivered(o.delivered);
        setAddress(o.shipping.address + " " + o.shipping.extra_address);
        setPrice(o.total_value);
        setName(o.shipping.name + " " + o.shipping.lastname);
        setVisible2(true);
    }

    const changeDelivered = (e) => {
        const value = e.target.value;
        setDelivered(value);

    }

    const updateOrder = (e) => {
        e.preventDefault();
        setOpenProgress(true);
        axios.put(URL + "/" + orderId, { delivered }).then(res => {
            setVisible2(false);
            setOpenProgress(false);
            findOrder();
        });
    }


    return (
        <Box className={classes.content}>
            <Backdrop className={classes.backdrop} open={openProgress}>
                <CircularProgress color="inherit" variant="indeterminate" disableShrink style={{ width: 80, height: 80 }} />
            </Backdrop>
            <center>
                <Typography variant="h5" style={{ marginBottom: '1.5em' }}>
                    PEDIDOS
                </Typography>
            </center>
            <Grid container className={classes.centered}>
                <Grid item xs={11}>
                    <Paper className={classes.root}>
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">No Orden</StyledTableCell>
                                        <StyledTableCell align="left">Fecha</StyledTableCell>
                                        <StyledTableCell align="left">Estado</StyledTableCell>
                                        <StyledTableCell align="left">Estado Envío</StyledTableCell>
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
                                                <TableCell align="left">{o.order_code}</TableCell>
                                                <TableCell align="left">{date(o.shipping.agreed_date)}</TableCell>
                                                <TableCell align="left">
                                                    {o.status == "Aceptada" ? <GreenButton variant="contained" color="primary">
                                                        {o.status}
                                                    </GreenButton> :
                                                        o.status == "Pendiente" ? <OrangeButton variant="contained" color="primary">
                                                            {o.status}
                                                        </OrangeButton> : <RedButton variant="contained" color="primary">
                                                                {o.status}
                                                            </RedButton>}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {o.delivered === 1 ?
                                                        <GreenButton variant="contained" color="primary">
                                                            Entregado
                                                        </GreenButton> :
                                                        <RedButton variant="contained" color="primary">
                                                            No Entregado
                                                        </RedButton>}
                                                </TableCell>
                                                <TableCell align="left">{o.shipping.name} {o.shipping.lastname}</TableCell>
                                                <TableCell align="left">{o.shipping.address} {o.shipping.extra_address}</TableCell>
                                                <TableCell align="left">$ {o.total_value}</TableCell>
                                                <TableCell align="left">
                                                    <Grid container>
                                                        <Grid item xs={12} md={6} >
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                style={{ marginRight: '1em', marginBottom: '1em' }}
                                                                onClick={() => orderDetail(o)}
                                                            >
                                                                <VisibilityIcon />
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                style={{ marginRight: '1em', marginBottom: '1em' }}
                                                                onClick={() => changeOrder(o)}
                                                            >
                                                                <EditIcon />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
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
                <Dialog aria-labelledby="customized-dialog-title" open={visible}>
                    <DialogTitle id="customized-dialog-title">
                        Detalle Orden No {orderId}
                        <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
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
                                <Typography variant="h6" style={{ marginBottom: '1em' }}>Información de Envío</Typography>
                                <Typography variant="body2" color="textSecondary" component="p" className={classes.detail_shipping}>
                                    <strong>Cliente Envío:</strong> {orderS.name} {orderS.lastname}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p" className={classes.detail_shipping}>
                                    <strong>Cédula Envío:</strong> {orderS.dni_id}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p" className={classes.detail_shipping} >
                                    <strong>Dirección Envío:</strong> {orderS.address} {orderS.extra_address}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p" className={classes.detail_shipping}>
                                    <strong>País:</strong> {orderS.country}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p" className={classes.detail_shipping}>
                                    <strong>Ciudad:</strong> {orderS.city}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p" className={classes.detail_shipping}>
                                    <strong>Teléfono:</strong> {orderS.phone}
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
                <Dialog aria-labelledby="customized-dialog-title" open={visible2}>
                    <DialogTitle id="customized-dialog-title">
                        Editar Orden No {orderId}
                        <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose2}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid item xs={12} style={{ marginTop: '1em', marginBottom: '1em' }}>
                            <form onSubmit={updateOrder}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Fecha</InputLabel>
                                        <TextField
                                            name="date"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="date"
                                            autoComplete="off"
                                            disabled={true}
                                            inputProps={{ className: classes.inputtext, readOnly: true }}
                                            value={date(dateO)}
                                        />
                                    </Grid>
                                    <Grid item xs={6} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>No Orden</InputLabel>
                                        <TextField
                                            name="name"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="name"
                                            autoComplete="off"
                                            disabled={true}
                                            inputProps={{ className: classes.inputtext, readOnly: true }}
                                            value={orderId}
                                        />
                                    </Grid>
                                    <Grid item xs={6} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Total Compra</InputLabel>
                                        <TextField
                                            name="price"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="price"
                                            autoComplete="off"
                                            disabled={true}
                                            inputProps={{ className: classes.inputtext, readOnly: true }}
                                            value={price}
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Cliente Envío</InputLabel>
                                        <TextField
                                            name="name"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="name"
                                            autoComplete="off"
                                            disabled={true}
                                            inputProps={{ className: classes.inputtext, readOnly: true }}
                                            value={name}
                                        />
                                    </Grid>

                                    <Grid item xs={6} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Estado</InputLabel>
                                        <TextField
                                            name="status"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="status"
                                            autoComplete="off"
                                            disabled={true}
                                            inputProps={{ className: classes.inputtext, readOnly: true }}
                                            value={status}
                                        />
                                    </Grid>
                                    <Grid item xs={6} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Estado Envío</InputLabel>
                                        <FormControl variant="outlined" fullWidth>
                                            <Select
                                                native
                                                value={delivered}
                                                onChange={changeDelivered}
                                                name="delivered"
                                                id="delivered"
                                                inputProps={{ className: classes.inputtext }}
                                            >
                                                <option value={0}>No Entregado</option>
                                                <option value={1}>Entregado</option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Dirección Envío</InputLabel>
                                        <TextField
                                            name="address"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="address"
                                            autoComplete="off"
                                            disabled={true}
                                            inputProps={{ readOnly: true }}
                                            value={address}
                                            multiline
                                            rows={6}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className={classes.centered}>
                                        <Grid item xs={6}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                            >
                                                Actualizar
                                        </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </form>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Grid>
        </Box >
    );
}