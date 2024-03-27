const mongoose = require('mongoose');
const request = require('supertest');
const route = require('../routes/info.js')
const { MongoMemoryServer } = require('mongodb-memory-server');
const Activity = require('../models/activity');
const express = require('express');
const app = express();

let num;
const videos = [];
let userIdCounter = 1;
for (let i = 0; i < 8; i++) {
    num = i % 2 === 0 ? 0 : i;
    const video = {
        userId: "12345" + userIdCounter++,
        activity: {
            details: {
                "1": {
                    timestamp: 1238904801,
                    activityType: "Answer",
                    timeSpent: "238023",
                    activityResponse: "INCORRECT"
                }
            },
            courseId: 12930123 + i,
            lessonId: 12839012,
            itemId: "abc123_" + num,
            itemType: "Video"
        }
    };
    videos.push(video);
};


app.use(express.json());
app.use('/', route);
let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    await Activity.insertMany(videos)
});


afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});


let id;
describe('GET /', () => {
    it('should get all activites from the route', async () => {
        const res = await request(app).get('/');

        id = res.body[0]._id;

        expect(res.status).toBe(200);
        for (let i = 0; i < 8; i++) {
            const expectedItemId = videos[i].activity.itemId;
            const receivedItemId = res.body[i].activity.itemId;
            
            expect(expectedItemId).toBe(receivedItemId);
        }
    });
    
    it('should handle internal errors', async () => {
        // Mock Activity.find() to throw an error
        jest.spyOn(Activity, 'find').mockImplementation(() => {
            throw new Error('Mocked internal error');
        });
        const res = await request(app).get('/');
        expect(res.status).toBe(500);
        jest.restoreAllMocks();
    });
});


describe('GET /getByItem/:itemId', () => {
    it('should get matched actvities from route', async () => {
        const res = await request(app).get('/getByItem/abc123_0');
        expect(res.body).toHaveLength(4);
        expect(res.body[0].activity.itemId).toBe("abc123_0");
        expect(res.body[1].activity.itemId).toBe("abc123_0");
        expect(res.body[2].activity.itemId).toBe("abc123_0");
        expect(res.body[3].activity.itemId).toBe("abc123_0");
    });

    it('should handle internal errors', async () => {
        // Mock Activity.find() to throw an error
        jest.spyOn(Activity, 'find').mockImplementation(() => {
            throw new Error('Mocked internal error');
        });
        const res = await request(app).get('/');
        expect(res.status).toBe(500);
        jest.restoreAllMocks();
    });
});


describe('GET /user/:userid', () => {
    it('should get one user info from route', async () => {
        const res = await request(app).get(`/user/${videos[0].userId}`);
        expect(res.body[0].activity.itemId).toBe(videos[0].activity.itemId);
    });
});


describe('POST /', () => {
    it('should get one user info from route', async () => {
        const res = await request(app).post('/').send(videos[0]);
        expect(res.status).toBe(201);
        expect(res.body.userId).toBe(videos[0].userId);
    });
});





































// describe('DELETE /:id', () => {
//     it('delete an activity', async () => {
//         const userIdToDelete = videos[0].userId;
        
//         const res = await request(app).delete(`/${userIdToDelete}`);
//         expect(res.status).toBe(200);
//         expect(res.body).toEqual({ message: 'Deleted activity' });
//     });

//     it('cannot find an activity', async () => {
//         const res = await request(app).delete(`/whoami`);
//         expect(res.status).toBe(404);
//         expect(res.body).toEqual({ message: 'Cannot find activity' });
//     });    
// });


// describe('PUT /:id', () => {
//     it('update an activity', async () => {
//         const userIdToUpdate = videos[2].userId;
//         console.log(userIdToUpdate);
        
//         const res = await request(app).put(`/${userIdToUpdate}`)
//             .send(updatedActivity);
//         // console.log(res);

//         expect(res.status).toBe(200);
//         expect(res.body.userId).toEqual(updatedActivity.userId)
//         expect(res.body.activity).toEqual(updatedActivity.activity)
//         console.log(res.body.activity)
//     });

//     it('cannot find an activity to update', async () => {
//         const res = await request(app).put(`/whoami`);
//         expect(res.status).toBe(404);
//         expect(res.body).toEqual({ message: 'Cannot find activity to update'});
//     });   
// })


// const updatedActivity = {
//     userId: "777",
//     activity: {
//         details: {
//             "1": {
//                 timestamp: 1238904801,
//                 activityType: "Answer",
//                 timeSpent: "238023",
//                 activityResponse: "INCORRECT"
//             }
//         },
//         courseId: 555,
//         lessonId: 111,
//         itemId: "abc123_" + num,
//         itemType: "Video"
//     }
// }