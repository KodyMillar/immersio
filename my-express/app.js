require('dotenv').config()

import express, { json } from 'express';
import { connect, connection } from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB Connection
connect(process.env.DATABASE_URL);
const db = connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to DB'));

// Middleware
app.use(cors());
app.use(helmet());
app.use(json());

// Routes Here


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// Start the server
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT} 🚀`));