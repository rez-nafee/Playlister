import { useContext } from 'react'
import AuthContext from '../auth'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

export default function MUIAccountError() {
    const { auth } = useContext(AuthContext);
   
    var errorMsg = ""
    if(auth.errorMessage){
        errorMsg = "" + auth.errorMessage
    }
    function handleCloseModal(event) {
        auth.closeError()
    }

    return (
        <Modal
            open={auth.errorMessage !== null}
        >
            <Box sx={style}>
            <Alert variant="filled" severity="error">
                <Typography variant="h5">{errorMsg}</Typography>
            </Alert>
            <Box sx = {{backgroundColor: '#F5F5DC'}} textAlign='center'>
                <Button onClick={handleCloseModal} variant='contained'>Close</Button>
            </Box>
            </Box>
        </Modal>
    );
}