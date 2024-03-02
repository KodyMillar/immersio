const express = require('express')
const router = express.Router()
const Activity = require('../models/activity')
const mongodb = require("mongodb")
const db = require("../app")
const activity = require('../models/activity')
// const activityCollection = Activity.createCollection()
//     .then((collection) => console.log("created collection"))

// Get all activities data
router.get('/', async (req, res) => {
    try {
        const activity = await Activity.find()
        // const collections = db.listCollections()
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
        const newActivity = new Activity(req.body);
        newActivity.save();
        res.status(201).json(newActivity);
        // Activity.findOne({ userId: req.body.userId })
        //     .then(activity => {
        //         if (activity) {
        //             // activity.message = "success"
        //             Activity.updateOne({ userId: "9000" }, { $set: { lessonId: 1000 } })
        //                 .then(() => {
        //                     console.log(db.listCollections())
        //                     res.status(201).send("good")
        //                 })
        //             // const update = activity.update({ userId: "9002"})
        //             //     .then((activity) => {
        //             //         res.status(201).json(activity)
        //             //     })
        //         } else {
        //             const newActivity = new Activity(req.body);
        //             newActivity.save();
        //             res.status(201).json(newActivity);
        //         }
        //     })
        //     .catch(err => console.log(err))
        // const collections = db.
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

router.put('/', async (req, res) => {
    try {
        await Activity.updateOne(
            { "userId": req.body.userId, "activity.itemId": req.body.activity.itemId },
            { $push: { "activity.details" : {
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
router.delete('/delete/:id', async(req, res) => {
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

router.get('/deleteall', async(req, res) => {
    try {
        await Activity.deleteMany({})
        res.send("All documents have been deleted")
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

