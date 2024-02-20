const mongoose = require('mongoose');
const Activity = require('../models/activity.js');

describe('Activity Model', () => {
  beforeAll(async () => {
    // Connect to MongoDB before running the tests
    await mongoose.connect('mongodb+srv://tommynguyenvanc:A01336020@Immersio.nmlzvg1.mongodb.net/?retryWrites=true&w=majority');
  });

  afterAll(async () => {
    // Disconnect from MongoDB after running all the tests
    await mongoose.disconnect();
  });

  test('should save an activity to the database', async () => {
    const video = {
      "userId": "12345",
      "activity":
        {
          "courseId": "12930123",
          "lessonId": "12839012",
          "itemId": "absc543ert43iou",
          "itemType": "Video",
          "details": {
            1: 
              {
                "timestamp": "1238904801", 
                "activityType": "Answer",
                "timeSpent": "00:20:38",
                "activityResponse": "INCORRECT"
              },
            2: 
              {
                "timestamp": "1283912302",
                "activityType": "Answer",
                "timeSpent": "00:10:19",
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

