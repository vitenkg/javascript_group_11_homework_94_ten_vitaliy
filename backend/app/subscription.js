const User = require('../models/User');
const Event = require("../models/Event");
const Subscription = require('../models/Subscription');

const activeConnections = {};
let activeUsers = [];


const sendPayload = (user, type, message) => {
    activeConnections[user._id].send(JSON.stringify({
        type,
        payload: message,
    }));
};

// const sendMessage = (user, type, message) => {
//     activeConnections[user._id].send(JSON.stringify({
//         type,
//         message,
//     }));
// };

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

        const newUserSub = [];
        subscUsers.map(q => {
            q.subscriptionUser.map(user => {
                newUserSub.push(user);
            })
        })

        console.log('подписки ',subscUsers);
        console.log('подписки ',newUserSub);

        ws.send(JSON.stringify({
            type: 'USER_CONNECTED',
            payload: newUserSub,
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
        const findUser = await User.findOne({email: parsed.email})
        console.log('входные данные', findUser);
        if (!findUser || (JSON.stringify(user.id) === JSON.stringify(findUser._id))) {

            sendPayload(user, 'NO_USER', 'User not found');

        } else {

            const findSubUser = await Subscription.find({
                $and: [
                    {user: user._id},
                    {subscriptionUser: findUser._id},
                ]
            });
            const findUserInSub = await Subscription.find({user: user._id});

            console.log('проверка', findSubUser);
            console.log('проверка пользователя с подписками', findUserInSub);

            if (findSubUser.length > 0) {
                console.log('прошел findSunUser');
                sendPayload(user, "SUBSCRIBE", `Вы уже подписаны на ${findUser.displayName}`);

            } else {
                console.log('не нашел findSunUser');

                if (findUserInSub === []) {
                    console.log('проверка на пользователя с подписаками');
                    const add = await Subscription.findOneAndUpdate(
                        { user: user._id },
                        { $set: { subscriptionUser: [...findSubUser, findUser._id]}},
                        {new: true},
                    );
                    console.log('Добавление в массив', add);
                    sendPayload(user, "NEW_SUBSCRIBE", findUser);
                } else {
                    console.log('проверка на пользователя с подписаками, нет подписок вообще');

                    const newSubscribe = {
                        user: user._id,
                        subscriptionUser: findUser._id,
                    };

                    const Sub = await new Subscription(newSubscribe);
                    await Sub.save();
                }

                sendPayload(user, "NEW_SUBSCRIBE", findUser);
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

                // activeConnections[user._id].send(JSON.stringify({
                //     type: 'UNSUBSCRIBE',
                //     payload: parsed.eventId
                // }));
                sendMessage(user, "UNSUBSCRIBE", parsed.eventId);

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