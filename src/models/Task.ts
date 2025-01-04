import mongoose, { Schema } from "mongoose";
import { ITask } from "./Task.interface";

const TaskSchema = new Schema<ITask>(
  {
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    isFinished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);
