import { DashboardRepository } from './dashboard.repository';

export class DashboardService {
  private repository: DashboardRepository;

  constructor() {
    this.repository = new DashboardRepository();
  }

  async execute() {
    return { status: 'Not implemented' };
  }
}
