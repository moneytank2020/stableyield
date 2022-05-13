import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './styles';
import { Avatar, Button, Card, colors, TextField, Typography } from '@material-ui/core';
import { Box } from '@mui/material';
import { useFetchApproval } from './redux/fetchApproval';

const FETCH_INTERVAL_MS = 15 * 1000;

const useStyles = makeStyles(styles);

export default function BondCard(
    hasApproved
) {
    const { t } = useTranslation();
    const { web3, address } = useConnectWallet();
    const classes = useStyles();
    const { fetchApproval, fetchApprovalPending, fetchApprovalError, fetchHasApproved, fetchHasApprovedPending, fetchHasApprovedError, fetchNeedApproval } = useFetchApproval({ web3: web3 })
    const handleClick = async()=>{
        if(!fetchNeedApproval){
            await fetchApproval({web3})
        }else{

        }
    }

    return (
        <Card style={{ padding: 20 }}>
            <Grid container direction="row">
                <Grid item md={6} xs={6}>
                    <Typography style={{marginBottom:10,fontSize: 28 }}>
                        Sell Bonds
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6}  display="flex" >
                    <Box display="flex" justifyContent="flex-end">
                        <Typography style={{marginTop:7,fontSize: 18 }}>
                            Balance:
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Box display="flex" flexDirection="row" borderTop={1} borderBottom={1} borderLeft={1} borderRight={1} sx={{padding:2, marginBottom: 1}}>
                <TextField style={{ fontSize: 18, width: '100%' }}  InputProps={{ disableUnderline: true }} id="outlined-basic"/>
                <Typography style={{ fontSize: 18, paddingTop:"0.5%" }}>
                    USDC
                </Typography>
            </Box>
            <Grid container direction="row">
                <Grid item md={6} xs={6}>
                    <Typography style={{color:"#ff0000", marginBottom: 10, fontSize: 18 }}>
                        Tax:
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6} display="flex">
                    <Box display="flex" flexDirection="row" justifyContent="flex-end">
                    <Typography style={{fontSize: 18 }}>
                        Total:
                    </Typography>
                    </Box>
                </Grid>
            </Grid>
            {/* <TextField style={{ fontSize: 18, width: '100%' }} id="outlined-basic" variant="outlined" />*/}
            <Button variant="contained" onClick={()=>{handleClick()}} style={{ width: '100%', marginTop: 10, marginBottom: 20, backgroundColor: "#0066ff" }}>{fetchNeedApproval?"Withdrawal":"Approve"}</Button>
        </Card>
    );
}