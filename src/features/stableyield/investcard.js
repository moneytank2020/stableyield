import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './styles';
import { Box, Button, Card, TextField, Typography } from '@material-ui/core';
import { useFetchApproval } from './redux/fetchApproval';
import { useFetchApyAndRate } from './redux/fetchApyAndRate';
import { useFetchUserBalance } from './redux/fetchUserBalance';


const FETCH_INTERVAL_MS = 15 * 1000;

const useStyles = makeStyles(styles);

export default function InvestCard(){
    const { t } = useTranslation();
    const { web3, address } = useConnectWallet();
    const { fetchApproval, fetchNeedApproval } = useFetchApproval({ web3 })
    const { fetchUserBalanceValue } = useFetchUserBalance({web3})
    const { fetchApy, fetchRate} = useFetchApyAndRate({web3})
    const classes = useStyles();
    const handleClick = async()=>{
        if(!fetchNeedApproval){
            await fetchApproval({web3})
        }else{

        }
    }

    return (
        <Card style={{ padding: 20 , borderRadius:10}}>
            <Typography style={{ marginBottom: 10, marginRight: 10, fontSize: 28 }}>
                Choose amount to invest
            </Typography>
            <Grid container direction="row">
                <Grid item md={6} xs={6}>
                    <Typography style={{ marginBottom: 10, fontSize: 18 }}>
                        Your investment
                    </Typography>
                </Grid>
                <Grid item md={6} xs={6}  display="flex" >
                    <Box display="flex" direction="row" justifyContent="flex-end">
                        <Typography style={{marginBottom: 10,fontSize: 18 }}>
                            Wallet Balance:
                        </Typography>
                        <Typography style={{marginLeft: 10,fontSize: 18 }}>
                            {fetchUserBalanceValue}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Box display="flex" flexDirection="row" borderTop={1} borderBottom={1} borderLeft={1} borderRight={1} sx={{width:'100%', padding:10}}>
                <TextField style={{ fontSize: 18, width: '100%' }}  InputProps={{ disableUnderline: true }} id="outlined-basic"/>
                <Typography style={{ fontSize: 18, paddingTop:"0.5%" }}>
                    USDC
                </Typography>
            </Box>
            <Grid style={{ marginTop: 10 }} item md={6} xs={6}>
                <Typography style={{ marginBottom: 10, fontSize: 18 }}>
                    You receive:
                </Typography>
            </Grid>
            <Box display="flex" flexDirection="row" borderTop={1} borderBottom={1} borderLeft={1} borderRight={1} sx={{width:'100%', padding:10}}>
                <TextField style={{ fontSize: 18, width: '100%' }}  InputProps={{ disableUnderline: true }} id="outlined-basic"/>
                <Typography style={{ fontSize: 18, paddingTop:"0.5%" }}>
                    Bonds
                </Typography>
            </Box>
            <Button variant="contained" onClick={()=>{handleClick()}} style={{ width: '100%', marginTop: 20, marginBottom: 20, backgroundColor: "#11ad00" }}>{fetchNeedApproval?"BUY":"APPROVE"}</Button>
            <Box display="flex" flexDirection="row" sx={{width:'100%'}}>
                <Typography style={{ fontSize: 18 }}>
                    Current APY:
                </Typography>
                <Typography style={{ marginLeft:10, fontSize: 18 }}>
                    {fetchApy}
                </Typography>
            </Box>
            <Box display="flex" flexDirection="row" sx={{width:'100%'}}>
                <Typography style={{ fontSize: 18 }}>
                    Expected daily return:
                </Typography>
                <Typography style={{ marginLeft:10, fontSize: 18 }}>
                    {fetchRate}
                </Typography>
            </Box>
        </Card>
    );
}
