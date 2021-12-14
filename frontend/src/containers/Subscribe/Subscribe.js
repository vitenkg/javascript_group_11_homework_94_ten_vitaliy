import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Container, Divider, Grid, makeStyles, Typography} from "@material-ui/core";
import FormElement from "../../components/Form/FormElement";
import ButtonWithProgress from "../../components/UI/AppToolbar/ButtonWithProgress/ButtonWithProgress";
import ReconnectingWebSocket from "reconnecting-websocket";
import {toast} from "react-toastify";
import {addNewSubscribe, loadSubEvents, userConnectedSub} from "../../store/actions/subscribeActions";
import AppDrawer from "../../components/UI/AppDrawer/AppDrawer";
import ShowSubscribe from "../../components/ShowSubscribe/ShowSubscribe";

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
        margin: theme.spacing(2, 0, 2),
    },
    alert: {
        marginTop: theme.spacing(3),
        width: "100%",
    },
    margin:{
        marginLeft: theme.spacing(3)
    }
}));

const Subscribe = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const ws = useRef(null);
    const user = useSelector(state => state.users.user);
    const subscribeEvents = useSelector(state => state.subscribe.eventsUsers);
    const subUserId = useSelector(state => state.subscribe.subscribeUserId);


    const [email, setEmail] = useState('');


    useEffect(() => {
        ws.current = new ReconnectingWebSocket('ws://localhost:8000/subscriptions?token=' + user.token);
        ws.current.onclose = () => {
            console.log('ws connected close');
        };

        ws.current.onmessage = event => {
            const parsed = JSON.parse(event.data);

            if (parsed.type === 'USER_CONNECTED') {
                dispatch(userConnectedSub(parsed.payload));
            }

            if (parsed.type === 'NO_USER') {
                toast.error(parsed.payload);
            }

            if (parsed.type === 'NEW_SUBSCRIBE') {
                toast.success(`Вы подписаны на ${parsed.payload.displayName}`);
                dispatch(addNewSubscribe(parsed.payload));
            }

            if (parsed.type === 'SUBSCRIBE') {
                toast.success(parsed.payload);
            }

            if (parsed.type === 'SUB_EVENTS') {
                dispatch(loadSubEvents(parsed.payload));
            }
        };

        return () => {
            ws.current.close();
        }
    }, [dispatch, user.token]);


    const inputChangeHandler = e => {
        const {value} = e.target;

        setEmail(value);
    };

    const subscribeFormHandler = e => {
        e.preventDefault();
        ws.current.send(JSON.stringify({
            type: 'CHECK_USER',
            email: email,
        }));
        setEmail('');
    };

    if (subUserId) {
        ws.current.send(JSON.stringify({
            type: 'LOAD_EVENT_SUB_USER',
            id: subUserId,
        }));
    }

    return (
        <>
            <AppDrawer
            />
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
                        spacing={1}
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
                <Divider/>
            </Container>
            <ShowSubscribe
                eventsUser={subscribeEvents}
            />
        </>
    );
};

export default Subscribe;