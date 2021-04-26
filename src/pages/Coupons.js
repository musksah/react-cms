import React, { useState, useEffect } from 'react';
import { Box, Grid, Table, TableBody, Snackbar, TableCell, Checkbox, TableContainer, TableHead, Backdrop, DialogTitle, IconButton, CircularProgress, Dialog, DialogContent, TableRow, Paper, TablePagination, Button, InputLabel, TextField, Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Enviroment from '../enviroment';
import MuiAlert from '@material-ui/lab/Alert';
import { green, orange, red } from '@material-ui/core/colors';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const URL = `${Enviroment.urlApi}/coupon`;
const URL_ORDER = `${Enviroment.urlApi}/order`;

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

const GreenButton = withStyles((theme) => ({
    root: {
        color: 'white',
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
}))(Button);

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
        marginTop: '4.6em',
        marginBottom: '30em',
    }
    ,
    centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1000,
        color: '#fff',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));


export default function Coupon() {
    const classes = useStyles();
    const [openProgress, setOpenProgress] = useState(false);
    const [visible, setVisible] = useState(false);
    const [coupon, setCoupon] = useState([]);
    const [couponSales, setCouponSales] = useState([]);
    const [title, setTitle] = useState("");
    const [textButton, setTextButton] = useState("");
    const [isCreate, setIsCreate] = useState(false);
    const [id, setId] = useState("");
    const [idCouponDelete, setIdCouponDelete] = useState(0);
    const [name, setName] = useState("");
    const [discountValue, setDiscountValue] = useState("");
    const [description, setDescription] = useState("");
    const [codeName, setCodeName] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pageCP, setPageCP] = useState(0);
    const [rowsPerPageCP, setRowsPerPageCP] = useState(10);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        findCoupon();
    }, []);

    const handleClickOpenDialog = (p) => {
        setIdCouponDelete(p);
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleDeleteDialog = () => {
        deleteCoupon(idCouponDelete);
        handleCloseDialog();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangePageCP = (event, newPage) => {
        setPageCP(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangeRowsPerPageCP = (event) => {
        setRowsPerPageCP(+event.target.value);
        setPageCP(0);
    };

    const changeStateCommission = (p) => {
        let commission = p.commission;
        let orderCode = p.order_code;
        let idCoupon = p.coupon.id_coupon;
        let newComission = commission == 1 ? 0 : 1;
        let order = {
            commission: newComission
        }
        setOpenProgress(true);
        axios.put(URL_ORDER + "/" + orderCode, order).then(res => {
            setOpenProgress(false);
            findCouponSales({ 'id_coupon': idCoupon });
        });
    };

    const changeProduct = (p) => {
        setTitle("Editar Cupón");
        setTextButton("Actualizar");
        setIsCreate(false);
        setId(p.id_coupon);
        setName(p.name);
        setDiscountValue(p.discount_value);
        setCodeName(p.codename);
        setDescription(p.description);
        setVisible(true);
    }

    const createProduct = () => {
        setTitle("Crear Cupón");
        setTextButton("Registrar");
        setIsCreate(true);
        setVisible(true);
    }

    const findCoupon = () => {
        setOpenProgress(true);
        axios.get(URL).then(res => {
            setOpenProgress(false);
            console.log(res.data);
            setCoupon(res.data);
        });
    }

    const changeCodeName = (e) => {
        const value = e.target.value;
        setCodeName(value);
    }

    const changeName = (e) => {
        const value = e.target.value;
        setName(value);
    }

    const changediscountValue = (e) => {
        const value = e.target.value;
        setDiscountValue(value);
    }

    const changeDescription = (e) => {
        const value = e.target.value;
        setDescription(value);
    }

    const resetForm = () => {
        setName("");
        setCodeName("");
        setDescription("");
        setDiscountValue("");
    }

    const updateProduct = (e) => {
        e.preventDefault();
        setOpenProgress(true);
        let coupon = {
            name: name,
            discount_value: discountValue,
            codename: codeName,
            description: description,
            is_active: 1
        }
        if (isCreate) {
            axios.post(URL + "/", coupon).then(res => {
                setVisible(false);
                setOpenProgress(false);
                findCoupon();
                resetForm();
            });
        } else {
            axios.put(URL + "/" + id, coupon).then(res => {
                setVisible(false);
                setOpenProgress(false);
                findCoupon();
                resetForm();
            });
        }
    }

    const handleClose = () => {
        setVisible(false);
    };

    const handleCloseShowDetail = () => {
        setShowDetails(false);
    };

    const findCouponSales = (p) => {
        axios.get(URL + "/sales/" + p.id_coupon).then(res => {
            setCouponSales(res.data);
        });
    }

    const deleteCoupon = (p) => {
        axios.delete(URL + "/" + p.id_coupon).then(res => {
            findCoupon();
        });
    };

    const checkDetail = (p) => {
        setShowDetails(true);
        findCouponSales(p);
    };

    const closeMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Box className={classes.content}>
            <Backdrop className={classes.backdrop} open={openProgress}>
                <CircularProgress color="inherit" variant="indeterminate" disableShrink style={{ width: 80, height: 80 }} />
            </Backdrop>
            <Box style={{ backgroundColor: '#fff', paddingTop: '1em', paddingBottom: '1em', marginBottom: '4em' }}>
                <Typography variant="body" style={{ textAlign: 'left', fontWeight: '600', marginLeft: '2em' }}>CUPONES FULLIPS</Typography>
            </Box>
            <Grid container className={classes.centered}>
                <Grid item xs={10}>
                    <Paper className={classes.root}>
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Código Cupón</StyledTableCell>
                                        <StyledTableCell align="left">Descuento</StyledTableCell>
                                        <StyledTableCell align="left">Descripción</StyledTableCell>
                                        <StyledTableCell align="left">Persona Cupón</StyledTableCell>
                                        <StyledTableCell align="left">Editar</StyledTableCell>
                                        <StyledTableCell align="left">Ver ventas</StyledTableCell>
                                        <StyledTableCell align="left">Eliminar</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {coupon.length > 0 ?
                                        coupon.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(p => (
                                            <TableRow key={p.id_item}>
                                                <TableCell align="left">{p.codename}</TableCell>
                                                <TableCell align="left">{p.discount_value}</TableCell>
                                                <TableCell align="left">{p.description}</TableCell>
                                                <TableCell align="left">{p.name}</TableCell>
                                                <TableCell align="left"><Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => changeProduct(p)}
                                                >
                                                    <EditIcon />
                                                </Button></TableCell>
                                                <TableCell align="left"><Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => checkDetail(p)}
                                                >
                                                    <VisibilityIcon />
                                                </Button></TableCell>
                                                <TableCell align="left"><Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleClickOpenDialog(p)}
                                                >
                                                    <DeleteIcon />
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
                            count={coupon.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelRowsPerPage='Registros por Página'
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
                <Dialog aria-labelledby="customized-dialog-title" open={visible}>
                    <DialogTitle id="customized-dialog-title" >
                        {title}
                        <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid item xs={12} style={{ marginTop: '1em', marginBottom: '1em' }}>
                            <form onSubmit={updateProduct}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Nombre Cupón</InputLabel>
                                        <TextField
                                            name="codename"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="codename"
                                            autoComplete="off"
                                            inputProps={{ className: classes.inputtext }}
                                            value={codeName}
                                            onChange={changeCodeName}
                                        />
                                    </Grid>
                                    <Grid item xs={6} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Valor Descuento</InputLabel>
                                        <TextField
                                            name="discountValue"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="discountValue"
                                            autoComplete="off"
                                            inputProps={{ className: classes.inputtext }}
                                            value={discountValue}
                                            onChange={changediscountValue}
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Descripción</InputLabel>
                                        <TextField
                                            name="description"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="description"
                                            autoComplete="off"
                                            multiline
                                            rows={6}
                                            value={description}
                                            onChange={changeDescription}
                                        />
                                    </Grid>
                                    <Grid item xs={6} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Persona Asociada</InputLabel>
                                        <TextField
                                            name="name"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="name"
                                            autoComplete="off"
                                            inputProps={{ className: classes.inputtext }}
                                            value={name}
                                            onChange={changeName}
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
                                                {textButton}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </form>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Grid>
            <Grid container className={classes.centered} style={{ marginTop: '2em' }}>
                <Grid item xs={10}>
                    <Button variant="contained" color="primary" onClick={() => createProduct({})}>Nuevo Cupón</Button>
                </Grid>
            </Grid>
            {showDetails &&
                <Grid container className={classes.centered} style={{ marginTop: '2em' }}>
                    <Grid item xs={10} style={{ marginBottom: '1em' }}>
                        <Typography variant="h5">Ventas: {couponSales.length}</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Paper className={classes.root}>
                            <TableContainer >
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="left">Cupón</StyledTableCell>
                                            <StyledTableCell align="left">Factura</StyledTableCell>
                                            <StyledTableCell align="left">Cliente Envío</StyledTableCell>
                                            <StyledTableCell align="left">Total</StyledTableCell>
                                            <StyledTableCell align="left">Comisión Pagada</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {couponSales.length > 0 ?
                                            couponSales.slice(pageCP * rowsPerPageCP, pageCP * rowsPerPageCP + rowsPerPageCP).map(p => (
                                                <TableRow key={p.id_item}>
                                                    <TableCell align="left">{p.coupon.codename}</TableCell>
                                                    <TableCell align="left">{p.order_code}</TableCell>
                                                    <TableCell align="left">{p.shipping.name + ' ' + p.shipping.lastname}</TableCell>
                                                    <TableCell align="left">{p.total_value}</TableCell>
                                                    <TableCell align="left">{parseInt(p.commission) === 1
                                                        ? <GreenButton variant="contained" onClick={() => changeStateCommission(p)} >Pagada</GreenButton> :
                                                        <Button variant="contained" color="secondary" onClick={() => changeStateCommission(p)}>Sin Pagar</Button>}
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
                                count={couponSales.length}
                                rowsPerPage={rowsPerPageCP}
                                page={pageCP}
                                labelRowsPerPage='Registros por Página'
                                onChangePage={handleChangePageCP}
                                onChangeRowsPerPage={handleChangeRowsPerPageCP}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            }
            <Snackbar open={open} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={closeMessage}>
                <Alert onClose={closeMessage} severity="error">
                    {message}
                </Alert>
            </Snackbar>
            <Dialog
                fullScreen={fullScreen}
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"¿Seguro desea continuar?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Toda la información relacionada a este cupón será eliminada.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCloseDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteDialog} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}