import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/dbConnection.js';
import routes from './routes/index.js';
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDb();
const port = process.env.PORT || 8000;

// Use all routes
app.use(routes);

// Run the port
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
