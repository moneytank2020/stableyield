import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './referralcardstyles';
import { Box, Card, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles(styles);

export default function ReferalCard() {
    const { t } = useTranslation();
    const classes = useStyles();
    const { web3, address } = useConnectWallet();
    const referalLink = `https://${window.location.host}?ref=${address}`
    return (
        <Card className={classes.cardContainer}>
            <Grid item md={6} xs={6}>
                <Typography className={classes.text}>
                    Referral Link
                </Typography>
            </Grid>
            <Box display="flex" className={classes.cardInputContainer} sx={{width:'100%', padding:10}}>
                <TextField style={{ fontSize: 18, width: '100%' }}  InputProps={{ disableUnderline: true, readOnly:true }} id="outlined-basic" value={referalLink}/>
            </Box>
            <Typography style={{ marginTop:10 }}>
                Earn 12% of the USDC used to invest bonds from anyone who uses your referral link
            </Typography>
        </Card>
    );
}