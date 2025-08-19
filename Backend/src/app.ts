import express from "express";
import { createServer } from "http";
import { connectDB } from "./config/db";

const app = express();
const server = createServer(app);

app.use(express.json());

const PORT = 3000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is listening at: http://localhost:${PORT}`);
  });
});
