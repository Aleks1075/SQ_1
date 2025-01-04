import { DbContext } from "./context/DbContext";
import { TaskFacade } from "./services/TaskFacade";
import readline from "readline";

async function main() {
  try {
    const dbContext = DbContext.getInstance();
    await dbContext.connect();
    const taskFacade = new TaskFacade();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (query: string): Promise<string> => {
      return new Promise((resolve) => rl.question(query, resolve));
    };

    let exit = false;
    while (!exit) {
      console.log("Task Manager");
      console.log("============");
      console.log("1. Add a new Task");
      console.log("2. View all Tasks");
      console.log("3. Update a Task");
      console.log("4. Mark a Task as Finished");
      console.log("5. Mark a Task as Unfinished");
      console.log("6. Delete a Task");
      console.log("7. View a Task by ID");
      console.log("8. Update Deadline");
      console.log("9. Check if tasks are overdue");
      console.log("10. Exit");

      const choice = await question("Select an option: ");

      switch (choice) {
        case "1":
          const description = await question("Enter description: ");
          const deadlineStr = await question("Enter deadline (yyyy-mm-dd): ");
          const deadline = new Date(deadlineStr);
          const isFinished =
            (await question("Is the task finished? (true/false): ")) === "true";
          const category = await question("Enter category: ");
          const task = await taskFacade.createTask(
            description,
            deadline,
            isFinished,
            category
          );
          console.log("Task added successfully!");
          break;

        case "2":
          const tasks = await taskFacade.getAllTasks();
          tasks.forEach((task) => {
            console.log(
              `ID: ${task.id}, Description: ${task.description}, Deadline: ${task.deadline}, Finished: ${task.isFinished}, Category: ${task.category}`
            );
          });
          break;

        case "3":
          const updateId = await question("Enter the Task ID to update: ");
          const taskToUpdate = await taskFacade.getTaskById(updateId);
          if (!taskToUpdate) {
            console.log("Task not found.");
            break;
          }
          const newDescription = await question("Enter new description: ");
          const newDeadlineStr = await question(
            "Enter new deadline (yyyy-mm-dd): "
          );
          const newDeadline = new Date(newDeadlineStr);
          const newIsFinished =
            (await question("Is the task finished? (true/false): ")) === "true";
          const newCategory = await question("Enter new category: ");
          await taskFacade.updateTask(
            updateId,
            newDescription,
            newDeadline,
            newIsFinished,
            newCategory
          );
          console.log("Task updated successfully!");
          break;

        case "4":
          const finishId = await question(
            "Enter the Task ID to mark as finished: "
          );
          await taskFacade.markAsFinished(finishId);
          console.log("Task marked as finished!");
          break;

        case "5":
          const unfinishId = await question(
            "Enter the Task ID to mark as unfinished: "
          );
          await taskFacade.markAsUnfinished(unfinishId);
          console.log("Task marked as unfinished!");
          break;

        case "6":
          const deleteId = await question("Enter the Task ID to delete: ");
          await taskFacade.deleteTask(deleteId);
          console.log("Task deleted successfully!");
          break;

        case "7":
          const viewId = await question("Enter the Task ID to view: ");
          const viewTask = await taskFacade.getTaskById(viewId);
          if (viewTask) {
            console.log(
              `ID: ${viewTask.id}, Description: ${viewTask.description}, Deadline: ${viewTask.deadline}, Finished: ${viewTask.isFinished}, Category: ${viewTask.category}`
            );
          } else {
            console.log("Task not found.");
          }
          break;

        case "8":
          const deadlineId = await question(
            "Enter the Task ID to update deadline: "
          );
          const newTaskDeadlineStr = await question(
            "Enter new deadline (yyyy-mm-dd): "
          );
          const newTaskDeadline = new Date(newTaskDeadlineStr);
          await taskFacade.updateDeadline(deadlineId, newTaskDeadline);
          console.log("Deadline updated successfully!");
          break;

        case "9":
          const allTasks = await taskFacade.getAllTasks();
          allTasks.forEach((task) => {
            if (taskFacade.isOverdue(task)) {
              console.log(`Task ID: ${task.id} is overdue!`);
            }
          });
          break;

        case "10":
          exit = true;
          rl.close();
          await dbContext.disconnect();
          break;

        default:
          console.log("Invalid option. Please try again.");
      }

      if (!exit) {
        await question("\nPress Enter to continue...");
        console.clear();
      }
    }
  } catch (error) {
    console.error("Application error:", error);
    process.exit(1);
  }
}

main();
