import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Container, Grid, makeStyles, Typography} from "@material-ui/core";
import FormElement from "../../components/Form/FormElement";
import ButtonWithProgress from "../../components/UI/AppToolbar/ButtonWithProgress/ButtonWithProgress";
import ReconnectingWebSocket from "reconnecting-websocket";
import {toast} from "react-toastify";
import {addNewSubscribe, userConnectedSub} from "../../store/actions/subscribeActions";
import {userConnected} from "../../store/actions/eventsActions";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.success.main,
    },
    form: {
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    alert: {
        marginTop: theme.spacing(3),
        width: "100%",
    },
}));

const Subscribe = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const ws = useRef(null);
    const user = useSelector(state => state.users.user);


    const [email, setEmail] = useState('');

    useEffect(() => {
        ws.current = new ReconnectingWebSocket('ws://localhost:8000/subscriptions?token=' + user.token);
        ws.current.onclose = () => {
            console.log('ws connected close');
            dispatch({type: 'CLEAR_USERS'});
        };

        ws.current.onmessage = event => {
            const parsed = JSON.parse(event.data);

            console.log(parsed);

            if (parsed.type === 'USER_CONNECTED') {
                console.log(parsed.payload);
                dispatch(userConnectedSub(parsed.payload));
            }

            if (parsed.type === 'NO_USER') {
                toast.success(parsed.message);
            }

            if (parsed.type === 'NEW_SUBSCRIBE') {
                toast.success(`Вы подписаны на ${parsed.payload.displayName}`);
                dispatch(addNewSubscribe(parsed.payload));
            }

            if (parsed.type === 'SUBSCRIBE') {
                toast.success(parsed.payload);
            }
        };

        return () => {
            ws.current.close();
        }
    }, [dispatch, user.token]);


    const inputChangeHandler = e => {
        const {name, value} = e.target;

        setEmail(value);
    };

    const subscribeFormHandler = e => {
        e.preventDefault();
        // dispatch(loginUserRequest({...user}));

        ws.current.send(JSON.stringify({
            type: 'CHECK_USER',
            email: email,
        }));
        setEmail('');
    };


    return (
        <Container component="section" maxWidth="xs">
            <div className={classes.paper}>
                <Typography component="h1" variant="h6">
                    Subscription
                </Typography>
                <Grid
                    component="form"
                    container
                    className={classes.form}
                    onSubmit={subscribeFormHandler}
                    spacing={2}
                >
                    <FormElement
                        required
                        type="text"
                        autoComlete="current-email"
                        label="Email"
                        name="email"
                        value={email}
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
                            find & Subscribe
                        </ButtonWithProgress>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default Subscribe;