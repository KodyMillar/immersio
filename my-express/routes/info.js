const express = require('express')
const router = express.Router()
const Activity = require('../models/activity').Activity
const Details = require("../models/activity").Details
const mongoose = require("mongoose")

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

/* Request for storing user activities
    Creates an activity or updates them if they exist */
router.put('/', async (req, res) => {
    let errorMessage = "";

    // Check enum values first
    if (!Activity.schema.path("activity.itemType").enumValues.includes(req.body.activity.itemType)) {
        errorMessage += `Invalid value ${req.body.activity.itemType} for itemType`
    }
    if (!Details.schema.path("activityType").enumValues.includes(req.body.activity.details[0].activityType)) {
        errorMessage += errorMessage ? ", " : "";
        errorMessage += `Invalid value ${req.body.activity.details[0].activityType} for activityType`
    }

    if (errorMessage) {
        res.status(400).json({ message: errorMessage});
    }
    else {
        try {
            const searchCriteria = {
                "userId": req.body.userId, 
                    "activity.courseId": req.body.activity.courseId, 
                    "activity.lessonId": req.body.activity.lessonId,
                    "activity.itemId": req.body.activity.itemId,
                    "activity.itemType": req.body.activity.itemType
            }
            
            const activity = await Activity.findOne(searchCriteria, 
                { "activity.details": 1 });

            // console.log(activity)

            if (activity) {
                if (activity.activity.details.length === 50) {
                    const result = await Activity.updateOne(searchCriteria,
                        { $set: { "activity.details.49" : req.body.activity.details[0] }},
                        {upsert: false}
                        );
                    return res.status(201).json({result});
                }
            }
            
            const result = await Activity.updateOne(searchCriteria,
                { $push: { "activity.details" : req.body.activity.details[0] }},
                { upsert: true }
                )
            res.status(201).json({result});
            
        } catch(err) {
            res.status(400).json({ message: err.message })
        }
    }
})

// Update an individual activity
router.put('/:id', async (req, res) => {
    try {
        const updatedActivity = await Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            // {
            //     userId: req.body.userId,
            //     activity: {
            //         timestamp: req.body.activity.timestamp,
            //         itemType: req.body.activity.itemType,
            //         itemId: req.body.activity.itemId,
            //         courseId: req.body.activity.courseId,
            //         lessonId: req.body.activity.lessonId,
            //         activityDetails: {
            //             activityType: req.body.activity.activityDetails.activityType,
            //             activityResponse: req.body.activity.activityDetails.activityResponse
            //         }
            //     }
            // },
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
    await Activity.updateOne(
        { _id: req.params.id }, 
        { $set: { "activity.details.1.activityResponse": newResponse }})
    res.json(result)
})


// Delete an activity (not for user)
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

// Function to retrieve an activity for all users
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

// Function for getting activities from a user
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

