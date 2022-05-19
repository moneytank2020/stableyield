import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './buycardstyles';
import { Box, Button, Card, TextField, Typography } from '@material-ui/core';
import { useFetchApproval } from './redux/fetchApproval';
import { useFetchUserBalance } from './redux/fetchUserBalance';
import { useFetchBondsForTokens } from './redux/fetchBondsForToken';
import { useFetchContractBalance } from './redux/fetchContractBalance';
import { useFetchUserBonds } from './redux/fetchUserBonds';
import { useBuyTokens } from './redux/buyTokens';


const FETCH_INTERVAL_MS = 15 * 1000;

const useStyles = makeStyles(styles);

export default function BuyCard() {

    
    const { t } = useTranslation();
    const { web3, address } = useConnectWallet();
    const queryParams = new URLSearchParams(window.location.search);
    const [buySettings] = useState({
        amount:0,
        web3:web3,
        referral:queryParams.get('ref')
    })

    const { fetchApproval, isApproved, fetchApprovalPending, fetchHasApprovedPending } = useFetchApproval({ web3 })
    const { fetchBondsForTokens, fetchBondsForTokensValue } = useFetchBondsForTokens({ buySettings })
    const { fetchUserBalanceValue } = useFetchUserBalance({ web3 })
    const { fetchContractBalanceValue } = useFetchContractBalance({ web3 })
    const { fetchUserBondsValue } = useFetchUserBonds({ web3 })
    const { buyTokens } = useBuyTokens({ web3 })
    const classes = useStyles();

    
    const handleClick = async () => {
        if (!isApproved) {
            await fetchApproval({ web3 })
        } else {
            await buyTokens(buySettings)
        }
    }

    

    const handleAmountChange = async (amount) => {
        buySettings.amount = amount
        await fetchBondsForTokens(buySettings)
    }

    return (
        <Card className={classes.cardContainer}>
            <Grid container direction="row">
                <Grid item md={6} xs={6}>
                    <Typography className={classes.text}>
                        Contract
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6} display="flex" >
                    <Box display="flex" direction="row" justifyContent="flex-end">
                        <img
                            alt="stableyield"
                            src={require('images/usdc.png')}
                            height={'25px'}
                            className={classes.logo}
                        />
                        <Typography className={classes.valueText}>
                            {fetchContractBalanceValue}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item md={6} xs={6}>
                    <Typography className={classes.text}>
                        Wallet
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6} display="flex" >
                    <Box display="flex" direction="row" justifyContent="flex-end">
                        {/*<Typography className={classes.text}>*/}
                        {/*    USDC*/}
                        {/*</Typography>*/}
                        <img
                            alt="stableyield"
                            src={require('images/usdc.png')}
                            height={'25px'}
                            className={classes.logo}
                        />
                        <Typography className={classes.valueText}>
                            {fetchUserBalanceValue}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item md={6} xs={6}>
                    <Typography className={classes.text}>
                        Your investment
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6} display="flex" >
                    <Box display="flex" direction="row" justifyContent="flex-end">
                        <Typography className={classes.text}>
                            BONDS
                        </Typography>
                        <Typography className={classes.valueText}>
                            {fetchUserBondsValue}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Box display="flex" flexDirection="row" className={classes.cardInputContainer} sx={{ width: '100%', padding: 10 }}>
                <TextField className={classes.cardInputBox} InputProps={{ disableUnderline: true }} id="outlined-basic" onChange={(event) => { handleAmountChange(event.target.value) }} />
                <Typography className={classes.valueText} style={{ paddingTop: "0.5%" }}>
                    USDC
                </Typography>
            </Box>
            <Grid style={{ marginTop: 10 }} item md={12} xs={12}>
                <Typography className={classes.text}>
                    {parseInt(fetchBondsForTokensValue) > 0 ? `You receive: ${fetchBondsForTokensValue} BONDS` : ""}
                </Typography>
            </Grid>
            <Button variant="contained" onClick={() => { handleClick() }} disabled={fetchApprovalPending || fetchHasApprovedPending? true : false } className={isApproved ? classes.button : classes.approveButton}>{isApproved ? "BUY" : "APPROVE"}</Button>
        </Card>
    );
}
