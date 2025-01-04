export interface ITask {
  id?: string;
  description: string;
  category: string;
  deadline: Date;
  isFinished: boolean;
}
