import React, {useState} from 'react';
import {Container, Grid, makeStyles, TextField} from "@material-ui/core";
import FormElement from "../Form/FormElement";
import ButtonWithProgress from "../UI/AppToolbar/ButtonWithProgress/ButtonWithProgress";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },

}));

const NewEvent = ({onSubmit}) => {
    const classes = useStyles();


    const [event, setEvent] = useState({
        event: '',
        lasting: '',
        datetime: '',
    });

    const inputChangeHandler = e => {
        const {name, value} = e.target;

        setEvent(prevState => ({...prevState, [name]: value}));
    };



    const submitFormHandler = e => {
        e.preventDefault();
        onSubmit(event);
    };

    return (
        <Container component="section" maxWidth="xs">
            <div className={classes.paper}>
                <Grid
                    component="form"
                    container
                    className={classes.form}
                    onSubmit={submitFormHandler}
                    spacing={2}
                >
                    <FormElement
                        type="text"
                        autoComlete="new-event"
                        label="Event Calendar"
                        name="event"
                        value={event.event}
                        onChange={inputChangeHandler}
                    />

                    <FormElement
                        type="text"
                        autoComlete="new-lasting"
                        label="Lasting"
                        name="lasting"
                        value={event.lasting}
                        onChange={inputChangeHandler}
                    />

                    <TextField
                        type="date"
                        name="datetime"
                        value={event.datetime}
                        onChange={inputChangeHandler}
                    />

                    <Grid item xs={12}>
                        <ButtonWithProgress
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Add
                        </ButtonWithProgress>
                    </Grid>

                </Grid>
            </div>
        </Container>
    );
};

export default NewEvent;