import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@material-ui/core/Button';
import { networkSettings, networkSetup } from 'common/networkSetup';
import { getNetworkAppUrl, getNetworkFriendlyName, getHash } from 'features/helpers/getNetworkData';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { allNetworks } from 'network';

const useStyles = makeStyles(styles);
const targetNetworkId = window.REACT_APP_NETWORK_ID;

export function NetworkConnectNotice({
  web3,
  address,
  networkId,
  connectWallet,
  disconnectWallet,
}) {
  const [networkSetupError, setNetworkSetupError] = useState(null);
  const { t } = useTranslation();
  const haveConnection = !!web3;
  const haveAddress = !!address;
  const isCorrectNetwork = networkId === targetNetworkId;
  const isSupportedNetwork = networkId && networkId in networkSettings;
  const targetNetworkFriendlyName = getNetworkFriendlyName();
  const classes = useStyles();
  let notice = null;

  const targetNetworkSetup = useCallback(() => {
    setNetworkSetupError(null);

    networkSetup(targetNetworkId)
      .then(() => {
        setNetworkSetupError(null);
      })
      .catch(e => {
        if (typeof e === 'object' && typeof e.message === 'string') {
          setNetworkSetupError(e.message);
        } else if (typeof e === 'string') {
          setNetworkSetupError(e);
        } else {
          setNetworkSetupError(t('Network-UnknownError'));
        }
      });
  }, [setNetworkSetupError, t]);

  const networkRedirect = url => {
    window.location.assign(url);
    window.location.reload();
  };

  const changeToRightNetowk = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
    });
  }

  // useEffect(() => {
  //   if (window.ethereum != null) {
  //     console.log()
  //   }
  // }, [window.ethereum.networkVersion])

  const supportedNetwork = useMemo(() => {
    networkId = window.ethereum.chainId
    return isSupportedNetwork
      ? {
        id: networkId,
        url: getNetworkAppUrl(networkId),
        name: getNetworkFriendlyName(networkId),
      }
      : null;
  }, [window.ethereum.chainId]);

  

  function supportedNetworks() {
    var networks = ""
    allNetworks.forEach((value, index) => {
      networks += value.name
      if (index < allNetworks.length - 2) {
        networks += ", "
      } else if (index == allNetworks.length - 2) {
        networks += " & "
      }
    })
    return networks
  }
  var isNetworkSupported = allNetworks.find(n => window.ethereum.chainId == n.id) == null
  if (isNetworkSupported && haveConnection) {
    notice = (
      <>
        <div className={classes.message}>
          {t('Network-Supports', { network: supportedNetworks() })}{' '}
        </div>
        <div className={classes.note}>{t('Network-SwitchNote')}</div>
        {networkSetupError ? <div className={classes.error}>{networkSetupError}</div> : ''}
      </>
    );
  }else if (!haveConnection){
    notice = (
      <>
        <div className={classes.message}>
          {t('Network-ConnectWallet')}{' '}
        </div>
        {networkSetupError ? <div className={classes.error}>{networkSetupError}</div> : ''}
      </>
    );
  }
  // if (!haveConnection) {
  // notice = (
  //   <>
  //     <div className={classes.message}>
  //       {t('Network-ConnectionRequired', { network: targetNetworkFriendlyName })}
  //     </div>
  //     <div className={classes.actions}>
  //       <Button onClick={connectWallet} className={classes.button}>
  //         {t('Network-ConnectWallet')}
  //       </Button>
  //     </div>
  //   </>
  // );
  // } else if (!isCorrectNetwork) {

  //   if(getHash(networkId) != undefined){
  //     // networkRedirect(supportedNetwork.url)
  //   }else{
  //     notice = (
  //       <>
  //         <div className={classes.message}>
  //           {t('Network-Supports', { network: targetNetworkFriendlyName })}{' '}
  //           {isSupportedNetwork
  //             ? t('Network-ConnectedTo', { network: supportedNetwork.name })
  //             : t('Network-ConnectedUnsupported')}
  //         </div>
  //         <div className={classes.actions}>
  //           <Button onClick={targetNetworkSetup} className={classes.button}>
  //             {t('Network-SwitchToNetwork', { network: targetNetworkFriendlyName })}
  //           </Button>
  //           {/* {isSupportedNetwork ? (
  //             <Button
  //               onClick={() => changeToRightNetowk(supportedNetwork.url)}
  //               className={classes.button}
  //             >
  //               {t('Network-GoToApp', { network: supportedNetwork.name })}
  //             </Button>
  //           ) : null} */}
  //           <Button onClick={disconnectWallet} className={classes.button}>
  //             {t('Network-DisconnectWallet')}
  //           </Button>
  //         </div>
  //         <div className={classes.note}>{t('Network-SwitchNote')}</div>
  //         {networkSetupError ? <div className={classes.error}>{networkSetupError}</div> : ''}
  //       </>
  //     );
  //   }
  // } else if (!haveAddress) {
  //   notice = (
  //     <>
  //       <div className={classes.message}>
  //         {t('Network-ConnectedTo', { network: targetNetworkFriendlyName })}
  //       </div>
  //       <div className={classes.error}>{t('Network-NoWalletAddress')}</div>
  //     </>
  //   );
  // }

  return notice ? <div className={classes.notice}>{notice}</div> : null;
}
