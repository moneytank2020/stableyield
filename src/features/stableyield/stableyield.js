import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './styles';
import { getNetworkFriendlyName } from '../helpers/getNetworkData';
import BondCard from './bondcard';
import ReferalCard from './referralcard';
import { useFetchApproval } from './redux/fetchApproval';
import { useFetchApyAndRate } from './redux/fetchApyAndRate';
import { useFetchTaxFee } from './redux/fetchTaxFee';
import { useFetchUserBalance } from './redux/fetchUserBalance';
import { useFetchBondsForTokens } from './redux/fetchBondsForToken';
import { Typography } from '@material-ui/core';
import { useFetchContractBalance } from './redux/fetchContractBalance';
import { fetchUserBonds, useFetchUserBonds } from './redux/fetchUserBonds';
import { useBuyTokens } from './redux/buyTokens';
import { useFetchUserTokenReward } from './redux/fetchUserTokenRewards';
import { useSellTokens } from './redux/sellTokens';
import BuyCard from './buycard';
import InvestCard from './investcard';
import { useFetchReferralBonus } from './redux/fetchReferralBonus';


const FETCH_INTERVAL_MS = 15 * 1000;

const useStyles = makeStyles(styles);

export default function StableYield() {
  const { t } = useTranslation();
  const { web3, address, networkId, connected } = useConnectWallet();
  const { fetchHasApproved, fetchHasApprovedPending, fetchNeedApproval } = useFetchApproval({ web3 })
  const { fetchContractBalance } = useFetchContractBalance({ web3 })
  const { fetchReferralBonus } = useFetchReferralBonus({ web3 })
  const { fetchApyAndRate } = useFetchApyAndRate({ web3 })
  const { fetchTaxFee } = useFetchTaxFee({ web3 })
  const { fetchUserBalance } = useFetchUserBalance({ web3 })
  const { fetchUserBonds } = useFetchUserBonds({ web3 })
  const { buyTokensPending } = useBuyTokens({ web3 })
  const { sellTokensPending } = useSellTokens({ web3 })
  const { fetchUserTokenReward } = useFetchUserTokenReward({ web3 })
  const classes = useStyles();

  useEffect(() => {
    // const id = setInterval(FETCH_INTERVAL_MS);
    // return () => clearInterval(id);
  });



  useEffect(() => {
    const fetch = () => {
      if (address && web3) {
        // fetchApproval({web3})
      }
    };
    fetch();
    const id = setInterval(fetch, FETCH_INTERVAL_MS);
    return () => clearInterval(id);

    // Adding tokens and pools to this dep list, causes an endless loop, DDoSing the api
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchHasApprovedPending, fetchNeedApproval]);


  useEffect(() => {
    const getApproval = () => {
      if (address && web3) {
        console.log("web3:",web3)
        console.log("networkId:",networkId)
        fetchHasApproved({ web3 })
      }
    }
    getApproval()
  }, [web3]);

  useEffect(() => {
    const retrieveApyAndRateAndTax = () => {
      if (address && web3) {
        fetchApyAndRate({ web3 })
        fetchTaxFee({ web3 })
      }
    }
    retrieveApyAndRateAndTax()
  }, [web3,]);


  useEffect(() => {
    const getUserBalance = () => {
      if (address && web3 && !buyTokensPending && !sellTokensPending) {
        fetchUserBalance({ web3 })
        fetchContractBalance({ web3 })
        fetchUserBonds({ web3 })
        fetchUserTokenReward({ web3 })
        fetchReferralBonus({ web3 })
      }
    }
    getUserBalance()
  }, [web3, buyTokensPending, sellTokensPending]);

  return (
    <Grid container className={classes.container} direction="column">
      {web3 ? (
        <Grid item>
          <Typography className={classes.title}>
            Deposit and Earn
          </Typography>
          <Typography className={classes.valueText}>
            Deposit USDC, buy bonds and earn daily rewards. The best investment protocol during bear markets.
          </Typography>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12} md={6}>
              <Grid container direction="column">
                <Grid item>
                  <BuyCard />
                </Grid>
                {/* <Grid item>
                  <BondCard />
                </Grid> */}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container direction="column" >
                <Grid item>
                  <InvestCard />
                </Grid>
                <Grid item>
                  <ReferalCard />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : ("")}
    </Grid>
  );
}
