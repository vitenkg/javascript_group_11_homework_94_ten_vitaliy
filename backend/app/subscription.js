const User = require('../models/User');
const Event = require("../models/Event");
const Subscription = require('../models/Subscription');

const activeConnections = {};
let activeUsers = [];


const sendMessage = (user, type, message) => {
    activeConnections[user.id].send(JSON.stringify({
        type,
        payload: message,
    }));
};

const userConnected = async (user, ws) => {
    activeConnections[user._id] = ws;

    const newUser = {
        id: user._id,
        name: user.displayName,
    };

    activeUsers.push(newUser);

    console.log(`User id=${user._id} connected`);

    try {
        const subscUsers = await Subscription.find({user: user._id})
            .populate('user subscriptionUser', 'displayName');

        console.log('subsc: ', subscUsers);

        ws.send(JSON.stringify({
            type: 'USER_CONNECTED',
            payload: subscUsers[0].subscriptionUser,
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

const newSubscribe = async (parsed, user) => {
    try {
        console.log('Пришедшие данные ', parsed);
        const findUser = await User.findOne({email: parsed.email})
            .populate('user', 'displayName');

        if (!findUser || (JSON.stringify(user.id) === JSON.stringify(findUser._id))) {
            activeConnections[user.id].send(JSON.stringify({
                type: 'NO_USER',
                message: 'User not found'
            }));

        } else {

            const findSub = await Subscription.findOne({
                $and: [
                    {subscriptionUser: findUser._id},
                    {user: user._id}
                ]
            });


            if (!findSub) {
                const newSubscribe = {
                    user: user.id,
                    subscriptionUser: findUser._id,
                };

                const Sub = new Subscription(newSubscribe);
                await Sub.save();

                activeConnections[user.id].send(JSON.stringify({
                    type: 'NEW_SUBSCRIBE',
                    payload: findUser,
                }));
            } else {
                sendMessage(user, "SUBSCRIBE", `Вы уже подписаны на ${findUser.displayName}`);
            }

        }

    } catch (e) {
        console.log(e)
    }

    return;
};

const Subscriptions = async (ws, req) => {
    try {
        const token = req.query.token;

        if (!token) {
            console.log('Close')
            return ws.close(3000, 'No token');
        }

        const user = await User.findOne({token});

        if (!user) {
            console.log('User nof found')
            return ws.close(3000, 'Token incorrect');
        }

        await userConnected(user, ws);

        ws.on('message', async msg => {
            const parsed = JSON.parse(msg);

            if (parsed.type === 'CHECK_USER') {
                await newSubscribe(parsed, user);
            }

            if (parsed.type === 'UNSUBSCRIBE') {
                console.log('Delete: ', parsed.eventId);
                await Subscription.findByIdAndDelete(parsed.eventId);

                activeConnections[user._id].send(JSON.stringify({
                    type: 'UNSUBSCRIBE',
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

module.exports = Subscriptions;