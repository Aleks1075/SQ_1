import { TaskFacade } from "../../services/TaskFacade";
import { DbContext } from "../../context/DbContext";
import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import mongoose from "mongoose";
import { TaskMapper } from "../../services/TaskMapper";

jest.setTimeout(30000);

describe("Task Integration Tests", () => {
  let taskFacade: TaskFacade;
  let taskMapper: TaskMapper;
  let dbContext: DbContext;

  beforeAll(async () => {
    dbContext = DbContext.getInstance();
    await dbContext.connect();
    taskMapper = new TaskMapper(dbContext);
    taskFacade = new TaskFacade();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("should create and persist task", async () => {
    // Test CreateTask
    const now = new Date();
    const task = await taskFacade.createTask("Test", now, false, "Test");

    await taskMapper.addTask(task);
    const taskFromDb = await taskMapper.getTaskById(task.id!);

    expect(taskFromDb?.description).toBe("Test");
    expect(taskFromDb?.deadline).toEqual(now);
    expect(taskFromDb?.isFinished).toBe(false);
    expect(taskFromDb?.category).toBe("Test");
  });

  test("should update and persist task", async () => {
    // Test UpdateTask
    const now = new Date();
    const task = await taskFacade.createTask("Test", now, false, "Test");

    await taskMapper.addTask(task);
    const taskFromDb = await taskMapper.getTaskById(task.id!);

    const updated = await taskFacade.updateTask(
      taskFromDb!.id!,
      "Test2",
      now,
      true,
      "Test2"
    );

    await taskMapper.updateTask(updated!);
    const updatedTask = await taskMapper.getTaskById(task.id!);

    expect(updatedTask?.description).toBe("Test2");
    expect(updatedTask?.deadline).toEqual(now);
    expect(updatedTask?.isFinished).toBe(true);
    expect(updatedTask?.category).toBe("Test2");
  });
});
