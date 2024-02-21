const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const route = require('../routes/info.js')
const Activity = require('../models/activity');

let mongod;
let app;
let num;

const videos = [];
for (let i = 0; i < 8; i++) {
    num = i % 2 === 0 ? 0 : i;
    const video = {
        userId: "12345" + Date.now(),
        activity: {
            courseId: 12930123 + i,
            lessonId: "12839012",
            itemId: "abc123_" + num,
            itemType: "Video",
            details: {
                1: {
                    timestamp: "1238904801",
                    activityType: "Answer",
                    timeSpent: 238023,
                    activityResponse: "INCORRECT"
                },
                2: {
                    timestamp: "1283912302",
                    activityType: "Answer",
                    timeSpent: 2430980234,
                    videoTimeCode: "1:23",
                    activityResponse: "PLAY"
                }
            }
        }
    };
    videos.push(video);
}

describe('GET /', () => {
    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        app = express();
        app.use('/', route);
        await Activity.insertMany(videos)
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongod.stop();
    });

    test('get all activites from the route', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body[0].activity.courseId).toBe(12930123);
        expect(response.body[0].activity.lessonId).toBe(12839012);
        expect(response.body[0].activity.itemId).toBe("abc123_0");
        expect(response.body[0].activity.itemType).toBe("Video");
        expect(response.body[0].activity.details[1].timestamp).toBe(1238904801);
        expect(response.body[0].activity.details[1].activityType).toBe("Answer");
        expect(response.body[0].activity.details[1].timeSpent).toBe("238023");
        expect(response.body[0].activity.details[1].activityResponse).toBe("INCORRECT");
    });
    
    test('handle internal errors', async () => {
        // Mock Activity.find() to throw an error
        jest.spyOn(Activity, 'find').mockImplementation(() => {
            throw new Error('Mocked internal error');
        });
        const response = await request(app).get('/');
        expect(response.status).toBe(500);
        jest.restoreAllMocks();
    });
});


describe('GET /getByItem/:itemId', () => {
    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        app = express();
        app.use('/', route);
        await Activity.insertMany(videos);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongod.stop();
    });
    
    test('get matched actvities from route', async () => {
        const response = await request(app).get('/getByItem/abc123_0');
        expect(response.body).toHaveLength(4);
        expect(response.body[0].activity.itemId).toBe("abc123_0");
        expect(response.body[1].activity.itemId).toBe("abc123_0");
        expect(response.body[2].activity.itemId).toBe("abc123_0");
        expect(response.body[3].activity.itemId).toBe("abc123_0");
    });
})