import React, { useState, useEffect } from 'react';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, Backdrop, DialogTitle, IconButton, CircularProgress, Dialog, DialogContent, TableRow, Paper, TablePagination, Button, InputLabel, TextField, Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import Enviroment from '../enviroment';

const URL = `${Enviroment.urlApi}/item`;

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
    inputtext: {
        padding: 14
    },
    container_card: {
        background: '#FFFFFF',
        marginBottom: '3em'
    },
    content: {
        marginTop: '8em',
        marginBottom: '8em'
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


export default function Product() {
    const classes = useStyles();
    const [openProgress, setOpenProgress] = useState(false);
    const [visible, setVisible] = useState(false);
    const [product, setProduct] = useState([]);
    const [name, setName] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [id, setId] = useState("");
    const [stock, setStock] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        findProduct();

    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const changeProduct = (p) => {
        setName(p.name);
        setSubtitle(p.subtitle);
        setDescription(p.description);
        setPrice(p.price);
        setStock(p.stock);
        setId(p.id_item);
        setVisible(true);
    }

    const findProduct = () => {
        setOpenProgress(true);
        axios.get(URL).then(res => {
            setOpenProgress(false);
            setProduct(res.data);
        });
    }

    const changeName = (e) => {
        const value = e.target.value;
        setName(value);
    }

    const changeSubtitle = (e) => {
        const value = e.target.value;
        setSubtitle(value);
    }
    const changeDescription = (e) => {
        const value = e.target.value;
        setDescription(value);
    }
    const changePrice = (e) => {
        const value = e.target.value;
        setPrice(value);
    }
    const changeStock = (e) => {
        const value = e.target.value;
        setStock(value);
    }

    const updateProduct = (e) => {
        e.preventDefault();
        setOpenProgress(true);
        axios.put(URL + "/" + id, { name, subtitle, description, price, stock }).then(res => {
            setVisible(false);
            setOpenProgress(false);
            findProduct();
        });
    }

    const handleClose = () => {
        setVisible(false);
    };


    return (
        <Box className={classes.content}>
            <Backdrop className={classes.backdrop} open={openProgress}>
                <CircularProgress color="inherit" variant="indeterminate" disableShrink style={{ width: 80, height: 80 }} />
            </Backdrop>
            <center>
                <Typography variant="h5" style={{marginBottom:'1.5em'}}>
                    PRODUCTOS
                </Typography>
            </center>
            <Grid container className={classes.centered}>
                <Grid item xs={10}>
                    <Paper className={classes.root}>
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Nombre</StyledTableCell>
                                        <StyledTableCell align="left">Subtitulo</StyledTableCell>
                                        <StyledTableCell align="left">Descripción</StyledTableCell>
                                        <StyledTableCell align="left">Precio</StyledTableCell>
                                        <StyledTableCell align="left">Cantidad</StyledTableCell>
                                        <StyledTableCell align="left">Editar</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {product.length > 0 ?
                                        product.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(p => (
                                            <TableRow key={p.id_item}>
                                                <TableCell align="left">{p.name}</TableCell>
                                                <TableCell align="left">{p.subtitle}</TableCell>
                                                <TableCell align="left">{p.description}</TableCell>
                                                <TableCell align="left">{p.price}</TableCell>
                                                <TableCell align="left">{p.stock}</TableCell>
                                                <TableCell align="left"><Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => changeProduct(p)}
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
                            count={product.length}
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
                        Editar Producto
                        <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid item xs={12} style={{ marginTop: '1em', marginBottom: '1em' }}>
                            <form onSubmit={updateProduct}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Nombre</InputLabel>
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
                                    <Grid item xs={6} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Subtitulo</InputLabel>
                                        <TextField
                                            name="subtitle"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="subtitle"
                                            autoComplete="off"
                                            inputProps={{ className: classes.inputtext }}
                                            value={subtitle}
                                            onChange={changeSubtitle}
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
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Precio</InputLabel>
                                        <TextField
                                            name="price"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="price"
                                            autoComplete="off"
                                            inputProps={{ className: classes.inputtext }}
                                            value={price}
                                            onChange={changePrice}
                                        />
                                    </Grid>
                                    <Grid item xs={6} >
                                        <InputLabel htmlFor="age-native-simple" style={{ marginBottom: '1em' }}>Cantidad</InputLabel>
                                        <TextField
                                            name="stock"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="stock"
                                            autoComplete="off"
                                            inputProps={{ className: classes.inputtext }}
                                            value={stock}
                                            onChange={changeStock}
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