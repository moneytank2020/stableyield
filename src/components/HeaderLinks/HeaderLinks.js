import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Hidden from '@material-ui/core/Hidden';
import { WbSunny, NightsStay } from '@material-ui/icons';
import Button from 'components/CustomButtons/Button.js';
import { useTranslation } from 'react-i18next';
import { LanguageDropdown } from '../LanguageDropdown/LanguageDropdown';
import Davatar from '@davatar/react';
import { ReactComponent as BNBLogo } from '../../images/bnbLogo.svg'
import { ReactComponent as FTMLogo } from '../../images/ftmLogo.svg'
import styles from './styles';
import { useENS } from 'features/home/hooks/useENS';
import { allNetworks } from 'network';
import { ButtonBase, SvgIcon } from '@material-ui/core';
import { useConnectWallet } from 'features/home/redux/connectWallet';

const useStyles = makeStyles(styles);

const HeaderLinks = ({
  connectWallet,
  disconnectWallet,
  isNightMode,
  setNightMode,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [shortAddress, setShortAddress] = useState('');
  const { web3, networkId, address, connected } = useConnectWallet();
  const { ensName } = useENS(address);
  useEffect(() => {
    if (!connected) {
      return;
    }

    if (address.length < 11) {
      setShortAddress(address);
    } else {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [address, connected]);

  const changeToRightNetwork = async (value) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: value.chainId }], // chainId must be in hexadecimal numbers
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: value.chainId, rpcUrl: value.rpcUrl }],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  function getIcon(network) {
    switch (network) {
      case 'Binance':
        return <BNBLogo />
      case 'Fantom':
        return <FTMLogo />
    }

  }

  // const [network, setNetwork] = useState({
  //   networkId: null
  // })

  // window.ethereum.on('networkChanged', function(networkId){
  //   console.log('networkChanged',networkId);
  //   setNetwork=>((prevState){

  //   })
  // });

  function getLink(value) {
    if (networkId != value.id) {
      return () => {
        changeToRightNetwork(value)
      }
    } else {
      return null
    }
  }

  const networks = []
  allNetworks.forEach((value) => {
    networks.push(
      <ListItem key={value.id} className={classes.listItem}>
        <ButtonBase onClick={getLink(value)} focusRipple>
          <SvgIcon className={networkId != value.id || !connected ? null : classes.largeIcon}>
            {getIcon(value.name)}
          </SvgIcon>
        </ButtonBase>
      </ListItem>
    )
  })

  return (
    <List className={classes.list + ' ' + classes.mlAuto}>
      {networks}
      {/* <ListItem className={classes.listItem}>
        <LanguageDropdown navLinkClass={classes.navLink} />
      </ListItem> */}
      <ListItem className={classes.listItem}>
        <Button
          disableElevation
          className={classes.walletDisplay}
          onClick={connected ? disconnectWallet : connectWallet}
        >
          {connected ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '7px' }}>
                  <Davatar size={24} address={address} />
                </div>
                <div>{ensName || shortAddress}</div>
              </div>
            </>
          ) : (
            <>
              <i className={classes.icon + ' far fa-question-circle'} />
              {t('Vault-Wallet')}
            </>
          )}
        </Button>
      </ListItem>
    </List>
  );
};

export default HeaderLinks;
