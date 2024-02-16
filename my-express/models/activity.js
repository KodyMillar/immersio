const mongoose = require('mongoose');

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
        details: {
            "1": {
                timestamp: {
                    type: Date,
                    set: date => new Date(date).getTime(),
                    required: true
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
            }
        }
    }
})



module.exports = mongoose.model('Activity', activitySchema)