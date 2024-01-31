require('dotenv').config()

const express = require('express')
const { connectToDb, getDb} = require('./db')
// import cors from 'cors';
// import helmet from 'helmet';
const app = express()
app.use(express.json());
const PORT = 3000;

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

// // Middleware
// app.use(cors());
// app.use(helmet());
// app.use(json());

// Routes Here

app.get('/info', (req, res) => {
  let info = []
  db.collection('info')
      .find()
      .sort( { user_name: 1})
      .forEach( a => info.push(a))
      .then(() => {
          res.status(200).json(info)
      })
      .catch(() => {
          res.status(500).json({error: 'Could not find the documents'})
      })
})

app.post('/info', (req, res) => {
  const info = req.body

  db.collection('info')
      .insertOne(info)
      .then(result => {
          res.status(201).json(result)
      })
      .catch(err => {
          res.status(500).json({err: 'Could not add a user_info'})
      })
})



// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
