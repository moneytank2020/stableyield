import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Menu from '@material-ui/icons/Menu';
import Close from '@material-ui/icons/Close';
import WbSunny from '@material-ui/icons/WbSunny';
import NightsStay from '@material-ui/icons/NightsStay';
import { getNetworkBuyUrl } from '../../features/helpers/getNetworkData';
import { Dialog, withStyles } from '@material-ui/core';
import CustomButton from '../../components/CustomButtons/Button';
import Transak from '../Transak/Transak';
import styles from './styles';

const useStyles = makeStyles(styles);

const Header = ({ links }) => {
  const { chain } = useParams();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const classes = useStyles();
  const { t } = useTranslation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar className={`${classes.appBar}`} position="relative">
      <Toolbar className={classes.container}>
        <img
            alt="stableyield"
            src={require('images/sylogo.png')}
            height={'55px'}
            className={classes.logo}
        />
        <div className={classes.middleNav}>
          <Hidden smDown>
            {renderLink('Telegram', t('Telegram'), '', classes)}
            {renderLink('Knowledge Base', t('Knowledge Base'), '', classes)}
          </Hidden>
        </div>

        <Hidden smDown implementation="css">

          <div className={classes.collapse}>{links}</div>
        </Hidden>
        <Hidden mdUp>
          <IconButton
            className={classes.iconButton}
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>

      <Hidden mdUp implementation="js">
        <Drawer
          variant="temporary"
          anchor={'right'}
          open={mobileOpen}
          classes={{
            paper: classes.drawerPaper,
          }}
          onClose={handleDrawerToggle}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className={classes.closeButtonDrawer}
          >
            <Close />
          </IconButton>
          <div className={classes.appResponsive}>{links}</div>
          <div className={classes.middleNav}>
              {renderLink('Telegram', t('Telegram'), '', classes)}
          </div>
          <div style={{ marginTop: '10px' }} className={classes.middleNav}>
            {renderLink('Knowledge Base', t('Knowledge Base'), '', classes)}
          </div>
        </Drawer>
      </Hidden>
    </AppBar>
  );
};


const renderLink = (name, label, icon, classes) => {
  return (
      <a
          href={getLinkUrl(name)}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.link}
          style={{ marginLeft: '5px', marginRight: '5px' , color:'#FFFFFFFF'}}
      >
        <i className={`fas fa-${icon} ${classes.icon}`} />
        <span>{label}</span>
      </a>
  );
};

const LinkSidebar = ({ name, label, icon, classes }) => (
    <div style={{ width: '100%', paddingTop: '10px' }}>{renderLink(name, label, icon, classes)}</div>
);

const getLinkUrl = name => {
  if (name === 'buy'){
    return getNetworkBuyUrl()
  } else if (name === 'Telegram'){
    return `https://t.me/stableyieldio`
  } else {
    return `https://stableyield2020.gitbook.io/stableyield-knowledge-base/`
  };
};

export default Header;
