import { grey } from "@material-ui/core/colors";

const styles = theme => ({
  cardContainer: {
    paddingTop: '16px',
    padding: 20,
    borderRadius:10,
    border: `0px`,
    marginTop: '20px',
    boxShadow: '0 0 1px rgb(48 49 51 / 5%), 0 8px 16px rgb(48 49 51 / 10%) !important',
    borderRadius: '12px 12px 12px 12px'
  },
  cardInputBox:{
    fontSize: 18,
    width: '100%',
    borderRadius:10,
  },
  cardInputContainer:{
    border: `2px solid ${grey[200]}`
  },
  titleLoader: {
    marginLeft: '12px',
  },
  text: {
    fontWeight: '550',
    marginBottom: 10,
    fontSize: 18 ,
  },
  valueText:{
    fontWeight: '700',
    marginLeft: 10,
    fontSize: 18 ,
  },
  approveButton:{
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 100,
    fontWeight: 700,
    color:'#fff',
    backgroundColor: '#95a8c9'
  },
  buyButton:{
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 100,
    fontWeight: 700,
    color:'#fff',
    backgroundColor: theme.palette.text.primary
  },
  rewardButton:{
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 100,
    fontWeight: 700,
    color: theme.palette.text.primary,
    backgroundColor: '#e8eefc'
  },
  divider: {
    margin: '10px 0',
    height: '2px',
    backgroundColor:grey[200]
  }
});

export default styles;
