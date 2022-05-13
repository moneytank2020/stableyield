import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './styles';
import { Avatar, Box, Button, Card, colors, TextField, Typography } from '@material-ui/core';
import { useFetchApproval } from './redux/fetchApproval';

const FETCH_INTERVAL_MS = 15 * 1000;

const useStyles = makeStyles(styles);

export default function RewardCard() {
    const { t } = useTranslation();
    const classes = useStyles();
    const { web3, address } = useConnectWallet();
    const { fetchApproval, fetchNeedApproval } = useFetchApproval({ web3: web3 })

    const handleClick = async()=>{
        if(!fetchNeedApproval){
            await fetchApproval({web3})
        }else{

        }
    }
    return (
        <Card style={{ padding: 20, borderRadius: 10 }}>
            <Typography style={{ marginBottom: 10, fontSize: 18 }}>
                    Your Rewards
            </Typography>
            <Box display="flex" flexDirection="row" sx={{ width: '100%', padding: 10 }}>
                <Typography style={{  marginTop: 8, fontSize: 18 }}>
                    Bonds   
                </Typography>
                <Typography style={{ marginRight: 50, marginLeft:50, fontSize: 30 }}>
                    |   
                </Typography>
                <Typography style={{ marginTop: 8, fontSize: 18 }}>
                    $   
                </Typography>
            </Box>
            <Button variant="contained" onClick={()=>{handleClick()}}style={{ width: '100%', marginBottom: 20, backgroundColor: "#0066ff" }}>{fetchNeedApproval?"Re-Invest":"Approve"}</Button>
            <Typography>
                By re-investing, you are compounding your rewards back into the pool
            </Typography>
        </Card>
    );
}