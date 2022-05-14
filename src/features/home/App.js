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
import { networkSettings} from 'common/networkSetup';
import { LaptopWindows } from '@material-ui/icons';

const themes = { dark: null, dark: null };
const getTheme = mode => {
  return (themes[mode] = themes[mode] || createThemeMode(mode === 'dark'));
};

const ScrollToTop = memo(function () {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
});

export default function App({ children }) {
  const { t } = useTranslation();
  const { connectWallet, web3, address, networkId, connected } = useConnectWallet();
  const { disconnectWallet } = useDisconnectWallet();
  const [web3Modal, setModal] = useState(null);

  const { isNightMode, setNightMode } = useNightMode();
  const theme = useMemo(() => getTheme(isNightMode ? 'dark' : 'dark'), [isNightMode]);
  const useStyles = useMemo(() => {
    return makeStyles(appStyle, { defaultTheme: theme });
  }, [theme]);
  const classes = useStyles();

  const isSupportedNetwork = networkId && networkId in networkSettings;
  useEffect(() => {
    if(isSupportedNetwork){
      setModal(createWeb3Modal(t));
    }
  }, [setModal, t]);

  useEffect(() => {
    if (web3Modal && (web3Modal.cachedProvider || window.ethereum)) {
      connectWallet(web3Modal);
    }
  }, [web3Modal, connectWallet]);

  const connectWalletCallback = useCallback(() => {
    connectWallet(web3Modal);
  }, [web3Modal, connectWallet]);

  const disconnectWalletCallback = useCallback(() => {
    disconnectWallet(web3, web3Modal);
  }, [web3, web3Modal, disconnectWallet]);

  useEffect(() => {
    if (window.ethereum) {
      const eth = async()=>{
        await window.ethereum
        console.log("eht test:",window.ethereum)
        console.log("eht testchainId:",window.ethereum.chainId)
        console.log("ideth:",parseInt(window.ethereum.chainId,16))
      }
      eth()
      if(window.ethereum.chainId == null){
        window.location.reload();
      }
      window.REACT_APP_NETWORK_ID = parseInt(window.ethereum.networkVersion);
      
      window.ethereum.on("connect", ()=>{
        console.log("Connected")
        console.log(parseInt(window.ethereum.chainId,16))
      })
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  });

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <ScrollToTop />
          <div className={classes.page}>
            <Header
              links={
                <HeaderLinks
                  address={address}
                  connected={connected}
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
                {networkId === window.REACT_APP_NETWORK_ID ? children : null}
                <Notifier />
              </div>
            </div>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </StylesProvider>
  );
}
