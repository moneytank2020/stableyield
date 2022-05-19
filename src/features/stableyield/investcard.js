import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './investcardstyles';
import { Box, Card, Grid, Typography } from '@material-ui/core';
import { useFetchApyAndRate } from './redux/fetchApyAndRate';


const FETCH_INTERVAL_MS = 15 * 1000;

const useStyles = makeStyles(styles);

export default function InvestCard(){
 
    const { t } = useTranslation();
    const { web3, address } = useConnectWallet();
    const { fetchApy, fetchRate} = useFetchApyAndRate({web3})
    const classes = useStyles();


    var data = {"amount":"0","web3":web3}


    return (
        <Card className={classes.cardContainer}>
             <Typography className={classes.text}>
                 Investment Plan
            </Typography>
            <Grid container direction="row">
                <Grid item md={6} xs={6}>
                    <Typography cstyle={{ fontSize: 18 }}>
                        Daily return:
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6} display="flex" >
                    <Box display="flex" direction="row" justifyContent="flex-end">
                        <Typography style={{ fontSize: 18 }}>
                            {fetchRate}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item md={6} xs={6}>
                    <Typography cstyle={{ fontSize: 18 }}>
                        APR:
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6} display="flex" >
                    <Box display="flex" direction="row" justifyContent="flex-end">
                        <Typography style={{ fontSize: 18 }}>
                            {fetchApy}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item md={6} xs={6}>
                    <Typography cstyle={{ fontSize: 18 }}>
                    Total Fee:
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6} display="flex" >
                    <Box display="flex" direction="row" justifyContent="flex-end">
                        <Typography style={{ fontSize: 18 }}>
                        {fetchRate}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );
}
