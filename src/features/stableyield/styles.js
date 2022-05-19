const styles = theme => ({
  container: {
    paddingTop: '4px',
    background: '#FFFFFFFF',
  },
  divider:{
    color: theme.palette.text.primary, 
    width:'100%', 
    height:10
  },
  title: {
    fontSize: '32px',
    letterSpacing: '0',
    lineHeight: '32px',
    fontWeight: '550',
    marginBottom: 10, 
    marginRight: 10,
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
  },
  titleLoader: {
    marginLeft: '12px',
  },
  subtitle: {
    letterSpacing: '0',
    lineHeight: '8px',
    [theme.breakpoints.down('xs')]: {
      lineHeight: '16px',
    },
    color: theme.palette.text.secondary,
    marginTop: '0',
  },
  text: {
    fontSize: '24px',
    letterSpacing: '0',
    lineHeight: '32px',
    fontWeight: '550',
    paddingTop:'10',
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
  },
  infinityIcon: {
    marginBottom: '-6px',
    paddingRight: '5px',
  },
});

export default styles;
