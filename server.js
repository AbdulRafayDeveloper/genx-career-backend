// import express from 'express';
// import dotenv from 'dotenv';
// import connectDb from './config/dbConnection.js';
// import routes from './routes/index.js';
// import cors from "cors";

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(express.static('public'));

// connectDb();
// const port = process.env.PORT || 8000;

// // Use all routes
// app.use(routes);

// // Run the port
// app.listen(port, () => {
//   console.log(`http://localhost:${port}`);
// });


import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/dbConnection.js';
import routes from './routes/index.js';
import cors from "cors";

dotenv.config();

const app = express();

// Explicit CORS options to allow all origins, methods, and headers
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));

connectDb();
const port = process.env.PORT || 8000;

// Use all routes
app.use(routes);

// Run the port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
