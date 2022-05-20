import { grey } from "@material-ui/core/colors";

const styles = theme => ({
    cardContainer: {
        paddingTop: '16px',
        padding: 20,
        borderRadius:10,
        border: `1px solid #ecf0f8`,

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
        fontWeight: 700,
        backgroundColor: "#11ad00",
        borderRadius: 100
    },
    button:{
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 100,
        fontWeight: 700,
        backgroundColor: theme.palette.text.primary
    }
});

export default styles;
