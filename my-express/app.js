require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const helmet = require('helmet')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors())
app.use(helmet())

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to DB'))

// Routes
const infoRoute = require('./routes/info')
app.use('/info', infoRoute)

// Start the server
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof SyntaxError) {
        res.status(400).send("Wrong Json Syntax")
    }
    else {
        res.status(500).send('Something broke!');
    }
});

module.exports = db