import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './styles';
import { getNetworkFriendlyName } from '../helpers/getNetworkData';
import InvestCard from './investcard';
import BondCard from './bondcard';
import ReferalCard from './referalcard';
import RewardCard from './rewardcard';
import { useFetchApproval } from './redux/fetchApproval';
import { useFetchApyAndRate } from './redux/fetchApyAndRate';
import { useFetchTaxFee } from './redux/fetchTaxFee';
import { useFetchUserBalance } from './redux/fetchUserBalance';
import { useFetchBondsForTokens } from './redux/fetchBondsForToken';


const FETCH_INTERVAL_MS = 15 * 1000;

const useStyles = makeStyles(styles);

export default function StableYield() {
  const { t } = useTranslation();
  const { web3, address, networkId, connected } = useConnectWallet();
  const { fetchBondsForTokenPending, fetchBondsForTokensValue } = useFetchBondsForTokens({ web3 })
  const { fetchHasApproved, fetchHasApprovedPending, fetchNeedApproval } = useFetchApproval({ web3 })
  const { fetchApyAndRate } = useFetchApyAndRate({ web3 })
  const { fetchTaxFee } = useFetchTaxFee({web3})
  const { fetchUserBalance } = useFetchUserBalance({web3})
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
  }, [fetchHasApprovedPending,fetchNeedApproval]);


  useEffect(() => {
    const getApproval = ()=>{
      if (address && web3) {
        fetchHasApproved({ web3 })
      }
    }
    getApproval()
  }, [web3]);

  useEffect(() => {
    const retrieveApyAndRateAndTax = ()=>{
      if (address && web3) {
        fetchApyAndRate({web3})
        fetchTaxFee({web3})
      }
    }
    retrieveApyAndRateAndTax()
  }, [web3]);
 

  useEffect(() => {
    const getUserBalance = ()=>{
      if (address && web3) {
        fetchUserBalance({ web3 })
      }
    }
    getUserBalance()
  }, [web3]);

  const chainNameLowercase = getNetworkFriendlyName().toLowerCase();
  const activePoolCount = 0
  return (
    <Grid container className={classes.container} direction="column">
      {web3 ? (
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12} md={6}>
              <Grid container direction="column">
                <Grid item>
                  <InvestCard hasApproved={fetchNeedApproval} />
                </Grid>
                <Grid item>
                  <BondCard hasApproved={fetchNeedApproval} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <ReferalCard />
                </Grid>
                <Grid item>
                  <RewardCard hasApproved={fetchNeedApproval}/>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : ("")}
    </Grid>
  );
}
