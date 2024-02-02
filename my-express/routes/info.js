const express = require('express')
const router = express.Router()
const Activity = require('../models/activity')

// Get all activities data
router.get('/', async (req, res) => {
    try {
        const activity = await Activity.find()
        res.json(activity)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Create a new activity
router.post('/', async (req, res) => {
    try {
        const activity = new Activity({
            userId: req.body.userId,
            activity: {
                timestamp: req.body.activity.timestamp,
                itemType: req.body.activity.itemType,
                itemId: req.body.activity.itemId,
                courseId: req.body.activity.courseId,
                lessonId: req.body.activity.lessonId,
                activityDetails: {
                    activityType: req.body.activity.activityDetails.activityType,
                    activityResponse: req.body.activity.activityDetails.activityResponse
                }
            }
        })
        const newActivity = await activity.save()
        res.status(201).json(newActivity)
    } catch (err) {
        res.status(400).json({ message: err.message })
    } 
})


module.exports = router

