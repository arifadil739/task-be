import mongoose, { Document, Schema } from "mongoose";

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

interface Task extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}

const taskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.IN_PROGRESS,
      required: true,
    },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<Task>("Task", taskSchema);

export default Task;
