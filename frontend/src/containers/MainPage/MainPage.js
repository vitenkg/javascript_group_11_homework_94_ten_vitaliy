import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ReconnectingWebSocket from "reconnecting-websocket";
import {Button, Grid, Paper} from "@material-ui/core";
import {addNewEvent, deleteEvent, userConnected} from "../../store/actions/eventsActions";
import NewEvent from "../../components/NewEvent/NewEvent";

const MainPage = () => {
    const dispatch = useDispatch();
    const ws = useRef(null);
    const eventsCalendar = useSelector(state => state.event.events);

    const user = useSelector(state => state.users.user);

    useEffect(() => {
        ws.current = new ReconnectingWebSocket('ws://localhost:8000/events?token=' + user.token);
        ws.current.onclose = () => {
            console.log('ws connected close');
            dispatch({type: 'CLEAR_USERS'});
        };

        ws.current.onmessage = event => {
            const parsed = JSON.parse(event.data);
            console.log(parsed);

            if (parsed.type === 'USER_CONNECTED') {
                dispatch(userConnected(parsed.payload));
            }

            if (parsed.type === 'DELETE_EVENT') {
                dispatch(deleteEvent(parsed.payload));
            }

            if (parsed.type === 'NEW_EVENT') {
                console.log(parsed.payload);
                dispatch(addNewEvent(parsed.payload));
            }

        };

        return () => {
            ws.current.close();
        }
    }, [dispatch, user.token]);

    const sendNewEventHandler = (newEvent)  => {
        ws.current.send(JSON.stringify({
            type: 'CREATE_EVENT',
            event: newEvent,
        }));
    };

    const deleteEventHandler = id => {
        ws.current.send(JSON.stringify({
            type: 'DELETE_EVENT',
            eventId: id,
        }));
    };

    console.log(eventsCalendar);

    return (
        <div>
            {eventsCalendar ? eventsCalendar.map(event => (
                <Paper key={event._id}>
                    <Grid>
                        <p>Event Calendar: <b>{event.event}</b></p>
                        <p>lasting: <b>{event.lasting}</b> || date: <b>{event.datetime}</b></p>
                    </Grid>
                    <Button
                        color="primary"
                        onClick={() => deleteEventHandler(event._id)}
                    >
                        Delete
                </Button>
                </Paper>
                )) : null}
            <NewEvent
                onSubmit={(event) => sendNewEventHandler(event)}
            />
        </div>
    );
};

export default MainPage;