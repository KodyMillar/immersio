require('dotenv').config();
const mongoose = require('mongoose');
const Activity = require('../models/activity.js');

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

describe('Activity Model', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  test('should save an activity to the database', async () => {
    const video = {
      "userId": "12345",
      "activity":
        {
          "courseId": 12930123,
          "lessonId": 12839012,
          "itemId": "absc543ert43iou",
          "itemType": "Video",
          "details": {
            1: 
              {
                "timestamp": 1238904801, 
                "activityType": "Answer",
                "timeSpent": "238023",
                "activityResponse": "INCORRECT"
              },
            2: 
              {
                "timestamp": "1283912302",
                "activityType": "Answer",
                "timeSpent": 2430980234,
                "videoTimeCode": "1:23",
                "activityResponse": "PLAY"
              }
            }
        }
    }

    // Save the activity to the database
    const savedActivity = await Activity.create(video);

    // Retrieve the saved activity from the database
    const retrievedActivity = await Activity.findById(savedActivity._id);

    // Assert that the retrieved activity matches the saved activity
    expect(retrievedActivity.toJSON()).toEqual(savedActivity.toJSON());
  });
});

