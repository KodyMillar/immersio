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

// Get all activities that match the given itemId
router.get('/getByItem/:itemId', async (req, res) => {
    try {
        const activity = await Activity.find( { "activity.itemId" : req.params.itemId })
        return res.json(activity)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get activities by userid
router.get('/user/:userId', getActivityByUserId ,async (req, res) => {
    res.json(res.activity)
})

// Get one activity data
router.get('/:id', getActivity, (req, res) => {
    res.json(res.activity)
})

// Get activities by userid
router.get('/user/:userId', getActivityByUserId ,async (req, res) => {
    res.json(res.activity)
})

// Create a new activity
router.post('/', async (req, res) => {
    try {
        const activity = new Activity(req.body)
        const newActivity = await activity.save()
        res.status(201).json(newActivity)
    } catch (err) {
        if (err instanceof TypeError) {
            res.status(400).send("Incorrect value types")
        }
        else {
            res.status(400).json({ message: err.message })
        }
    } 
})

router.put('/', async (req, res) => {
    try {
        await Activity.updateOne(
            { "userId": req.body.userId, "activity.itemId": req.body.activity.itemId },
            { $push: { "activity.details" : {
                "timestamp": Date.now(),
                "activityType": "Answer",
				"timeSpent": 125,
				"activityResponse": "CORRECT"
            } }},
            { upsert: true }
            )
        res.status(201).send("Success!")
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
})

// Update an activity
router.put('/:id', async (req, res) => {
    try {
        const updatedActivity = await Activity.findByIdAndUpdate(
            req.params.id,
            {
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
            },
            { new: true } // Return the updated document
        );

        if (!updatedActivity) {
            return res.status(404).json({ message: 'Cannot find activity to update' });
        }

        res.json(updatedActivity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Update an activity response for a certain activity
router.put("/update/:id", async (req, res) => {
    const newResponse = req.body.activityResponse
    const result = await Activity.updateOne(
        { _id: req.params.id }, 
        { $set: { "activity.details.1.activityResponse": newResponse }})
    res.json(result)
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

async function getActivityByUserId(req, res, next) {
    let activities
    try {
        activities = await Activity.find({'userId': req.params.userId});
        if (activities == null) {
            return res.status(404).json({ message: 'Cannot find activity' })
        }
    
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.activity = activities
    next(); 
}


module.exports = router

