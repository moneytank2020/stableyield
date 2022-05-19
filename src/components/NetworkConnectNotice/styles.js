import { grey } from "@material-ui/core/colors";

const styles = theme => ({
  notice: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    marginBottom: 25,
    textAlign: 'center',
    border: `5px solid ${grey[200]}`,
    borderRadius:'25px',
    color: theme.palette.text.primary,
    '& > :last-child': {
      marginBottom: 0,
    },
  },
  message: {
    marginBottom: 15,
  },
  actions: {
    margin: '-10px -10px 15px 0',
  },
  button: {
    border: '1px solid ' + theme.palette.background.border,
    padding: '4px 8px',
    backgroundColor: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.background.border,
      cursor: 'pointer',
    },
    textTransform: 'none',
    margin: '10px 10px 0 0',
  },
  note: {
    marginBottom: 15,
    fontStyle: 'italic',
  },
  error: {
    color: 'red',
  },
});

export default styles;
