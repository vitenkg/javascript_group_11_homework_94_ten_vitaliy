const mongoose = require('mongoose');
const config = require('./config');
const {nanoid} = require('nanoid');
const User = require('./models/User');
const dayjs = require("dayjs");
const Event = require('./models/Event');

const run = async () => {
    await mongoose.connect(config.db.url);

    const collections = await mongoose.connection.db.listCollections().toArray();

    for (const coll of collections) {
        await mongoose.connection.db.dropCollection(coll.name);
    }

    const [admin, test] = await User.create({
            email: 'admin@admin.com',
            password: 'admin',
            token: nanoid(),
            displayName: 'Admin',
            role: 'admin',
        }, {
            email: 'test@test.com',
            password: 'test',
            token: nanoid(),
            displayName: 'Test',
            role: 'user'
        }
    );

    await Event.create(
        {
            event: "Test-1",
            datetime: dayjs('December 1, 2021 03:27:00'),
            lasting: '2 days',
            user: admin,
        },
        {
            event: "Test-2",
            datetime: dayjs('December 2, 2021 03:27:00'),
            lasting: '1 days',
            user: test,
        },
        {
            event: "Test-3",
            datetime: dayjs('December 3, 2021 03:27:00'),
            lasting: '3 days',
            user: admin,
        },
        {
            event: "Test-4",
            datetime: dayjs('December 4, 2021 03:27:00'),
            lasting: '4 days',
            user: test,
        },
        {
            event: "Test-1",
            datetime: dayjs('December 5, 2021 03:27:00'),
            lasting: '2 days',
            user: admin,
        },
        {
            event: "Test-2",
            datetime: dayjs('December 6, 2021 03:27:00'),
            lasting: '1 days',
            user: test,
        },
        {
            event: "Test-3",
            datetime: dayjs('December 7, 2021 03:27:00'),
            lasting: '3 days',
            user: admin,
        },
        {
            event: "Test-4",
            datetime: dayjs('December 8, 2021 03:27:00'),
            lasting: '4 days',
            user: test,
        },
    );

    await mongoose.connection.close();
};

run().catch(console.error);