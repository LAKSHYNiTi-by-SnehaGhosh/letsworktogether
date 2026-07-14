import { NotificationsRepository } from './notifications.repository';

export class NotificationsService {
  private repository: NotificationsRepository;

  constructor() {
    this.repository = new NotificationsRepository();
  }

  async execute() {
    return { status: 'Not implemented' };
  }
}
