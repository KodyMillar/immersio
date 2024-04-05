const mongoose = require('mongoose');

// The activity.details subschema
const detailsSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        default: Date.now(),
        required: true,
    },
    activityType: {
        type: String,
        //enum: process.env.ACTIVITY_TYPE_ENUM.split(","),
        required: true
    },
    timeSpent: {
        type: Number,
        required: true
    },
    videoTime: {
        type: Number,
        required: false
    },
    activityResponse: {
        type: String,
        required: false,
        default: ""
    }
})

// The main activity schema
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
            //enum: process.env.ITEM_TYPE_ENUM.split(","),
            required: true
        },
        details: [detailsSchema]
    }
})

const Activity = mongoose.model('Activity', activitySchema, "activities")
const Details = mongoose.model("Details", detailsSchema)

module.exports = { Activity, Details }
