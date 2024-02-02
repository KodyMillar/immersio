require('dotenv').config()

const express = require('express')
const { connectToDb, getDb} = require('./db')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors())
app.use(helmet())

// MongoDB Connection

let db

connectToDb((err)=>{
    if(!err) {
        app.listen(PORT, () => {
          console.log(`Server started at http://localhost:${PORT} 🚀`)
        })
        db = getDb()
    }
})
// Routes Here
const infoRoute = require('./routes/info')
app.use('/info', infoRoute)

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
