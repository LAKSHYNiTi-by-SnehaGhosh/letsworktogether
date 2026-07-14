import { TeamsRepository } from './teams.repository';

export class TeamsService {
  private repository: TeamsRepository;

  constructor() {
    this.repository = new TeamsRepository();
  }

  async execute() {
    return { status: 'Not implemented' };
  }
}
