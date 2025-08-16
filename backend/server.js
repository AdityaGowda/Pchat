import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => res.send("Pchat Backend Running..."));

// DB + Server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    )
  )
  .catch((err) => console.log(err));
