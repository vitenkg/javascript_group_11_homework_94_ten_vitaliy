const User = require('../models/User');
const Event = require("../models/Event");
const dayjs = require("dayjs");

const activeConnections = {};
let activeUsers = [];

const userConnected = async (user, ws) => {
    activeConnections[user._id] = ws;

    const newUser = {
        id: user._id,
        name: user.displayName,
    };

    activeUsers.push(newUser);

    console.log(`User id=${user._id} connected`);

    try {
        const eventsFromNow = await Event.find({
            $and: [
                {user: user._id},
                {"created_on": dayjs(new Date())}
            ]
        })
            .populate('user', 'displayName')
            .sort({datetime: -1});


        ws.send(JSON.stringify({
            type: 'USER_CONNECTED',
            payload: eventsFromNow,
        }));
    } catch (e) {
        console.log(e);
    }
};

const userDisconnected = (user) => {
    delete activeConnections[user._id];
    activeUsers = activeUsers.filter(u => u.id !== user._id);

    Object.keys(activeConnections).forEach(key => {
        const conn = activeConnections[key];

        conn.send(JSON.stringify({
            type: 'USER_LOGOUT',
            payload: {
                id: user._id,
                name: user.username,
            },
        }));
    });
};

const newEvent = async (parsed, user) => {

    const date = new Date()
    const newEvent = {
        datetime: parsed.event.datetime || date,
        event: parsed.event.event,
        lasting: parsed.event.lasting,
        user: user._id,
    };

try {
    const event = new Event(newEvent);
    await event.save();

    const savedEvent = await Event.findOne({
        $and: [
            {datetime: parsed.event.datetime},
            {event: parsed.event.event},
            {lasting: parsed.event.lasting},
            {user: user._id},
        ]
    }).populate('user', 'displayName _id');

    activeConnections[user.id].send(JSON.stringify({
        type: 'NEW_EVENT',
        payload: savedEvent,
    }));
} catch (e) {
    console.log(e)
}

    return;
};

const Events = async (ws, req) => {
    try {
        const token = req.query.token;

        if (!token) {
            console.log('Close')
            return ws.close(3000, 'No token');
        }

        const user = await User.findOne({token});

        console.log('Проверка соединения', user);

        if (!user) {
            console.log('User nof found')
            return ws.close(3000, 'Token incorrect');
        }

        await userConnected(user, ws);

        ws.on('message', async msg => {
            const parsed = JSON.parse(msg);

            if (parsed.type === 'CREATE_EVENT') {
                await newEvent(parsed, user);
            }

            if (parsed.type === 'DELETE_EVENT') {
                console.log('Delete: ', parsed.eventId);
                await Event.findByIdAndDelete(parsed.eventId);
                activeConnections[user._id].send(JSON.stringify({
                        type: 'DELETE_EVENT',
                        payload: parsed.eventId
                    }));
            }
        });

        ws.on('close', () => {
            console.log(`Client disconnected! id=${token}`);
            userDisconnected(user);
        });
    } catch (e) {
        console.log(e);
    }

};

module.exports = Events;