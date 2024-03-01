const mongoose = require('mongoose');

const detailsSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        default: Date.now(),
        required: true,
    },
    activityType: {
        type: String,
        enum: ['Answer', 'Play', 'Pause', 'Skip', 'Resume', 'Restart'],
        required: true
    },
    timeSpent: {
        type: Number,
        required: true
    },
    activityResponse: {
        type: String,
        required: false,
        default: ""
    }
})

const activitySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    activity: {        
        courseId: {
            type: Number,
            required: true
        },
        lessonId: {
            type: Number,
            required: true
        },
        itemId: {
            type: String,
            required: true
        },
        itemType: {
            type: String,
            enum: ['Drill', 'Dialogue', 'Video', 'Vocabulary'],
            required: true
        },
        details: [detailsSchema]
    }
})

module.exports = mongoose.model('Activity', activitySchema, "activities")