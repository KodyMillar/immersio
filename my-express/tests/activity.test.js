const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Activity = require('../models/activity');

let mongod;
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Activity Schema Validation', () => {
  it('should validate a valid activity', async () => {
    const validVideo = new Activity(
      {
        "userId": "12345",
        "activity":
          {
            "courseId": 123,
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
                }
              }
          }
      }
    )
    await expect(validVideo.save()).resolves.toBeDefined();
  });

  it('should validate an invalid activity', async () => {
    const userIdMissing = new Activity(
      {
        // "userId": "12345",
        "activity":
          {
            "courseId": 123,
            "lessonId": 12839012,
            "itemId": "absc543ert43iou",
            "itemType": "Video",
            "details": {
              "1": 
                {
                  "timestamp": 1238904801, 
                  "activityType": "Answer",
                  "timeSpent": "238023",
                  "activityResponse": "INCORRECT"
                }
              }
          }
      }
    )

    const wrongCourseIdType = new Activity(
      {
        "userId": "12345",
        "activity":
          {
            "courseId": "123abc",
            "lessonId": 12839012,
            "itemId": "absc543ert43iou",
            "itemType": "Video",
            "details": {
              "1": 
                {
                  "timestamp": 1238904801, 
                  "activityType": "Answer",
                  "timeSpent": "238023",
                  "activityResponse": "INCORRECT"
                }
              }
          }
      }
    )

    const invalidItemType = new Activity(
      {
        "userId": "12345",
        "activity":
          {
            "courseId": 123,
            "lessonId": 12839012,
            "itemId": "absc543ert43iou",
            "itemType": "empty",
            "details": {
              "1": 
                {
                  "timestamp": 1238904801, 
                  "activityType": "Answer",
                  "timeSpent": "238023",
                  "activityResponse": "INCORRECT"
                }
              }
          }
      }
    )

    await expect(userIdMissing.save()).rejects.toThrow();
    await expect(wrongCourseIdType.save()).rejects.toThrow();
    await expect(invalidItemType.save()).rejects.toThrow();
  });

});

