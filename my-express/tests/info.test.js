require('dotenv').config()
process.env.ACTIVITY_TYPE_ENUM = 'Answer,Play,Pause,Skip,Resume,Replay';
process.env.ITEM_TYPE_ENUM='Drill,Dialogue,Video,Vocabulary'
const mongoose = require('mongoose');
const request = require('supertest');
const route = require('../routes/info.js')
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Activity, Details } = require('../models/activity');
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
            details: [
                {
                    timestamp: 1238904801,
                    activityType: "Answer",
                    timeSpent: "238023",
                    activityResponse: "INCORRECT"
                },
            ],
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
    await Activity.insertMany(fiftyItems)
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


// describe('POST /', () => {
//     it('should get one user info from route', async () => {
//         const res = await request(app).post('/').send(videos[0]);
//         expect(res.status).toBe(201);
//         expect(res.body.userId).toBe(videos[0].userId);
//     });

//     it('should handle internal errors', async () => {
//         const res = await request(app).post('/').send(invalidItemType);
//         expect(res.status).toBe(400);
//     });
// });


describe('PUT /', () => {
    it('should handle error of invalid value for item type', async () => {
        const res = await request(app).put(`/`).send(invalidItemType);
    
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid value empty for itemType'});
    });

    it('should handle error of invalid value for item type', async () => {
        const res = await request(app).put(`/`).send(invalidActivityType);
    
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid value empty for activityType'});
    });

    it('should add a new activity', async () => {
        let initialActivity = await Activity.find();
        expect(initialActivity.length).toBe(9);

        const res = await request(app).put(`/`).send(updatedActivity);

        const modifiedActivity = await Activity.find();
        expect(modifiedActivity.length).toBe(10);


        delete res.body.result.upsertedId;    
        expect(res.status).toBe(201);
        expect(res.body).toEqual(
            {"result": {
                "acknowledged": true, 
                "matchedCount": 0, 
                "modifiedCount": 0, 
                "upsertedCount": 1
            }}
        );
    });

    it('should add a detail to an existing activity', async () => {
        let initialActivity = await Activity.find();
        expect(initialActivity.length).toBe(10);
        expect(initialActivity[2].activity.details.length).toBe(1);

        const res = await request(app).put(`/`).send(videos[2]);

        const modifiedActivity = await Activity.find();
        expect(modifiedActivity.length).toBe(10);
        expect(modifiedActivity[2].activity.details.length).toBe(2);


        delete res.body.result.upsertedId;
        expect(res.status).toBe(201);
        expect(res.body).toEqual(
            {"result": {
                "acknowledged": true, 
                "matchedCount": 1, 
                "modifiedCount": 1, 
                "upsertedCount": 0
            }}
        );
    });

    it('should modify one detail', async () => {
        let initialActivity = await Activity.find();
        expect(initialActivity[8].activity.details.length).toBe(50);

        const res = await request(app).put(`/`).send(fiftyOneItems);

        delete res.body.result.upsertedId;
        const modifiedActivity = await Activity.find();

        expect(modifiedActivity[8].activity.details.length).toBe(50);
        expect(modifiedActivity[8].activity.details[49].timestamp).toEqual(fiftyOneItems.activity.details[0].timestamp);
        expect(modifiedActivity[8].activity.details[49].activityType).toEqual(fiftyOneItems.activity.details[0].activityType);
        expect(modifiedActivity[8].activity.details[49].timeSpent).toEqual(fiftyOneItems.activity.details[0].timeSpent);
        expect(modifiedActivity[8].activity.details[49].activityResponse).toEqual(fiftyOneItems.activity.details[0].activityResponse);


        expect(res.status).toBe(201);
        expect(res.body).toEqual(
            {"result": {
                "acknowledged": true, 
                "matchedCount": 1, 
                "modifiedCount": 1, 
                "upsertedCount": 0
            }}
        );
    });


});


describe('PUT /:id', () => {
    it('should update an activity', async () => {
        const userIdToUpdate = videos[2].userId;
        
        const res = await request(app).put(`/${id}`)
            .send(updatedActivity);

        delete res.body.activity.details[0]._id;

        expect(res.status).toBe(200);
        expect(res.body.userId).toEqual(updatedActivity.userId)
        expect(res.body.activity).toEqual(updatedActivity.activity)
    });

    it('should handle non-existent ID', async () => {
        const nonExistentId = '60909c0dd7b0f2841cf45e3e'; // Use a non-existent ID
        const res = await request(app).put(`/${nonExistentId}`).send(updatedActivity);
    
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Cannot find activity to update'});
    });

    it('cshould handle invalid ID', async () => {
        const invalidID = 'abc'; 
        const res = await request(app).put(`/${invalidID}`).send(updatedActivity);
    
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Cast to ObjectId failed for value "abc" (type string) at path "_id" for model "Activity"' });
    });
});


describe('DELETE /:id', () => {
    it('delete an activity', async () => {
        // id is retrieved from 'GET /'
        const res = await request(app).delete(`/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted activity' });
    });

    it('cannot find an activity', async () => {
        const res = await request(app).delete(`/whoami`);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Cast to ObjectId failed for value "whoami" (type string) at path "_id" for model "Activity"' });
    });    
});


const detailsList = [];

for (let i = 0; i < 50; i++) {
    const details = {
        timestamp: 1238904801 + i,
        activityType: "Answer",
        timeSpent: "238023",
        activityResponse: "INCORRECT"
    };
    detailsList.push(details);
}

const fiftyItems =
    {
        "userId": "12345",
        "activity":
        {
            "courseId": 123,
            "lessonId": 12839012,
            "itemId": "absc543ert43iou",
            "itemType": "Drill",
            "details": detailsList
        }
    }

const fiftyOneItems =
    {
        "userId": "12345",
        "activity":
        {
            "courseId": 123,
            "lessonId": 12839012,
            "itemId": "absc543ert43iou",
            "itemType": "Drill",
            "details": [
                {
                    timestamp: 1238904800,
                    activityType: "Skip",
                    timeSpent: 238023,
                    activityResponse: "INCORRECT"
                }
            ]
        }
    }

const invalidItemType = 
    {
        "userId": "12345",
        "activity":
        {
            "courseId": 123,
            "lessonId": 12839012,
            "itemId": "absc543ert43iou",
            "itemType": "empty",
            "details": [
            {
                "timestamp": 1238904801, 
                "activityType": "Answer",
                "timeSpent": "238023",
                "activityResponse": "INCORRECT"
            }
            ]
        }
    }

const invalidActivityType = 
    {
        "userId": "12345",
        "activity":
        {
            "courseId": 123,
            "lessonId": 12839012,
            "itemId": "absc543ert43iou",
            "itemType": "Drill",
            "details": [
            {
                "timestamp": 1238904801, 
                "activityType": "empty",
                "timeSpent": "238023",
                "activityResponse": "INCORRECT"
            }
            ]
        }
    }


const updatedActivity = {
    userId: "777",
    activity: {
        details: [
            {
                timestamp: 1238904801,
                activityType: "Answer",
                timeSpent: 238023,
                activityResponse: "INCORRECT"
            }
        ],
        courseId: 555,
        lessonId: 111,
        itemId: "abc123_" + num,
        itemType: "Video"
    }
}























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


