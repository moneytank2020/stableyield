import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles, ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import Header from 'components/Header/Header';
import HeaderLinks from 'components/HeaderLinks/HeaderLinks';
import { useTranslation } from 'react-i18next';
import { SnackbarProvider } from 'notistack';
import { Notifier } from 'features/common';
import Footer from 'components/Footer/Footer';
import { NetworkConnectNotice } from 'components/NetworkConnectNotice/NetworkConnectNotice';
import appStyle from './jss/appStyle.js';
import { createWeb3Modal } from '../web3';
import { useConnectWallet, useDisconnectWallet } from './redux/hooks';
import useNightMode from './hooks/useNightMode';
import createThemeMode from './jss/appTheme';
import { useLocation } from 'react-router';
import { networkSettings } from 'common/networkSetup.js';
import { allNetworks } from 'network.js';
import { useFetchUserBalance } from 'features/stableyield/redux/fetchUserBalance.js';
import { useFetchUserBonds } from 'features/stableyield/redux/fetchUserBonds.js';

const themes = { dark: null, dark: null };
const getTheme = mode => {
  return (themes[mode] = themes[mode] || createThemeMode(mode === 'dark'));
};

// const ScrollToTop = memo(function () {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// });

export default function App({ children }) {
  const { t } = useTranslation();
  const { connectWallet, web3, address, networkId, connected } = useConnectWallet();
  const { disconnectWallet } = useDisconnectWallet();
  const { fetchUserBalance } = useFetchUserBalance({ web3 })
  const { fetchUserBonds } = useFetchUserBonds({ web3 })
  const [web3Modal, setModal] = useState(null);

  const { isNightMode, setNightMode } = useNightMode();
  const theme = useMemo(() => getTheme(isNightMode ? 'dark' : 'dark'), [isNightMode]);
  const useStyles = useMemo(() => {
    return makeStyles(appStyle, { defaultTheme: theme });
  }, [theme]);
  const classes = useStyles();

  useEffect(() => {
    setModal(createWeb3Modal(t));
  }, [setModal, t]);

  useEffect(() => {
    if (web3Modal && (web3Modal.cachedProvider || window.ethereum) && isSupportedNetwork.supported) {
      console.log("test")
      connectWallet(web3Modal);
    }
  }, [web3Modal, connectWallet]);

  const [isSupportedNetwork, setIsSupportNetwork] = useState({
    supported:false
  })

  useEffect(() => {
    console.log("netV:",window.ethereum.networkVersion)
    if (window.ethereum != null) {
      if (web3Modal && (web3Modal.cachedProvider || window.ethereum)){
        connectWallet(web3Modal);
      }
      window.ethereum.on('accountsChanged', function (accounts) {
        if (web3) {
          fetchUserBalance({ web3 })
          fetchUserBonds({ web3 })
        }
      })
    }
  }, [window.ethereum.networkVersion])

  const connectWalletCallback = useCallback(() => {
    connectWallet(web3Modal);
    setIsSupportNetwork(prevState=>({
      ...prevState,
      supported: allNetworks.find(n => window.ethereum.chainId ==  n.id) != null
    }))
    
  }, [web3Modal, connectWallet]);

  const disconnectWalletCallback = useCallback(() => {
    disconnectWallet(web3, web3Modal);
  }, [web3, web3Modal, disconnectWallet]);


  useEffect(()=>{
    setIsSupportNetwork(prevState=>({
      ...prevState,
      supported: allNetworks.find(n => window.ethereum.chainId ==  n.id) != null
    }))
  },[window.ethereum.chainId])

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          {/* <ScrollToTop /> */}
          <div className={classes.page}>
            <Header
              links={
                <HeaderLinks
                  connectWallet={connectWalletCallback}
                  disconnectWallet={disconnectWalletCallback}
                  isNightMode={isNightMode}
                  setNightMode={() => setNightMode(!isNightMode)}
                />
              }
              isNightMode={isNightMode}
              setNightMode={() => setNightMode(!isNightMode)}
            />
            <div className={classes.container}>
              <div className={classes.children}>
                <NetworkConnectNotice
                  web3={web3}
                  address={address}
                  connectWallet={connectWalletCallback}
                  disconnectWallet={disconnectWalletCallback}
                  networkId={networkId}
                />
                {console.log("supported:",isSupportedNetwork.supported)}
                {isSupportedNetwork.supported ? children : null}
                <Notifier />
              </div>
            </div>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </StylesProvider>
  );
}
