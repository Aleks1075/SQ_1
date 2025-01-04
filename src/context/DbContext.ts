import mongoose from "mongoose";
import { ITask } from "../models/Task.interface";

export class DbContext {
  private static instance: DbContext;
  private constructor() {}

  static getInstance(): DbContext {
    if (!DbContext.instance) {
      DbContext.instance = new DbContext();
    }
    return DbContext.instance;
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect("mongodb://localhost:27017/todo-app", {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 15000,
        connectTimeoutMS: 15000,
      });
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  getModel(name: string) {
    return mongoose.model(name);
  }
}
