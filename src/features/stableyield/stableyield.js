import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import Grid from '@material-ui/core/Grid';
import LinearProgress from "@material-ui/core/LinearProgress";
import TVLLoader from './TVLLoader/TVLLoader';
import NetworksToggle from 'components/NetworksToggle/NetworksToggle';
import { useConnectWallet } from 'features/home/redux/hooks';
import styles from './styles';
import { formatGlobalTvl } from 'features/helpers/format';
import { getNetworkFriendlyName } from '../helpers/getNetworkData';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Avatar, Button, Card, colors, Divider, TableRow, TextField, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { SpaceBar } from '@material-ui/icons';
import InvestCard from './investcard';
import BondCard from './bondcard';
import ReferalCard from './referalcard';
import RewardCard from './rewardcard';

const FETCH_INTERVAL_MS = 15 * 1000;

const useStyles = makeStyles(styles);

export default function StableYield() {
  const { t } = useTranslation();
  const { web3, address, networkId, connected } = useConnectWallet();
  const classes = useStyles();

  useEffect(() => {
    // const id = setInterval(FETCH_INTERVAL_MS);
    // return () => clearInterval(id);
  });


  useEffect(() => {
    const fetch = () => {
      if (address && web3) {

      }
    };
    fetch();

    const id = setInterval(fetch, FETCH_INTERVAL_MS);
    return () => clearInterval(id);

    // Adding tokens and pools to this dep list, causes an endless loop, DDoSing the api
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chainNameLowercase = getNetworkFriendlyName().toLowerCase();
  const activePoolCount = 0
  return (
    <Grid container className={classes.container} direction="column">
      <Grid item>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <InvestCard/>
              </Grid>
              <Grid item>
                <BondCard/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <ReferalCard/>
              </Grid>
              <Grid item>
                <RewardCard/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>

    // <Grid container className={classes.container} direction="column">
    //   <Grid md={12} lxs={12} container direction="row" spacing={2}>
    //     <Grid xs={12} md={6} item direction="column" spacing={2}>
    //       <Card>
    //         <Typography>
    //             The Apex Lottery
    //         </Typography>
    //       </Card>
    //       <Box/>
    //       <Card>
    //         <Typography>
    //             The Apex Lottery
    //         </Typography>
    //       </Card>
    //     </Grid>
    //     <Grid xs={12} md={6} item direction="column">
    //       <Card>
    //         <Typography>
    //             The Apex Lottery
    //         </Typography>
    //       </Card>
    //       <Card>
    //         <Typography>
    //             The Apex Lottery
    //         </Typography>
    //       </Card>
    //     </Grid>
    //   </Grid>
    // </Grid>
  );
}
