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
    // Sample activity data
    const sampleActivity = {
      userId: "user123",
      activity: {
          timestamp: Date.now(),
          itemType: "DRILL",
          itemId: "absc543ert43iou",
          courseId: 123,
          lessonId: 321,
          activityDetails: {
              activityType: "START",
              activityResponse: 'abc'
          }
      }
    };

    // Save the activity to the database
    const savedActivity = await Activity.create(sampleActivity);

    // Retrieve the saved activity from the database
    const retrievedActivity = await Activity.findById(savedActivity._id);

    // Assert that the retrieved activity matches the saved activity
    expect(retrievedActivity.toJSON()).toEqual(savedActivity.toJSON());
  });
});

