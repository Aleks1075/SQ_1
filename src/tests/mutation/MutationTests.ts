import { TaskFacade } from "../../services/TaskFacade";
import { ITask } from "../../models/Task.interface";
import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";
import { DbContext } from "../../context/DbContext";
import mongoose from "mongoose";

jest.setTimeout(30000);

describe("Task Mutation Tests", () => {
  let taskFacade: TaskFacade;
  let dbContext: DbContext;

  beforeAll(async () => {
    dbContext = DbContext.getInstance();
    await dbContext.connect();
    taskFacade = new TaskFacade();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("should detect deadline mutation", async () => {
    const task = await taskFacade.createTask(
      "Test Task",
      new Date(Date.now() + 86400000),
      false,
      "Test"
    );

    // Mutate deadline check logic
    const isOverdue = taskFacade.isOverdue({
      ...task,
      deadline: new Date(Date.now() - 86400000),
    });

    expect(isOverdue).toBe(true);
  });

  test("should detect completion status mutation", async () => {
    const task = await taskFacade.createTask(
      "Test Task",
      new Date(Date.now() + 86400000),
      false,
      "Test"
    );

    const updated = await taskFacade.markAsFinished(task.id!);
    expect(updated?.isFinished).not.toBe(false);
    expect(updated?.isFinished).toBe(true);
  });

  test("should detect category mutation", async () => {
    const task = await taskFacade.createTask(
      "Test Task",
      new Date(Date.now() + 86400000),
      false,
      "Test Category"
    );

    const updated = await taskFacade.updateTask(
      task.id!,
      "Test Task",
      task.deadline,
      false,
      "New Category"
    );

    expect(updated?.category).not.toBe(task.category);
    expect(updated?.category).toBe("New Category");
  });
});
