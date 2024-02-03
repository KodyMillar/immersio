const express = require('express')
const router = express.Router()
const Activity = require('../models/activity')
const mongodb = require("mongodb")

// Get all activities data
router.get('/', async (req, res) => {
    try {
        const activity = await Activity.find()
        res.json(activity)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/getByItem/:itemId', async (req, res) => {
    try {
        const activity = await Activity.find( { "activity.itemId" : req.params.itemId })
        return res.json(activity)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get one activity data
router.get('/:id', getActivity, (req, res) => {
    res.json(res.activity)
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

// Delete an activity
router.delete('/:id', async(req, res) => {
    try {
        // const result = await Activity.findByIdAndDelete(req.params.id)[[]]
        const result = await Activity.findByIdAndDelete(req.params.id)
        if (result == null) {
            return res.status(404).json({ message: 'Cannot find activity' })
        }
        res.json({ message: 'Deleted activity' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getActivity(req, res, next) {
    let activity
    try {
        activity = await Activity.findById(req.params.id)
        if (activity == null) {
            return res.status(404).json({ message: 'Cannot find activity' })
        }
    

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.activity = activity
    next();
}


module.exports = router

