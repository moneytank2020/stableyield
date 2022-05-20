import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './bondcardstyles';
import { Button, Card, Typography } from '@material-ui/core';
import { Box } from '@mui/material';
import { useFetchApproval } from './redux/fetchApproval';
import { useSellTokens } from './redux/sellTokens';
import { useReInvestBonds } from './redux/reinvestBonds';
import { useFetchUserTokenReward } from './redux/fetchUserTokenRewards';

const FETCH_INTERVAL_MS = 15 * 1000;

const useStyles = makeStyles(styles);

export default function BondCard() {

    const { t } = useTranslation();
    const { web3, address } = useConnectWallet();
    const classes = useStyles();
    const { fetchApproval, isApproved, fetchApprovalPending } = useFetchApproval({ web3 })
    const { reInvestBonds } = useReInvestBonds({ web3 })
    const { sellTokens } = useSellTokens({web3})
    const { fetchUserTokenRewardValue } = useFetchUserTokenReward({ web3 })
    const queryParams = new URLSearchParams(window.location.search);
    const referral = queryParams.get('ref');

    const handleRedeemClick = async () => {
        if (!isApproved) {
            await fetchApproval({ web3 })
        } else {
            await sellTokens({ web3 })
        }
    }

    const handleReInvestClick = async () => {
        if (!isApproved) {
            await fetchApproval({ web3 })
        } else {
            await reInvestBonds({ web3, referral })
        }
    }

    return (
        <Card className={classes.cardContainer}>
            <Grid container direction="row">
                <Grid item md={6} xs={6}>
                    <Typography className={classes.text}>
                        Your Rewards
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6} display="flex" >
                    <Box display="flex" justifyContent="flex-end">
                        <Typography className={classes.text} style={{ marginTop: 7 }}>
                            {`${fetchUserTokenRewardValue} USDC`}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={2}>
                <Grid item md={6} xs={6}>
                    <Button variant="contained" onClick={() => { handleReInvestClick() }} className={isApproved ? classes.actionButton : classes.approveButton}>{isApproved ? "Reinvest" : "Approve"}</Button>
                </Grid>
                <Grid item md={6} xs={6} display="flex" >
                    <Button variant="contained" sx={{ '.MuiButton-label': {color: '#000000',fontSize: '14px'}}} onClick={() => { handleRedeemClick() }} className={classes.actionButton}>{isApproved ? "Redeem" : "Approve"}</Button>
                </Grid>
            </Grid>

        </Card>
    );
}