import { TaskFacade } from "../../services/TaskFacade";
import { DbContext } from "../../context/DbContext";
import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";

jest.setTimeout(30000);

describe("Task Specification Tests", () => {
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

  test("should return true if task is overdue and not finished", async () => {
    const now = new Date();
    const task = await taskFacade.createTask(
      "Test",
      new Date(now.getTime() - 60000), // minus 1 minute
      false,
      "Test"
    );
    expect(taskFacade.isOverdue(task)).toBe(true);
  });

  test("should return false if task is not overdue and not finished", async () => {
    const now = new Date();
    const task = await taskFacade.createTask(
      "Test",
      new Date(now.getTime() + 60000), // plus 1 minute
      false,
      "Test"
    );
    expect(taskFacade.isOverdue(task)).toBe(false);
  });

  test("should return false if task is overdue and finished", async () => {
    const now = new Date();
    const task = await taskFacade.createTask(
      "Test",
      new Date(now.getTime() - 60000), // minus 1 minute
      true,
      "Test"
    );
    expect(taskFacade.isOverdue(task)).toBe(false);
  });

  test("should return false if not overdue and finished", async () => {
    const now = new Date();
    const task = await taskFacade.createTask(
      "Test",
      new Date(now.getTime() + 60000), // plus 1 minute
      true,
      "Test"
    );
    expect(taskFacade.isOverdue(task)).toBe(false);
  });
});
