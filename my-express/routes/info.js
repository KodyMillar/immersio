const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    let info = []
    db.collection('info')
        .find()
        .sort({ user_name: 1 })
        .forEach(a => info.push(a))
        .then(() => {
            res.status(200).json(info)
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not find the documents' })
        })
})

router.post('/', (req, res) => {
    const info = req.body

    db.collection('info')
        .insertOne(info)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({ err: 'Could not add a user_info' })
        })
})

module.exports = router