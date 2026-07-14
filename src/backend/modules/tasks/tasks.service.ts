import { TasksRepository } from './tasks.repository';

export class TasksService {
  private repository: TasksRepository;

  constructor() {
    this.repository = new TasksRepository();
  }

  async execute() {
    return { status: 'Not implemented' };
  }
}
