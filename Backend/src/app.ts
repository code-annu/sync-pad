import express from "express";
import { createServer } from "http";
import { connectDB } from "./config/db";
import { authRouter } from "./router/auth-router";

const app = express();
const server = createServer(app);

app.use(express.json());

app.use(authRouter);

const PORT = 3000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is listening at: http://localhost:${PORT}`);
  });
});
