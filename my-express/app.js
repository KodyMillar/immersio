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

// Sever Configuration
// const fs = require('fs');
// const https = require('https');
// const key = fs.readFileSync('private.key');
// const cert = fs.readFileSync('certificate.crt');
// const cred = {key: key, cert: cert};
// const httpsServer = https.createServer(cred, app);
// httpsServer.listen(8080);

// Middlewares
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

app.get('/.well-known/pki-validation/CC14716A241C7005FE4517DE8AB41337.txt', (req, res) => {
    res.sendFile("./CC14716A241C7005FE4517DE8AB41337.txt", { root: __dirname });
})

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

/* Schedule to delete activities after 30 days
    calls controller in the controllers/activityController.js file */ 
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

