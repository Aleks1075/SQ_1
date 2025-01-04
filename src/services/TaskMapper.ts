import { Model } from "mongoose";
import { ITask } from "../models/Task.interface";
import { Task } from "../models/Task";
import { DbContext } from "../context/DbContext";

export class TaskMapper {
  private model: Model<ITask>;

  constructor(private dbContext: DbContext) {
    this.model = Task;
  }

  async addTask(task: ITask): Promise<ITask> {
    const newTask = new this.model(task);
    return await newTask.save();
  }

  async updateTask(task: ITask): Promise<ITask | null> {
    return await this.model.findByIdAndUpdate(task.id, task, { new: true });
  }

  async deleteTask(task: ITask): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(task.id);
    return !!result;
  }

  async getAllTasks(): Promise<ITask[]> {
    return await this.model.find();
  }

  async getTaskById(id: string): Promise<ITask | null> {
    return await this.model.findById(id);
  }
}
