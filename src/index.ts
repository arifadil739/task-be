import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import taskRoutes from './routes/taskRoutes';
import cors from 'cors';

dotenv.config();
const app: Express = express();
app.use(cors());
app.use(express.json());

app.use('/api/task', taskRoutes);
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });



app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});