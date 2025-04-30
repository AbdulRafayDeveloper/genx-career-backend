import express from "express";
import dotenv from "dotenv";
import "./config/firebaseConfig.js";
import connectDb from "./config/dbConnection.js";
import routes from "./routes/index.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static("public"));

connectDb();
const port = process.env.PORT || 8000;

// Use all routes
app.use(routes);

// Run the port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
