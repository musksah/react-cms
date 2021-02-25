import React, { useEffect, useState } from 'react';
import { Box, Grid, Backdrop, CircularProgress, Snackbar, Card, CardActionArea, Divider, CardHeader, CardMedia, Typography, Button } from '@material-ui/core';
import clsx from 'clsx';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Enviroment from '../../enviroment';
import axios from 'axios';

const URL = `${Enviroment.urlApi}`;
const PREFIX = `https://fullipscolombia.com/`;

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        background: '#FFFFFF',
        width: '80%',
        marginLeft: '10%'
    },
    content: {
        marginTop: '4.6em',
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
    boxImage: {
        border: '1px solid #A8A8A8',
        paddingTop: '3em',
        paddingBottom: '4em',
        backgroundColor: '#fff',
        marginLeft: '2em',
        marginRight: '2em'
    },
    titleImg: {

    }
}));

export default function CarrouselPersonalization() {
    const classes = useStyles();
    const [openProgress, setOpenProgress] = useState(false);
    const [open, setOpen] = useState(false);
    const [openError, setopenError] = useState(false);
    const [images, setImages] = useState([1, 2, 3]);
    const [typeImages, settypeImages] = useState(["Desktop", "Tablet", "Mobile"]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleCloseErr = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setopenError(false);
    };

    useEffect(() => {
        getImagesCarrousel();
    }, []);

    const getImagesCarrousel = () => {
        setOpenProgress(true);
        axios.get(`${URL}/img-carrousell`).then(res => {
            setOpenProgress(false);
            if (res.data.length > 0) {
                console.log(res.data);
                setImages(res.data);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    const sentFile = (id, path) => {
        let $target = document.getElementById(id);
        let files = $target.files[0];
        if (typeof files === 'undefined') {
            setopenError(true);
        } else {
            var blob = files.slice(0, files.size, files.type);
            let newFile = new File([blob], path, { type: files.type });
            fileUpload(newFile).then((response) => {
                $target.value = "";
                setOpen(true);
            }).catch((err) => {
                console.log(err);
            });
        }
    }


    const fileUpload = (file) => {
        const url = `${URL}/img-carrousell/update-file`;
        const formData = new FormData();
        formData.append('file', file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return axios.post(url, formData, config)
    }

    return (
        <Box className={classes.content}>
            <Backdrop className={classes.backdrop} open={openProgress}>
                <CircularProgress color="inherit" variant="indeterminate" disableShrink style={{ width: 80, height: 80 }} />
            </Backdrop>
            <Box style={{ backgroundColor: '#fff', paddingTop: '1em', paddingBottom: '1em', paddingLeft: '2em' }}>
                <Typography variant="body" style={{ textAlign: 'left', fontWeight: '600' }}>PERSONALIZAR CARROUSEL</Typography>
            </Box>
            {images.map(imgItem => (
                <Box style={{ marginTop: '2em' }} className={classes.boxImage}>
                    <Grid container>
                        <Grid item xs={12} style={{ textAlign: 'center', marginBottom: '2em' }}>
                            <Typography variant="h5" style={{ marginBottom: '1.4em', fontWeight: '600' }}>Imagen {imgItem.id_image_carrousel}</Typography>
                            <Divider />
                        </Grid>
                    </Grid>
                    <Grid container>
                        {typeImages.map(itemTImg => (
                            <Grid item xs={4}>
                                <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '1em', fontWeight: '600' }}></Typography>
                                <Card className={classes.root}>
                                    <CardHeader style={{ textAlign: 'center' }}
                                        title={itemTImg}
                                    />
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            alt="Contemplative Reptile"
                                            height="220"
                                            image={itemTImg == "Desktop" ? PREFIX + imgItem.url : [
                                                (itemTImg == "Tablet" ? PREFIX + imgItem.url_tablet : PREFIX + imgItem.url_mobile)
                                            ]}
                                            title="Contemplative Reptile"
                                        />
                                    </CardActionArea>
                                </Card>
                                <center>
                                    <form>
                                        <input type="file" style={{ marginTop: '1em' }} accept=".jpg, .jpeg, .png" id={itemTImg + imgItem.id_image_carrousel} />
                                        <Button variant="contained" color="primary" component="label" style={{ marginTop: '1.5em' }} onClick={() => sentFile(itemTImg + imgItem.id_image_carrousel, itemTImg == "Desktop" ? imgItem.url : [
                                            (itemTImg == "Tablet" ? imgItem.url_tablet : imgItem.url_mobile)
                                        ])}>
                                            Actualizar imagen
                                        </Button>
                                    </form>
                                </center>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}
            <Snackbar anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    La imagen ha sido actualizada con éxito
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }} open={openError} autoHideDuration={6000} onClose={handleCloseErr}>
                <Alert onClose={handleCloseErr} severity="error">
                    No se ha elegido ningún archivo
                </Alert>
            </Snackbar>
        </Box >
    );
}