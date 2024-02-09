const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    activity: {
        timestamp: {
            type: String,
            required: true
        },
        itemType: {
            type: String,
            required: true
        },
        itemId: {
            type: String,
            required: true
        },
        courseId: {
            type: Number,
            required: true
        },
        lessonId: {
            type: Number,
            required: true
        },
        activityDetails: {
            activityType: {
                type: String,
                required: true
            },
            activityResponse: {
                type: String,
                required: true
            }
        }
    }
})



module.exports = mongoose.model('Activity', activitySchema)