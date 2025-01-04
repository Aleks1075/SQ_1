import { Task } from "../models/Task";
import { ITask } from "../models/Task.interface";

export class TaskFacade {
  async createTask(
    description: string,
    deadline: Date,
    isFinished: boolean,
    category: string
  ): Promise<ITask> {
    const task = new Task({
      description,
      deadline,
      isFinished,
      category,
    });
    return await task.save();
  }

  async addTask(
    description: string,
    deadline: Date,
    isFinished: boolean,
    category: string
  ): Promise<ITask> {
    return await this.createTask(description, deadline, isFinished, category);
  }

  async updateTask(
    taskId: string,
    description: string,
    deadline: Date,
    isFinished: boolean,
    category: string
  ): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(
      taskId,
      { description, deadline, isFinished, category },
      { new: true }
    );
  }

  async updateDeadline(taskId: string, deadline: Date): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(taskId, { deadline }, { new: true });
  }

  async getAllTasks(): Promise<ITask[]> {
    return await Task.find();
  }

  async getTaskById(taskId: string): Promise<ITask | null> {
    return await Task.findById(taskId);
  }

  async markAsFinished(taskId: string): Promise<ITask | null> {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { isFinished: true },
      { new: true }
    );
    return updatedTask;
  }

  async markAsUnfinished(taskId: string): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(
      taskId,
      { isFinished: false },
      { new: true }
    );
  }

  async saveTask(task: ITask): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(task.id, task, { new: true });
  }

  async deleteTask(taskId: string): Promise<boolean> {
    const result = await Task.findByIdAndDelete(taskId);
    return !!result;
  }

  isOverdue(task: ITask): boolean {
    return task.deadline < new Date() && !task.isFinished;
  }
}
