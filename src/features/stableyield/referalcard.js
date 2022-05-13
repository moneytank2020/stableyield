import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './styles';
import { Box, Card, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles(styles);

export default function ReferalCard() {
    const { t } = useTranslation();
    const classes = useStyles();
    const { web3, address } = useConnectWallet();
    return (
        <Card style={{ padding: 20 , borderRadius:10}}>
            <Grid item md={6} xs={6}>
                <Typography style={{ marginBottom: 10, fontSize: 18 }}>
                    Referral Link
                </Typography>
            </Grid>
            <Box display="flex" borderTop={1} borderBottom={1} borderLeft={1} borderRight={1} sx={{width:'100%', padding:10}}>
                <TextField style={{ fontSize: 18, width: '100%' }}  InputProps={{ disableUnderline: true, readOnly:true }} id="outlined-basic" value={window.location.href+"?ref="+address}/>
            </Box>
            <Typography>
                Earn of the used to bake beans from anyone who uses your referral link
            </Typography>
        </Card>
    );
}