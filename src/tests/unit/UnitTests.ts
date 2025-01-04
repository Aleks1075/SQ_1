import { TaskFacade } from "../../services/TaskFacade";
import { ITask } from "../../models/Task.interface";
import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import { DbContext } from "../../context/DbContext";
import mongoose from "mongoose";

jest.setTimeout(30000);

describe("TaskFacade Unit Tests", () => {
  let taskFacade: TaskFacade;
  let dbContext: DbContext;

  beforeAll(async () => {
    dbContext = DbContext.getInstance();
    await dbContext.connect();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(() => {
    taskFacade = new TaskFacade();
  });

  test("should create task with valid data", async () => {
    const now = new Date();
    const task = await taskFacade.createTask("Test", now, false, "Test");

    expect(task.description).toBe("Test");
    expect(task.deadline).toEqual(now);
    expect(task.isFinished).toBe(false);
    expect(task.category).toBe("Test");
  });

  test("should update task with new data", async () => {
    const now = new Date();
    const task = await taskFacade.createTask("Test", now, false, "Test");

    const updated = await taskFacade.updateTask(
      task.id!,
      "Test2",
      now,
      true,
      "Test2"
    );

    expect(updated?.description).toBe("Test2");
    expect(updated?.deadline).toEqual(now);
    expect(updated?.isFinished).toBe(true);
    expect(updated?.category).toBe("Test2");
  });

  test("should mark task as finished", async () => {
    const now = new Date();
    const task = await taskFacade.createTask("Test", now, false, "Test");

    const updated = await taskFacade.markAsFinished(task.id!);
    expect(updated?.isFinished).toBe(true);
  });

  test("should mark task as unfinished", async () => {
    const now = new Date();
    const task = await taskFacade.createTask("Test", now, true, "Test");

    const updated = await taskFacade.markAsUnfinished(task.id!);
    expect(updated?.isFinished).toBe(false);
  });

  test("should update task deadline", async () => {
    const now = new Date();
    const task = await taskFacade.createTask("Test", now, false, "Test");

    const newDate = new Date(now.getTime() + 86400000); // add 1 day
    const updated = await taskFacade.updateDeadline(task.id!, newDate);
    expect(updated?.deadline).toEqual(newDate);
  });
});
