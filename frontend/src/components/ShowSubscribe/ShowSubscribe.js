import React from 'react';
import {Grid, makeStyles, Paper} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    margin:{
        marginLeft: '20%'
    }
}));

const ShowSubscribe = (eventsUser) => {
    const classes = useStyles();
    const events = [...eventsUser.eventsUser];

    return (
        <div className={classes.margin}>
            {events.map(event => (
                <Paper key={event._id}>
                    <Grid>
                        <p>Event Calendar: <b>{event.event}</b></p>
                        <p>lasting: <b>{event.lasting}</b> || date: <b>{event.datetime}</b></p>
                    </Grid>
                </Paper>
            ))}
        </div>
    );
};

export default ShowSubscribe;