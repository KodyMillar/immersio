require('dotenv').config()

const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./openapi.yml')
const app = express()
const helmet = require('helmet')
const mongoose = require('mongoose')
const http = require("http");
const activityController = require("./controllers/activityController").activityController
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
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}/api`))

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof SyntaxError) {
        res.status(400).send("Wrong Json Syntax");
    }
    else {
        res.status(500).send('Something broke!');
    }
});

// Delete after 30 days
const cron = require("node-cron");
cron.schedule("23 1 * * *", () => {
        http.request(
            "http://localhost:3000/info", 
            { method: "DELETE" }, 
            activityController.deleteOldActivities
        );
    }, 
    {
        scheduled: true,
        timezone: "Etc/UTC"
    }
);

module.exports = db

