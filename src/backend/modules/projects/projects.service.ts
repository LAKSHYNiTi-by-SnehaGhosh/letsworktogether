import { ProjectsRepository } from './projects.repository';

export class ProjectsService {
  private repository: ProjectsRepository;

  constructor() {
    this.repository = new ProjectsRepository();
  }

  async execute() {
    return { status: 'Not implemented' };
  }
}
